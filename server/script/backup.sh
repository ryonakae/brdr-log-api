#!/bin/sh

EXEC='docker-compose exec -u www-data wordpress'

# remove backup files
docker-compose run --rm data rm -rf /backup/wp-content-uploads.tar /backup/db.sql

# backup wp-content/uploads
docker-compose run --rm data tar -cvf /backup/wp-content-uploads.tar /var/www/html/wp-content/uploads

# backup db by wp-cli
eval $EXEC wp db export /backup/db.sql --add-drop-table
