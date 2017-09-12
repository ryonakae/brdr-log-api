<?php
  $SECRET_KEY = 'wR[a{[iU2;4bahA3YJ4dgPYCV6HGHc+aRE3jMfpFiw)K24[{%8{bNFTBzFLd3qyT';

  if (isset($_GET['key']) && $_GET['key'] === $SECRET_KEY && isset($_POST['payload'])) {
    $payload = json_decode($_POST['payload'], true);
    if ($payload['ref'] === 'refs/heads/master') {
      `cd /home/ryo/service/brdr-log; git pull origin master; cd theme; npm i; npm run build`;
    }
  } else {
    echo 'invalid access';
  }
?>
