#!/bin/sh

EXEC='docker-compose exec -u www-data wordpress'

eval $EXEC wp core update
eval $EXEC wp plugin update --all
eval $EXEC wp theme update --all
eval $EXEC wp core language update
