build:
	pnpm install; \
	pnpm build;

publish: build
	pnpm publish;

lint:
	pnpm lint;

lint-fix:
	pnpm lint --fix;

lint-staged:
	pnpm lint-staged;
