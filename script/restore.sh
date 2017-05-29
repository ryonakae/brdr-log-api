#!/bin/sh

# restore wp-content/uploads
docker-compose run --rm data tar xvf /backup/wp-content-uploads.tar

# restore db by wp-cli
docker-compose run --rm wpcli db import /backup/db.sql

# run setup script
sh ./script/setup.sh

# restart
docker-compose restart

# delete backup files
# rm -rf $(pwd)/backup/db.sql
# rm -rf $(pwd)/backup/wp-content-uploads.tar
