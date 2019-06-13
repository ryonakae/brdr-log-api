#!/bin/sh

EXEC='docker-compose run --rm wpcli'
EXECWP='docker-compose run --rm wpcli wp --path="/var/www/html"'

# restore wp-content/uploads
eval $EXEC tar -xvf /backup/wp-content-uploads.tar

# restore db by wp-cli
eval $EXECWP db import /backup/db.sql --path='/var/www/html'

# remove backup files
eval $EXEC rm -rf /backup/wp-content-uploads.tar /backup/db.sql

# restart
docker-compose restart
