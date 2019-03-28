FROM adorsys/nginx:alpine

LABEL maintainer="https://github.com/adorsys/p2p-lending"

COPY nginx.conf /etc/nginx/conf.default.d/
COPY dist /usr/share/nginx/html/

EXPOSE 8080