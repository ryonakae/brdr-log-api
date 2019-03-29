#!/bin/sh

# fix permission of wp-content
docker-compose run --rm data chown -R www-data:www-data /var/www/html/wp-content

# install & activate japanese lang file
docker-compose run --rm wpcli core language install ja
docker-compose run --rm wpcli core language activate ja

# change permalink setting
docker-compose run --rm wpcli rewrite structure '/post/%post_id%'

# activate my theme
docker-compose run --rm wpcli theme activate log

# delete default theme
docker-compose run --rm wpcli theme delete \
  twentyfifteen \
  twentysixteen \
  twentyseventeen \
  twentynineteen

# delete default plugin
docker-compose run --rm wpcli plugin delete \
  akismet \
  hello

# install and actvate plugin
docker-compose run --rm wpcli plugin install --activate \
  update-control \
  wp-multibyte-patch \
  jetpack-markdown \
  disable-comments \
  force-regenerate-thumbnails

# install Advanced Custom Fields & Repeater Field
docker-compose run --rm wpcli plugin install \
  acf-to-rest-api \
  advanced-custom-fields \
  https://cl.ly/3S0C2G3T3w1z/download/acf-repeater.zip
