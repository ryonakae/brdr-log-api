<?php
  if (isset($_POST['payload'])) {
    $payload = json_decode($_POST['payload'], true);
    $branch = $payload['ref'];
    if ($branch === 'refs/heads/master') {
      exec('cd /home/ryo/service/brdr-log/theme; git pull origin master; npm install; npm run build');
    }
  } else {
    echo 'invalid access';
  }
?>
