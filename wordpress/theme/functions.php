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
add_filter('wp_editor_set_quality', 'change_image_quality');

// 画像のサイズを削除
function disable_image_sizes($new_sizes) {
  unset($new_sizes['thumbnail']);
  unset($new_sizes['medium']);
  unset($new_sizes['large']);
  unset($new_sizes['medium_large']);
  unset($new_sizes['1536x1536']);
  unset($new_sizes['2048x2048']);
  return $new_sizes;
}
add_filter('intermediate_image_sizes_advanced', 'disable_image_sizes');
add_filter('big_image_size_threshold', '__return_false');

// 画像のアップロード後に画像を圧縮(可逆or非可逆)
function compress_images($metadata, $img_id) {
  // 元画像のフルパス
  $org_path = get_attached_file($img_id);

  // 画像のファイルタイプを取得
  $img_type = get_post_mime_type($img_id);

  // ファイルタイプがJPEGの場合
  if ($img_type == 'image/jpeg') {
    //非可逆圧縮後に可逆圧縮
    $output = shell_exec("cjpeg -quality 85 '$org_path' > '$org_path.jpg' && jpegtran -optimise -copy none -outfile '$org_path' '$org_path.jpg' && rm '$org_path.jpg'");

    // 全てのサムネイルを圧縮
    foreach ($metadata['sizes'] as $size => $value) {
      // 全てのサムネイルのフルパスを取得
      $thumb_path = dirname($org_path).'/'.$value['file'];

      // 全てのサムネイルを非可逆圧縮後に可逆圧縮
      $output = shell_exec("cjpeg -quality 85 '$thumb_path' > '$thumb_path.jpg' && jpegtran -optimise -copy none -outfile '$thumb_path' '$thumb_path.jpg' && rm '$thumb_path.jpg'");
    }
  }

	// ファイルタイプがPNGの場合
  if ($img_type == 'image/png') {
    // 非可逆圧縮
    $output = shell_exec("pngquant --ext .png --quality=80-90 -s1 --force '$org_path'");

    // 全てのサムネイルを圧縮
    foreach ($metadata['sizes'] as $size => $value) {
      // 全てのサムネイルのフルパスを取得
      $thumb_path = dirname($org_path).'/'.$value['file'];

      // 非可逆圧縮
      $output = shell_exec("pngquant --ext .png --quality=80-90 -s1 --force '$thumb_path'");
    }
  }

  return $metadata;
}
add_filter('wp_generate_attachment_metadata', 'compress_images', 10, 2);

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

  // htmlタグなしの抜粋の取得
  register_rest_field('post', '_excerpt', array(
    'get_callback' => 'get_excerpt_info'
  ));
}
function get_categories_info($object) {
  $categories = get_the_category($object['id']);
  return $categories;
}
function get_excerpt_info($object) {
  global $post;
  $post = $object['id'];
  $excerpt = get_the_excerpt();
  return $excerpt;
}
add_action('rest_api_init', 'register_rest_specific_fields');

// Gutenbergエディタに独自のスタイルを適用する
function apply_editor_style() {
  add_theme_support('editor-styles');
  add_editor_style('style-editor.css');
}
add_action('after_setup_theme', 'apply_editor_style');
?>
