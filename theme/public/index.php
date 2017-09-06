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
  ?>
  <script>
    var wpApiSettings = <?php echo $wp_api_settings; ?>;

    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
    ga('create', 'UA-46325777-11', 'auto');
  </script>
</head>
<body>
  <div id="app"></div>
  <script src="<?php echo get_template_directory_uri(); ?>/index.js"></script>
  <?php wp_footer(); ?>
</body>
</html>
