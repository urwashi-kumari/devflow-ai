FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

COPY apps ./apps
COPY packages ./packages

RUN pnpm config set fetch-timeout 600000 && \
    pnpm config set fetch-retries 5 && \
    pnpm install --frozen-lockfile

RUN pnpm --filter server exec prisma generate

RUN pnpm --filter server build

EXPOSE 3000

CMD ["pnpm", "--filter", "server", "start:prod"]