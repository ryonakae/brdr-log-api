#!/bin/sh

EXECWP='docker-compose run --rm wpcli wp --path="/var/www/html"'

eval $EXECWP core update
eval $EXECWP core update-db
eval $EXECWP plugin update --all
eval $EXECWP theme update --all
eval $EXECWP core language update

# restart
docker-compose restart
