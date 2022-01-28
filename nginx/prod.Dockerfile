FROM nginx:stable

# static files
COPY ./static /usr/share/nginx/webapp/static

COPY nginx.prod.conf /etc/nginx/conf.d/default.conf