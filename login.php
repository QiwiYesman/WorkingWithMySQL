<?php
require_once('connect.php');
$method = $_POST['method'];
switch ($method)
{
    case 'log':
        login();
        break;
    case 'reg':
        registration();
        break;
}