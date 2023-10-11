FROM docker.io/library/node:lts-alpine AS base

# Prepare work directory
WORKDIR /ssgpt

FROM base AS builder

# Prepare pnpm https://pnpm.io/installation#using-corepack
RUN corepack enable

# Prepare deps
RUN apk update
RUN apk add git --no-cache

# Prepare build deps ( ignore postinstall scripts for now )
COPY package.json ./
COPY .npmrc ./
COPY pnpm-lock.yaml ./
RUN pnpm i --frozen-lockfile --ignore-scripts

# Copy all source files
COPY . ./

# Run full install with every postinstall script ( This needs project file )
RUN pnpm i --frozen-lockfile

# Build
RUN pnpm build

FROM base AS runner

ARG UID=911
ARG GID=911

# Create a dedicated user and group
RUN set -eux; \
    addgroup -g $GID ssgpt; \
    adduser -u $UID -D -G ssgpt ssgpt;

USER ssgpt

ENV NODE_ENV=production

COPY --from=builder /ssgpt/.output ./.output

EXPOSE 5314/tcp

ENV PORT=5314

# Specify container only environment variables ( can be overwritten by runtime env )
ENV NUXT_STORAGE_FS_BASE='/ssgpt/data'

# Persistent storage data
VOLUME [ "/ssgpt/data" ]

CMD ["node", ".output/server/index.mjs"]
