#!/bin/sh

EXEC='docker-compose exec -u www-data wordpress'
EXEC_ROOT='docker-compose exec -u root wordpress'

# fix permission of wp-content
eval $EXEC_ROOT chown -R www-data:www-data /var/www/html/wp-content

# install & activate japanese lang file
eval $EXEC wp core language install ja
eval $EXEC wp site switch-language ja

# change permalink setting
eval $EXEC wp rewrite structure '/post/%post_id%'

# activate my theme
eval $EXEC wp theme activate log

# delete default theme
eval $EXEC wp theme delete \
  twentyfifteen \
  twentysixteen \
  twentyseventeen

# delete default plugin
eval $EXEC wp plugin delete \
  akismet \
  hello

# install and actvate plugin
eval $EXEC wp plugin install --activate \
  update-control \
  wp-multibyte-patch \
  jetpack-markdown \
  disable-comments \
  force-regenerate-thumbnails

# install Advanced Custom Fields & Repeater Field
eval $EXEC wp plugin install \
  acf-to-rest-api \
  advanced-custom-fields \
  https://cl.ly/3S0C2G3T3w1z/download/acf-repeater.zip
