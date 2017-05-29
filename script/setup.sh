#!/bin/sh

# install & activate japanese lang file
docker-compose run --rm wpcli core language install ja
docker-compose run --rm wpcli core language activate ja

# remove default plugin
docker-compose run --rm wpcli plugin delete \
  akismet \
  hello

# install and actvate plugin
docker-compose run --rm wpcli plugin install --activate \
  acf-to-rest-api \
  advanced-custom-fields \
  https://cl.ly/3S0C2G3T3w1z/download/acf-repeater.zip \
  update-control \
  wp-multibyte-patch \
  jetpack-markdown \
  disable-comments \
  disable-post-revision
