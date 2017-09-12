#!/bin/sh

git pull origin master
cd theme
npm install
npm run build
