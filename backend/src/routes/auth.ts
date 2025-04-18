import { createRoute } from '@hono/zod-openapi';

export const findExistingUserRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Auth'],
  summary: 'ユーザーの存在チェック',
  responses: {
    200: {
      description: 'ユーザーが存在する',
    },
    201: {
      description: '新規ユーザー登録完了',
    },
    401: {
      description: 'ユーザー登録失敗',
    },
    500: {
      description: 'サーバーでエラー発生',
    },
  },
});
