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

  <script src="<?php echo get_template_directory_uri(); ?>/vendor.js"></script>
  <script src="<?php echo get_template_directory_uri(); ?>/index.js"></script>
</head>
<body itemscope itemtype="http://schema.org/WebPage">
  <div id="app" style="position: fixed; opacity: 0; visibility: hidden; overflow: hidden;">
    <!-- site header -->
    <header itemscope itemtype="http://schema.org/WPHeader" role="banner">
      <?php if (is_singular()) : ?>
        <p itemscope itemprop="headline">
          <a href="<?php bloginfo('url'); ?>"><?php echo $title; ?></a>
        </p>
      <?php else: ?>
        <h1 itemscope itemprop="headline">
          <a href="<?php bloginfo('url'); ?>"><?php echo $title; ?></a>
        </h1>
      <?php endif; ?>
    </header>

    <!-- navigation -->
    <nav role="navigation" itemscope itemtype="http://schema.org/SiteNavigationElement">
      <ul>
        <?php $cats = get_categories(); foreach ( $cats as $cat ) : ?>
          <li itemprop="name">
            <a itemprop="url" href="<?php echo get_category_link($cat->cat_ID); ?>">
              <?php echo get_cat_name($cat->cat_ID); ?>
            </a>
          </li>
        <?php endforeach; ?>
        <li itemprop="name">
          <a itemprop="url" href="//brdr.jp">BRDR</a>
        </li>
      </ul>
    </nav>

    <!-- content -->
    <main role="main" itemscope itemprop="mainContentOfPage" itemtype="http://schema.org/Blog">
      <!-- articles -->
      <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
        <article itemscope itemtype="http://schema.org/BlogPosting" itemprop="blogPost">
          <!-- article header -->
          <header>
            <!-- article title -->
            <?php if (is_singular()) : ?>
              <h1 itemprop="name headline"><a itemprop="url" href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h1>
            <?php else: ?>
              <h2 itemprop="name headline"><a itemprop="url" href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
            <?php endif; ?>

            <!-- article info -->
            <aside>
              <time itemprop="datePublished" datetime="<?php the_time('c'); ?>">
                <?php the_time(get_option('date_format')); ?>
              </time>
              <?php the_category(', '); ?>

              <!-- author -->
              <div itemscope itemtype="https://schema.org/Organization" itemprop="publisher">
                <span>by</span>
                <span itemprop="author">Ryo Nakae</span>
              </div>
            </aside>
          </header>

          <?php if (is_singular()) : ?>
            <!-- article eyecatch -->
            <?php if (has_post_thumbnail()) : ?>
              <figure itemscope itemtype='http://schema.org/ImageObject' itemprop="image">
                <?php the_post_thumbnail(); ?>
              </figure>
            <?php endif; ?>

            <!-- article content -->
            <div itemprop="articleBody"><?php the_content(); ?></div>
          <?php endif; ?>
        </article>
      <?php endwhile; endif; ?>

      <!-- pager -->
      <?php global $wp_query; if ( $wp_query->max_num_pages > 1 ) { ?>
        <nav role="navigation">
          <?php previous_posts_link() ?>
          <?php next_posts_link() ?>
        </nav>
      <?php } ?>
    </main>

    <!-- footer -->
    <footer role="contentinfo" itemscope itemtype="http://schema.org/WPFooter">
      <span>&copy;</span>
      <a href="https://twitter.com/ryo_dg" itemscope itemtype="http://schema.org/Person" itemprop="author url">Ryo Nakae</a>
    </footer>
  </div>

  <?php wp_footer(); ?>
</body>
</html>
