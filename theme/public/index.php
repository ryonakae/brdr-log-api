<!DOCTYPE html>
<html lang="ja" prefix="og: http://ogp.me/ns#">
<head>
  <?php include('meta.php'); ?>
  <?php wp_head(); ?>

  <?php
    $wp_api_settings = json_encode(array(
      nonce => wp_create_nonce('wp_rest'),
      is_logged_in => is_user_logged_in(),
      is_preview => is_preview()
    ));
    echo the_content();
  ?>
  <script>
    var wpApiSettings = <?php echo $wp_api_settings; ?>;
  </script>
</head>
<body>
  <div id="app"></div>
  <script src="<?php echo get_template_directory_uri(); ?>/index.js"></script>
  <?php wp_footer(); ?>
</body>
</html>
