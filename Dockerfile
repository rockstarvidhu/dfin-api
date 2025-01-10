###################
# BASE IMAGE
###################

FROM node:22 AS base
RUN npm install -g pnpm
WORKDIR /usr/src/app
COPY package*.json ./
COPY pnpm-lock.yaml ./

###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM base AS development
RUN  pnpm install --force
COPY . .
USER node

###################
# BUILD FOR PRODUCTION
###################

FROM base AS build
RUN pnpm fetch --prod
COPY --from=development /usr/src/app/node_modules ./node_modules
COPY . .
RUN pnpm run build \
    && NODE_ENV=production pnpm install -r --offline --prod
USER node

###################
# PRODUCTION
###################

FROM base AS production
COPY --from=build /usr/src/app/ .
CMD [ "node", "dist/main.js" ]
