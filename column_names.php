<?php
require_once('connect.php');
$conn = connectToDB();
if (mysqli_connect_errno())
{
    exit('Connect failed ' . mysqli_connect_error());
}
$table_name = $_GET["table_name"];
//запит на отримання інформаціх про стовпці
$sql = "show columns from $table_name";
if ($result = $conn->query($sql))
{
    //повертає до ajax json файл з інформацією про стовпці
    echo json_encode($result->fetch_all());
}
else
{
    echo "Error: " . $conn->error;
}

$conn->close();