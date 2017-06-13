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
function remove_recent_comments_style() {
  global $wp_widget_factory;
  remove_action('wp_head', array( $wp_widget_factory->widgets['WP_Widget_Recent_Comments'], 'recent_comments_style'));
}
add_action('widgets_init', 'remove_recent_comments_style');

// head内のdns-prefetchを削除
function remove_dns_prefetch($hints, $relation_type) {
  if ('dns-prefetch' === $relation_type) {
    return array_diff(wp_dependencies_unique_hosts(), $hints);
  }
  return $hints;
}
add_filter('wp_resource_hints', 'remove_dns_prefetch', 10, 2);

// アイキャッチ画像の有効化
add_theme_support('post-thumbnails');

// アイキャッチ画像生成時の画質を変更
add_filter('jpeg_quality', function($arg){return 95;});

// セルフピンバックの無効化
function no_self_ping(&$links){
  $home = get_option('home');
  foreach($links as $l => $link)
  if(0 === strpos($link, $home))
  unset($links[$l]);
}
add_action('pre_ping', 'no_self_ping');

// ビジュアルエディタを無効化
function disable_visual_editor_mypost(){
  add_filter('user_can_richedit', 'disable_visual_editor_filter');
}
function disable_visual_editor_filter(){
  return false;
}
add_action('load-post.php', 'disable_visual_editor_mypost');
add_action('load-post-new.php', 'disable_visual_editor_mypost');

// 投稿の自動保存を無効化
function disable_autosave() {
  wp_deregister_script('autosave');
}
add_action('wp_print_scripts', 'disable_autosave');

// 投稿に画像を挿入するときのフォーマットを変更
function my_remove_img_attr($html, $id, $alt, $title, $align, $size){
  $html = preg_replace('/ width="\d+"/', '', $html);
  $html = preg_replace('/ height="\d+"/', '', $html);
  $html = preg_replace('/ class=".+"/', '', $html);
  $html = preg_replace('/ title=".+"/', '', $html);
  return $html;
}
add_action('get_image_tag', 'my_remove_img_attr', 1 ,6);

function my_image_send_to_editor( $html, $id, $caption, $title, $align, $url, $size ) {
  $html = preg_replace('/<a href=".+">/', '', $html);
  $html = preg_replace('/<\/a>/', '', $html);
  $html = preg_replace('/" \/>/', '">', $html);

  if ($caption) {
    $html = '<p class="img">' . "\n" .
            $html . "\n" .
            '<small class="caption">' . $caption . '</small>' . "\n" .
            '</p>';
  }
  else {
    $html = '<p class="img">' . $html . '</p>';
  }

  return $html;
}
add_action('image_send_to_editor', 'my_image_send_to_editor', 10 ,7);
?>
