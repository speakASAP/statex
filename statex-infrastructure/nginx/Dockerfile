FROM nginx:alpine

# Install envsubst
RUN apk add --no-cache gettext

# Copy template and startup script
COPY api-gateway.conf.template /etc/nginx/templates/
COPY nginx.conf /etc/nginx/nginx.conf
COPY start-nginx.sh /start-nginx.sh
RUN chmod +x /start-nginx.sh

# Use our custom startup script
CMD ["/start-nginx.sh"]
