#!/bin/sh

EXEC='docker-compose run --rm wpcli'
EXECWP='docker-compose run --rm wpcli wp --path="/var/www/html"'

# remove backup files
eval $EXEC rm -rf /backup/wp-content-uploads.tar /backup/db.sql

# backup wp-content/uploads
eval $EXEC tar -cvf /backup/wp-content-uploads.tar /var/www/html/wp-content/uploads

# backup db by wp-cli
eval $EXECWP db export /backup/db.sql --add-drop-table
