<?php
require_once('connect.php');
$conn = connectToDB();
if (mysqli_connect_errno())
{
    exit('Connect failed ' . mysqli_connect_error());
}
$to_exec = $_GET["to_exec"];
$sql = "call $to_exec";
if ($result = $conn->query($sql))
{
    echo json_encode(array(
        $result->fetch_fields(),
        $result->fetch_all(),
        false
    ));
}
else
{
    echo "Error: " . $conn->error;
}

$conn->close();