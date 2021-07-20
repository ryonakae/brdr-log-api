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
EXECWP='docker-compose run --rm wpcli wp --path="/var/www/html"'

# fix permission of wp-content
eval $EXEC chown -R www-data:www-data /var/www/html/wp-content

# install wordpress
eval $EXECWP core install \
  --url=$1 \
  --title=$2 \
  --admin_user=$3 \
  --admin_password=$4 \
  --admin_email=$5

# update wordpress
eval $EXECWP core update
eval $EXECWP core update-db

# change timezone
eval $EXECWP option update timezone_string 'Asia/Tokyo'

# change permalink setting
eval $EXECWP rewrite structure '/post/%post_id%'

# activate headless theme
eval $EXECWP theme activate headless

# delete default theme
eval $EXECWP theme delete \
  twentyseventeen \
  twentynineteen \
  twentytwenty \
  twentytwentyone

# delete default plugin
eval $EXECWP plugin delete \
  akismet \
  hello

# install and actvate plugin
eval $EXECWP plugin install --activate \
  disable-comments \
  force-regenerate-thumbnails \
  update-control \
  wp-multibyte-patch \
  wp-jamstack-deployments \
  headless-mode

# install & activate japanese lang file
eval $EXECWP core language install ja --activate
eval $EXECWP core language update

# restart
docker-compose restart
