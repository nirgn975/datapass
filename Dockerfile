FROM node:lts AS builder
WORKDIR /usr/src/app
COPY ./ ./

# Install production dependencies.
RUN npm install --production
RUN cp -RL /usr/src/app/node_modules/ /tmp/node_modules/

# Build the project.
RUN npm install
RUN npm run build

FROM node:lts
WORKDIR /usr/src/app
USER node
COPY --from=builder /usr/src/app/dist ./dist/
COPY --from=builder /tmp/node_modules/ ./node_modules/
COPY --from=builder /usr/src/app/package.json ./package.json
CMD ["npm", "run", "start:prod"]
