FROM nginx:stable

# static files
COPY ./serve /usr/share/nginx/webapp

COPY nginx.prod.conf /etc/nginx/conf.d/default.conf