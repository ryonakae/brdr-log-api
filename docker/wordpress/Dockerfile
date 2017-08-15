FROM wordpress:4.8.1-php7.1-fpm

# 不足してるPHPライブラリをインストール
RUN apt-get update && apt-get install -y \
  libjpeg-dev \
  libpng12-dev

# apt-getでダウンロードしたファイルを削除
RUN rm -rf /var/lib/apt/lists/*

# PHPの拡張をインストール
RUN docker-php-ext-configure gd --with-png-dir=/usr --with-jpeg-dir=/usr
RUN docker-php-ext-install gd pdo pdo_mysql mysqli mbstring
