<?php
require_once('connect.php');
$conn = connectToDB();
if (mysqli_connect_errno())
{
    exit('Connect failed ' . mysqli_connect_error());
}


$table_name = $_POST["table_name"];
$id = $_POST["id_remove"];
//отримуємо значення і підставляємо.
// Підготовані вирази не потрібні, бо користувач нічого не вводить, лише натискає на кнопку
$query = "delete from $table_name where id=$id";
if ($conn->query($query))
{
    echo "Done";
}
else
{
    echo "Error: " . $conn->error;
}
$conn->close();