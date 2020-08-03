<?php
use RnctAdmin\Main\Database;
use RnctAdmin\Main\RnctImages;
use RnctAdmin\Main\Ajax;
// packages

// get main package
require_once realpath("vendor/autoload.php");

// connect to database
$settings = realpath("settings.json");
$db = new Database($settings);
$param = $db->get_params();
// call ajax
$ajax = new Ajax($param);
$ajax->process_data();
