FROM node:8 as builder
MAINTAINER a307793

WORKDIR /build

COPY ./package.json /build
COPY ./package-lock.json /build
RUN npm install
COPY . /build
RUN ng test
RUN ng build


FROM nginx
MAINTAINER a307793

ENV ALLOW_HUP true
ENV ROTATE_LOGS true

COPY --from=builder /build/dist/ /usr/share/nginx/html/
COPY --from=builder /build/dist/.htaccess /usr/share/nginx/html/
COPY --from=builder /build/nginx-conf/default.conf /etc/nginx/conf.d/

CMD nginx -g "daemon off;"
