.PHONY: all
all: prod

.PHONY: dev
dev:
	python3 make.py dev
	while inotifywait -r content; do \
		python3 make.py dev; \
	done

.PHONY: prod
prod:
	python3 make.py prod
