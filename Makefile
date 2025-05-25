up:
	docker-compose up -d
build:
	docker-compose build
down:
	docker-compose down -v
restart:
	@make down
	@make build
	@make up
action-frontend:
	act -j "frontend" --container-architecture=linux/amd64
action-backend:
	act -j "backend" --container-architecture=linux/amd64