#!/bin/sh

# restore wp-content/uploads
docker-compose run --rm data tar -xvf /backup/wp-content-uploads.tar

# restore db by wp-cli
docker-compose run --rm wpcli db import /backup/db.sql

# remove backup files
docker-compose run --rm data rm -rf /backup/wp-content-uploads.tar /backup/db.sql

# restart
docker-compose restart
