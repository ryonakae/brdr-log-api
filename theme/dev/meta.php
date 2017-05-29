<?php
  $title = '';
  $description = '';
  $og_url = '';
  $og_type = '';
  $og_image = '';

  // 詳細(single, page)のとき
  if (is_single() || is_page()) {
    $title = wp_title('-', false, 'right').get_bloginfo('name');
    $og_url = get_permalink();
    $og_type = 'article';

    // description
    // 抜粋がある
    if (get_the_excerpt() != '') {
      $description = get_the_excerpt();
    }
    // 抜粋がない→本文から指定文字数をdescriptionにする
    else {
      $post_id = get_the_ID();
      $post = get_post($post_id);
      $content = $post->post_content;
      $content = apply_filters('the_content', $content);
      $content = strip_tags($content);
      $content = str_replace(" ", "", $content);
      $content = str_replace("　", "", $content);
      $description = mb_strimwidth($content, 0, 100, "…");
    }

    // og_image
    if (get_field('images')) {
      $og_image = get_field('images')[0][image];
    }
    else if (has_post_thumbnail()) {
      $thumbnail_id = get_post_thumbnail_id($post->ID);
      $image = wp_get_attachment_image_src( $thumbnail_id, 'medium' );
      $og_image = $image[0];
    }
    else {
      $og_image = get_template_directory_uri().'/assets/images/ogp.png';
    }
  }
  // それ以外(一覧など)のとき
  else {
    $title = get_bloginfo('name');
    $description = get_bloginfo('description');
    $og_url = get_bloginfo('url');
    $og_type = 'website';
    $og_image = get_template_directory_uri().'/assets/images/ogp.png';
  }
?>

<meta charset="<?php echo get_bloginfo('charset'); ?>">

<title><?php echo get_bloginfo('name'); ?></title>

<meta name="description" content="<?php echo $description; ?>">
<meta name="robots" content="index,follow">
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, shrink-to-fit=no">

<meta property="og:title" content="<?php echo $title; ?>">
<meta property="og:site_name" content="<?php echo get_bloginfo('name'); ?>">
<meta property="og:type" content="<?php echo $og_type; ?>">
<meta property="og:url" content="<?php echo $og_url; ?>">
<meta property="og:description" content="<?php echo $description; ?>">
<meta property="og:image" content="<?php echo $og_image; ?>">
<meta property="og:locale" content="ja_JP">

<meta name="twitter:card" value="summary_large_image">
<meta name="twitter:title" value="<?php echo $title; ?>">
<meta name="twitter:description" value="<?php echo $description; ?>">
<meta name="twitter:image:src" value="<?php echo $og_image; ?>">
<meta name="twitter:creator" value="@ryo_dg">
