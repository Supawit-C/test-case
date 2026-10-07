# Build the TypeScript application and keep only production dependencies in the final image.
FROM node:22-alpine AS build

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY scripts ./scripts
COPY src ./src
RUN npm run build && npm prune --omit=dev

FROM node:22-alpine

ENV NODE_ENV=production
WORKDIR /usr/src/app

COPY --from=build /usr/src/app/package.json /usr/src/app/package-lock.json ./
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

EXPOSE 3000

# Supply the database connection at runtime, for example with -e MONGODB_URI=...
CMD ["npm", "start"]
