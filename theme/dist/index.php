<!DOCTYPE html>
<html lang="ja" prefix="og: http://ogp.me/ns#">
<head>
  <?php include('meta.php'); ?>
  <?php wp_head(); ?>
</head>
<body>
  <div id="app"></div>
  <script src="<?php echo get_template_directory_uri(); ?>/scripts/app.js"></script>
  <?php wp_footer(); ?>
</body>
</html>
