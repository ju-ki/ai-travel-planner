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