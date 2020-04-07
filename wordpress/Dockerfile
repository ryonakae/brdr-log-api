FROM wordpress:5.4.0-php7.4-fpm

# 不足してるPHPライブラリをインストール
RUN apt-get update && apt-get install -y \
  # for gd
  libjpeg-dev \
  libpng-dev \
  libfreetype6-dev \
  # for oniguruma
  libonig-dev \
  # for mozjpeg & pngquant
  zlib1g-dev \
  autoconf \
  automake \
  build-essential \
  libtool \
  nasm \
  wget

# apt-getでダウンロードしたファイルを削除
RUN rm -rf /var/lib/apt/lists/*

# PHPの拡張をインストール
RUN docker-php-ext-configure gd --with-freetype=/usr/include/ --with-jpeg=/usr/include/
RUN docker-php-ext-install gd pdo pdo_mysql mysqli

# mozjpegをインストール
WORKDIR /home
RUN wget https://github.com/mozilla/mozjpeg/archive/v3.3.1.tar.gz
RUN tar -zxvf /home/v3.3.1.tar.gz
WORKDIR /home/mozjpeg-3.3.1
RUN autoreconf -fiv
RUN ./configure
RUN make
RUN make install
RUN ln -s /opt/mozjpeg/bin/* /usr/local/bin/
RUN rm -rf /home/v3.3.1.tar.gz /home/mozjpeg-3.3.1
WORKDIR /var/www/html

# pngquantをインストール
WORKDIR /home
RUN wget http://pngquant.org/pngquant-2.12.5-src.tar.gz
RUN tar -zxvf /home/pngquant-2.12.5-src.tar.gz
WORKDIR /home/pngquant-2.12.5
RUN ./configure
RUN make
RUN make install
RUN rm -rf /home/pngquant-2.12.5-src.tar.gz /home/pngquant-2.12.5
WORKDIR /var/www/html
