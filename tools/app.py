import os
import json
import requests
from typing import Dict, Any, Optional, List

NOTION_VERSION = "2022-06-28"
NOTION_URL = "https://api.notion.com/v1"

# 環境変数の読み込み
def get_env_var(name: str) -> str:
    value = os.environ.get(name)
    if not value:
        raise EnvironmentError(f"Missing environment variable: {name}")
    return value

notion_token = get_env_var("NOTION_API_KEY")
database_id = get_env_var("NOTION_DATABASE_ID")
project_id = get_env_var("PROJECT_ID")
github_token = get_env_var("GITHUB_TOKEN")
github_repo = get_env_var("GITHUB_REPO")

headers_notion = {
    "Authorization": f"Bearer {notion_token}",
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json"
}

# すでにNotionにあるIssue番号をすべて取得
def get_existing_github_numbers() -> List[int]:
    query_url = f"{NOTION_URL}/databases/{database_id}/query"
    existing_numbers = []
    start_cursor = None

    while True:
        payload = {"page_size": 100}
        if start_cursor:
            payload["start_cursor"] = start_cursor

        res = requests.post(query_url, headers=headers_notion, json=payload)
        if not res.ok:
            raise Exception(f"Failed to query Notion database: {res.status_code} - {res.text}")

        data = res.json()
        for result in data.get("results", []):
            props = result.get("properties", {})
            number = props.get("Github Number", {}).get("number")
            if number is not None:
                existing_numbers.append(number)

        if not data.get("has_more"):
            break
        start_cursor = data.get("next_cursor")

    return existing_numbers

# GitHubから全てのIssueのみ取得
def fetch_all_issues_graphql() -> List[Dict[str, Any]]:
    query = """
    query($owner: String!, $name: String!, $cursor: String) {
      repository(owner: $owner, name: $name) {
        issues(first: 100, after: $cursor, orderBy: {field: CREATED_AT, direction: DESC}) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            number
            title
            state
            url
          }
        }
      }
    }
    """

    headers = {
        "Authorization": f"Bearer {github_token}",
        "Content-Type": "application/json"
    }

    owner, repo = github_repo.split("/")
    issues = []
    cursor = None

    while True:
        variables = {
            "owner": owner,
            "name": repo,
            "cursor": cursor
        }

        res = requests.post(
            "https://api.github.com/graphql",
            headers=headers,
            json={"query": query, "variables": variables}
        )

        if not res.ok:
            raise Exception(f"GitHub GraphQL error: {res.status_code} - {res.text}")

        data = res.json()
        issue_nodes = data["data"]["repository"]["issues"]["nodes"]
        issues.extend(issue_nodes)

        page_info = data["data"]["repository"]["issues"]["pageInfo"]
        if not page_info["hasNextPage"]:
            break
        cursor = page_info["endCursor"]

    return issues

# Notionページの作成・更新
def build_payload(issue: Dict[str, Any]) -> Dict[str, Any]:
    state = issue["state"]
    status_name = "Closed" if state.upper() == "CLOSED" else "Open"
    return {
        "parent": {"database_id": database_id},
        "properties": {
            "Name": {"title": [{"text": {"content": issue["title"]}}]},
            "Github Number": {"number": issue["number"]},
            "URL": {"url": issue["url"]},
            "Status": {"status": {"name": status_name}},
            "Multi-select": {"relation": [{"id": project_id}]}
        }
    }

def create_page(issue: Dict[str, Any]):
    payload = build_payload(issue)
    res = requests.post(f"{NOTION_URL}/pages", headers=headers_notion, json=payload)
    print(f"[CREATE] Issue #{issue['number']} → {res.status_code}")

def update_page(page_id: str, issue: Dict[str, Any]):
    payload = {"properties": build_payload(issue)["properties"]}
    res = requests.patch(f"{NOTION_URL}/pages/{page_id}", headers=headers_notion, json=payload)
    print(f"[UPDATE] Issue #{issue['number']} → {res.status_code}")

def search_notion_issue(number: int) -> Optional[str]:
    """GitHub番号でNotion内のページを検索し、存在すればページIDを返す"""
    query_url = f"{NOTION_URL}/databases/{database_id}/query"
    payload = {
        "filter": {
            "property": "Github Number",
            "number": {"equals": number}
        }
    }
    res = requests.post(query_url, headers=headers_notion, json=payload)
    if res.ok:
        results = res.json().get("results", [])
        if results:
            return results[0]["id"]
    return None

# メイン同期処理
def sync_issues():
    github_issues = fetch_all_issues_graphql()
    existing_numbers = get_existing_github_numbers()

    if not existing_numbers:
        print("Notion DB is empty. Performing bulk insert...")
        for issue in github_issues:
            create_page(issue)
    else:
        print("Notion DB already has issues. Syncing updates...")
        for issue in github_issues:
            if issue["number"] in existing_numbers:
                page_id = search_notion_issue(issue["number"])
                if page_id:
                    update_page(page_id, issue)
            else:
                create_page(issue)

# 実行
if __name__ == "__main__":
  try:
    sync_issues()
    print("Sync completed successfully!")
  except Exception as e:
    print(f"Sync failed: {e}")
    exit(1)
