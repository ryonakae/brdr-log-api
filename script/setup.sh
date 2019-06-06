#!/bin/sh

if [ "$1" = "" ]; then
  echo 'url not found.'
  exit 1
elif [ "$2" = "" ]; then
  echo 'title not found.'
  exit 1
elif [ "$3" = "" ]; then
  echo 'admin_user not found.'
  exit 1
elif [ "$4" = "" ]; then
  echo 'admin_password not found.'
  exit 1
elif [ "$5" = "" ]; then
  echo 'admin_email not found.'
  exit 1
fi

EXEC='docker-compose run --rm wpcli'

# fix permission of wp-content
docker-compose exec -u root data chown -R www-data:www-data /var/www/html/wp-content

# install wordpress
eval $EXEC wp core install \
  --url=$1 \
  --title=$2 \
  --admin_user=$3 \
  --admin_password=$4 \
  --admin_email=$5

# update wordpress
eval $EXEC wp core update
eval $EXEC wp core update-db

# install & activate japanese lang file
eval $EXEC wp core language install ja
eval $EXEC wp site switch-language ja

# change permalink setting
eval $EXEC wp rewrite structure '/post/%post_id%'

# activate headless theme
eval $EXEC wp theme activate headless

# delete default theme
eval $EXEC wp theme delete \
  twentyfifteen \
  twentysixteen \
  twentyseventeen \
  twentynineteen

# delete default plugin
eval $EXEC wp plugin delete \
  akismet \
  hello

# install and actvate plugin
eval $EXEC wp plugin install --activate \
  disable-comments \
  force-regenerate-thumbnails \
  update-control \
  wp-multibyte-patch
