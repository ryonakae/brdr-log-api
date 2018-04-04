<!DOCTYPE html>
<html lang="ja">
<head>
  <?php include('meta.php'); ?>
  <?php wp_head(); ?>

  <?php
    $wp_settings = json_encode(array(
      nonce => wp_create_nonce('wp_rest'),
      is_logged_in => is_user_logged_in(),
      is_preview => is_preview(),
      posts_per_page => get_option('posts_per_page'),
      template_directory_url => get_template_directory_uri()
    ));
  ?>

  <script>
    var wpSettings = <?php echo $wp_settings; ?>;

    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
    ga('create', 'UA-46325777-11', 'auto');
  </script>
</head>
<body>
  <div id="app" style="opacity: 0; visibility: hidden;">
    <!-- site header -->
    <header role="banner">
      <?php if (is_singular()) : ?>
        <a href="<?php bloginfo('url'); ?>"><?php bloginfo('name'); ?></a>
      <?php else: ?>
        <h1><a href="<?php bloginfo('url'); ?>"><?php echo $title; ?></a></h1>
      <?php endif; ?>
    </header>

    <!-- content -->
    <section role="main">
      <!-- articles -->
      <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
        <article>
          <!-- article header -->
          <header>
            <!-- article title -->
            <?php if (is_singular()) : ?>
              <h1><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h1>
            <?php else: ?>
              <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
            <?php endif; ?>

            <!-- article info -->
            <aside>
              <time datetime="<?php the_time('c'); ?>"><?php the_time(get_option('date_format')); ?></time>
              <?php the_category(', '); ?>
            </aside>
          </header>

          <!-- article eyecatch -->
          <?php if ( has_post_thumbnail() ) { the_post_thumbnail(); } ?>

          <!-- article content -->
          <?php the_content(); ?>
        </article>
      <?php endwhile; endif; ?>

      <!-- pager -->
      <?php global $wp_query; if ( $wp_query->max_num_pages > 1 ) { ?>
        <nav role="navigation">
          <?php previous_posts_link() ?>
          <?php next_posts_link() ?>
        </nav>
      <?php } ?>
    </section>
  </div>

  <script src="<?php echo get_template_directory_uri(); ?>/vendor.js"></script>
  <script src="<?php echo get_template_directory_uri(); ?>/index.js"></script>

  <?php wp_footer(); ?>
</body>
</html>
