FROM node:22-alpine

WORKDIR /app

# No package.json on purpose: this fixture must not be able to fail because of a dependency.
COPY server.js ./

# Surfaced at /health so a deployment can be told apart from the one before it.
ARG APP_VERSION=dev
ENV APP_VERSION=$APP_VERSION

RUN addgroup -S app && adduser -S app -G app
USER app

EXPOSE 8081
CMD ["node", "server.js"]
