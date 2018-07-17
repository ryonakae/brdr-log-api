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

// セルフピンバックの無効化
function disable_pinback(&$links) {
  $home = get_option('home');
  foreach($links as $l => $link)
  if(0 === strpos($link, $home))
  unset($links[$l]);
}
add_filter('pre_ping', 'disable_pinback');

// ビジュアルエディタを無効化
function disable_visual_editor(){
  add_filter('user_can_richedit', function(){
    return false;
  });
}
add_filter('load-post.php', 'disable_visual_editor');
add_filter('load-post-new.php', 'disable_visual_editor');

// 投稿の自動保存を無効化
// function disable_autosave() {
//   wp_deregister_script('autosave');
// }
// add_filter('wp_print_scripts', 'disable_autosave');

// カテゴリーを無効化(非表示)
// function disable_categories() {
//   register_taxonomy('category', array());
// }
// add_filter('init', 'disable_categories');
// unregister_widget( 'WP_Widget_Categories' );

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
  update_option('medium_large_size_w', 0);

  unset($sizes['thumbnail']);
	// unset($sizes['medium']);
	unset($sizes['large']);
	return $sizes;
}
add_filter('intermediate_image_sizes_advanced', 'delete_image_sizes');

// 画像のサイズを追加
add_image_size('admin_thumbnail', 300, 300, true);
add_image_size('theme_eyecatch', 2048, 2048, false);

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

// Cloudinary
if (function_exists('cloudinary_url')) {
  // デフォルトのフォーマットを設定
  function set_default_crop($crop) {
    return 'limit';
  }
  function set_default_args($args) {
    $args['transform']['crop'] = 'limit';
    $args['transform']['fetch_format'] = 'auto';
    $args['transform']['quality'] = 'auto:best';
    $args['transform']['flags'] = 'progressive';
    return $args;
  }
  add_filter('cloudinary_default_crop', 'set_default_crop', 10, 1);
  add_filter('cloudinary_default_args', 'set_default_args');

  // productionでだけ本文中の画像URLをCloudinaryのものに置換する
  // developmentではAuto Cloudinaryの設定の「Content Images」のチェックを外す（アイキャッチが表示できなくなるため）
  if (getenv('SERVER_ENV') == 'production') {
    function replace_image_url($content) {
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
    }
    add_filter('the_content', 'replace_image_url');
  }
}

?>
