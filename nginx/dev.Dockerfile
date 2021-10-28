FROM nginx:stable

COPY nginx.dev.conf /etc/nginx/conf.d/default.conf