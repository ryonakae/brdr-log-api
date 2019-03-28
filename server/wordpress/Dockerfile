FROM wordpress:4-php7.1-fpm

# 不足してるPHPライブラリをインストール
RUN apt-get update && apt-get install -y \
  libjpeg-dev \
  libpng-dev

# apt-getでダウンロードしたファイルを削除
RUN rm -rf /var/lib/apt/lists/*

# PHPの拡張をインストール
RUN docker-php-ext-configure gd --with-png-dir=/usr --with-jpeg-dir=/usr
RUN docker-php-ext-install gd pdo pdo_mysql mysqli mbstring

# WP-CLIをインストール
ADD https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar ./
RUN mv ./wp-cli.phar /bin/wp
RUN chown www-data:www-data /bin/wp
RUN chmod +x /bin/wp

# WP-CLIのキャッシュ用ディレクトリを作成&所有者設定
RUN mkdir -p /var/www/.wp-cli
RUN chown -R www-data:www-data /var/www/.wp-cli
