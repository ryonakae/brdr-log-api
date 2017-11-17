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
add_filter('widgets_init', function() {
  global $wp_widget_factory;
  remove_action('wp_head', array($wp_widget_factory->widgets['WP_Widget_Recent_Comments'], 'recent_comments_style'));
});

// head内のdns-prefetchを削除
add_filter('wp_resource_hints', function($hints, $relation_type) {
  if ('dns-prefetch' === $relation_type) {
    return array_diff(wp_dependencies_unique_hosts(), $hints);
  }
  return $hints;
}, 10, 2);

// アイキャッチ画像の有効化
add_theme_support('post-thumbnails');

// 画像生成時の画質を変更
add_filter('jpeg_quality', function($arg){ return 100; });

// 画像のサイズを削除
add_filter('intermediate_image_sizes_advanced', function($sizes){
  // medium_large(Advanced Custom Fields)
  update_option('medium_large_size_w', 0);

  unset($sizes['thumbnail']);
	// unset($sizes['medium']);
	unset($sizes['large']);
	return $sizes;
});

// 画像のサイズを追加
add_image_size('admin_thumbnail', 300, 300, true);
add_image_size('theme_eyecatch', 2048, 2048, false);

// セルフピンバックの無効化
add_filter('pre_ping', function(&$links) {
  $home = get_option('home');
  foreach($links as $l => $link)
  if(0 === strpos($link, $home))
  unset($links[$l]);
});

// ビジュアルエディタを無効化
function disable_visual_editor(){
  add_filter('user_can_richedit', function(){ return false; });
}
add_filter('load-post.php', 'disable_visual_editor');
add_filter('load-post-new.php', 'disable_visual_editor');

// 投稿の自動保存を無効化
// add_filter('wp_print_scripts', function() {
//   wp_deregister_script('autosave');
// });

// カテゴリーを無効化(非表示)
// add_filter('init', function() {
//   register_taxonomy('category', array());
// });
// unregister_widget( 'WP_Widget_Categories' );

// タグを無効化
add_filter('init', function() {
  unregister_taxonomy_for_object_type('post_tag', 'post');
});

// 投稿に画像を挿入するときのフォーマットを変更
function my_get_image_tag($html, $id, $alt, $title, $align, $size){
  $html = preg_replace('/ width="\d+"/', '', $html);
  $html = preg_replace('/ height="\d+"/', '', $html);
  $html = preg_replace('/ class=".+"/', '', $html);
  $html = preg_replace('/ title=".+"/', '', $html);
  return $html;
}
add_filter('get_image_tag', 'my_get_image_tag', 1 ,6);

function my_image_send_to_editor( $html, $id, $caption, $title, $align, $url, $size ) {
  $html = preg_replace('/<a href=".+">/', '', $html);
  $html = preg_replace('/<\/a>/', '', $html);
  $html = preg_replace('/" \/>/', '">', $html);

  if ($caption) {
    $html = '<p class="img">' . "\n" .
            $html . "\n" .
            '<small>' . $caption . '</small>'  . "\n" .
            '</p>';
  }
  else {
    $html = "\n" . '<p class="img">' . $html . '</p>';
  }

  return $html;
}
add_filter('image_send_to_editor', 'my_image_send_to_editor', 10 ,7);

// 画像をアップロードしたときにファイル名をタイムスタンプに変更
add_filter('sanitize_file_name', function($filename) {
  $info = pathinfo($filename);
	$ext  = empty($info['extension']) ? '' : '.' . $info['extension'];
	if ($info['filename'] != 'sitemap') {
		$filename = strtolower(time().$ext);
	}
  return $filename;
}, 10);

// Cloudinary
if (function_exists('cloudinary_url')) {
  // デフォルトのフォーマットを設定
  add_filter('cloudinary_default_crop', function($crop) {
    return 'limit';
  }, 10, 1);
  add_filter('cloudinary_default_args', function($args) {
    $args['transform']['fetch_format'] = 'auto';
    $args['transform']['quality'] = 'auto:best';
    $args['transform']['flags'] = 'progressive';
    return $args;
  });

  // productionでだけ本文中の画像URLをCloudinaryのものに置換する
  // developmentではAuto Cloudinaryの設定の「Content Images」のチェックを外す（アイキャッチが表示できなくなるため）
  if (getenv('SERVER_ENV') == 'production') {
    add_filter('the_content', function($content) {
      $pattern = '/<img.*?src=(["\'])(.+?)\1.*?>/i';
      preg_match_all($pattern, $content, $matches);

      foreach ($matches[2] as $url) {
        $content = str_replace($url, cloudinary_url($url, array(
          'transform' => array(
            'width' => 1440,
            'height' => 1440,
          )
        )), $content);
      }

      return $content;
    });
  }
}

?>
