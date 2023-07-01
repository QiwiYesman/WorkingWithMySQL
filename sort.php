<?php
require_once('connect.php');
$conn = connectToDB();
if (mysqli_connect_errno())
{
    exit('Connect failed ' . mysqli_connect_error());
}
$table_name = $_GET["table_name"];
$column_name = $_GET["column_name"];
$sql = "select * from $table_name order by $column_name";
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