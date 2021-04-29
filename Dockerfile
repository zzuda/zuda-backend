FROM node:12

EXPOSE 8080

COPY / /workspace
WORKDIR /workspace

RUN yarn && yarn build

CMD ["yarn", "start:prod"]
