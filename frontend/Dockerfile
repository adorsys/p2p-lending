FROM adorsys/nginx:latest

LABEL maintainer "https://github.com/adorsys/p2p-lending"

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html/

EXPOSE 8080