<?php
// head内の不要なタグを削除
remove_action('wp_head', 'wp_generator');
remove_action('wp_head', 'wp_shortlink_wp_head');
remove_action('wp_head', 'wlwmanifest_link');
remove_action('wp_head', 'rsd_link');
remove_action('wp_head', 'feed_links_extra', 3); // コメントのRSS
remove_action('wp_head', 'rel_canonical');
remove_action('wp_head', 'rest_output_link_wp_head');
remove_action('wp_head', 'wp_oembed_add_discovery_links');
remove_action('wp_head', 'wp_oembed_add_host_js');
remove_action('wp_head', 'adjacent_posts_rel_link_wp_head');
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');
remove_action('admin_print_scripts', 'print_emoji_detection_script');
remove_action('admin_print_styles', 'print_emoji_styles');

// head内のインラインスタイル削除
function remove_inline_style() {
  global $wp_widget_factory;
  remove_action('wp_head', array($wp_widget_factory->widgets['WP_Widget_Recent_Comments'], 'recent_comments_style'));
}
add_filter('widgets_init', 'remove_inline_style');

// head内のdns-prefetchを削除
function remove_dns_prefetch($hints, $relation_type) {
  if ('dns-prefetch' === $relation_type) {
    return array_diff(wp_dependencies_unique_hosts(), $hints);
  }
  return $hints;
}
add_filter('wp_resource_hints', 'remove_dns_prefetch', 10, 2);

// head内のGutenberg用CSSを削除
add_action( 'wp_enqueue_scripts', 'remove_block_library_style' );
function remove_block_library_style() {
  wp_dequeue_style( 'wp-block-library' );
}

// セルフピンバックの無効化
function disable_pinback(&$links) {
  $home = get_option('home');
  foreach($links as $l => $link)
  if(0 === strpos($link, $home))
  unset($links[$l]);
}
add_filter('pre_ping', 'disable_pinback');

// タグを無効化
function disable_tags() {
  unregister_taxonomy_for_object_type('post_tag', 'post');
}
add_filter('init', 'disable_tags');

// アイキャッチ画像の有効化
add_theme_support('post-thumbnails');

// 画像生成時の画質を変更
function change_image_quality($arg) {
  return 100;
}
add_filter('jpeg_quality', 'change_image_quality');

// 画像のサイズを削除
function delete_image_sizes($sizes) {
  // medium_large(Advanced Custom Fields)
  update_option('medium_large', 0);

  // unset($sizes['thumbnail']);
  unset($sizes['medium']);
  unset($sizes['large']);
  return $sizes;
}
add_filter('intermediate_image_sizes_advanced', 'delete_image_sizes');

// 画像のサイズを追加
// add_image_size('admin_thumbnail', 300, 300, true);
add_image_size('index_eyecatch', 1280, 1280, false);
add_image_size('detail', 2560, 2560, false);

// 投稿に画像をショートコードで挿入する
function my_image_send_to_editor($html, $id, $caption, $title, $align, $url, $size, $alt) {
  $image = wp_get_attachment_image_src($id, $size)[0];

  if ($caption) {
    if ($alt) {
      $html = '[image src="' . $image . '" alt="' . $alt . '" caption="' . $caption . '"]' . "\n";
    } else {
      $html = '[image src="' . $image . '" caption="' . $caption . '"]' . "\n";
    }
  } else {
    if ($alt) {
      $html = '[image src="' . $image . '" alt="' . $alt . '"]' . "\n";
    } else {
      $html = '[image src="' . $image . '"]' . "\n";
    }
  }

  return $html;
}
add_filter('image_send_to_editor', 'my_image_send_to_editor', 10 ,8);

// 画像ショートコードを指定したフォーマットで展開する
function shortcode_image($arg) {
  extract(shortcode_atts(array (
    'src' => '',
    'alt' => '',
    'caption' => ''
  ), $arg));

  if ($alt) {
    $image = '<img src="' . $src . '" alt="' . $alt . '">';
  } else {
    $image = '<img src="' . $src . '">';
  }

  if ($caption) {
    $html = '<figure class="img">' . "\n" .
            '  ' . $image . "\n" .
            '  ' . '<figcaption>' . $caption . '</figcaption>' . "\n" .
            '</figure>';
  } else {
    $html = '<figure class="img">' . "\n" .
            '  ' . $image . "\n" .
            '</figure>';
  }

  return $html;
}
add_shortcode('image', 'shortcode_image');

// 画像をアップロードしたときにファイル名をタイムスタンプに変更
function rename_filename_to_timestamp($filename) {
  $info = pathinfo($filename);
	$ext  = empty($info['extension']) ? '' : '.' . $info['extension'];
	if ($info['filename'] != 'sitemap') {
		$filename = strtolower(time().$ext);
	}
  return $filename;
}
add_filter('sanitize_file_name', 'rename_filename_to_timestamp', 10);

// WP APIに独自のフィールドを追加
function register_rest_specific_fields() {
  // カテゴリーの詳細情報
  register_rest_field('post', '_categories', array(
    'get_callback' => 'get_categories_info'
  ));
}
function get_categories_info($object) {
  $categories = get_the_category($object['id']);
  return $categories;
}
add_action('rest_api_init', 'register_rest_specific_fields');
?>
