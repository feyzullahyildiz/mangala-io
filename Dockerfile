FROM node:12-alpine

WORKDIR /home/node/app/
USER root
RUN chown node:node /home/node/app/
COPY --chown=node:node frontend /home/node/app/frontend
COPY --chown=node:node backend /home/node/app/backend

USER node

WORKDIR /home/node/app/frontend
RUN npm i
RUN npm run build
RUN rm -rf node_modules
WORKDIR /home/node/app/backend
RUN npm i

CMD [ "npm", "start" ]