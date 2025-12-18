#!/bin/bash
npm run build && \
sudo rm -rf /var/www/movies/* && \
sudo cp -r dist/* /var/www/movies/ && \
sudo chown -R www-data:www-data /var/www/movies && \
sudo systemctl reload nginx && \
echo "movies deployed successfully!"
