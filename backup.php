<?php

$mode = $_GET["backupMode"];
$return_var = NULL;
$output = NULL;

if($mode == 'table')
{
    $table_name = $_GET["table_name"];
    $fileName = "/home/qiwiman/dumps/backup$table_name.sql";
    $command = "/usr/bin/mysqldump -u root -pпароль123 Sport ".$table_name." --single-transaction -R > $fileName";
}
else
{
    $fileName = "/home/qiwiman/dumps/backup.sql";
    $command = "/usr/bin/mysqldump -u root -pпароль123 Sport --single-transaction -R > $fileName";
}
exec($command, $output, $return_var);
$file = file_get_contents($fileName);
header("Content-Type: application/json");
echo json_encode(["success" => true, "file" => $file]);
