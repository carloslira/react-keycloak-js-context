build:
	pnpm install; \
	pnpm build;

publish: build
	pnpm publish;
