# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.14.0
FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV=production
WORKDIR /usr/src/app

RUN corepack enable && corepack prepare yarn@4.9.1 --activate

# 👇 Make sure .yarnrc.yml is copied along with package files
COPY package.json yarn.lock .yarnrc.yml ./

# This will now install using node_modules
RUN yarn install

COPY . .

CMD ["yarn", "start"]
