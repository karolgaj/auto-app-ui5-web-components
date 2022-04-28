FROM node:18 as builder
MAINTAINER a307793

WORKDIR /build

RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN apt-get update && apt-get install -y google-chrome-stable

COPY ./package.json /build
COPY ./package-lock.json /build

RUN npm ci
COPY . /build
RUN npm run test:ci
RUN npm run build


FROM nginx
MAINTAINER a307793

ENV ALLOW_HUP true
ENV ROTATE_LOGS true

COPY --from=builder /build/dist/ /usr/share/nginx/html/
COPY --from=builder /build/dist/.htaccess /usr/share/nginx/html/
COPY --from=builder /build/nginx-conf/default.conf /etc/nginx/conf.d/

CMD nginx -g "daemon off;"
