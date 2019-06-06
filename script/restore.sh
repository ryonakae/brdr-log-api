#!/bin/sh

EXEC='docker-compose run --rm wpcli'

# restore wp-content/uploads
eval $EXEC tar -xvf /backup/wp-content-uploads.tar

# restore db by wp-cli
eval $EXEC wp db import /backup/db.sql

# remove backup files
eval $EXEC rm -rf /backup/wp-content-uploads.tar /backup/db.sql

# restart
docker-compose restart
