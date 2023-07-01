<?php
require_once('connect.php');
$conn = connectToDB();
$table_name = $_GET["table_name"];
$sql = "select * from $table_name";
if ($result = $conn->query($sql))
{
    echo json_encode(array(
        $result->fetch_fields(),
        $result->fetch_all()
    ));
}
else
{
    echo "Error: " . $conn->error;
}

$conn->close();