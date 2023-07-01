<?php

require_once('connect.php');
$conn = connectToDB();
if (mysqli_connect_errno())
{
    exit('Connect failed ' . mysqli_connect_error());
}


$table_name = $_POST["table_name"];
$id = $_POST["id_updateForm"];
$values = $_POST["values_updateForm"];
$sql = "show columns from $table_name";
if ($result = $conn->query($sql))
{
    $names = array();
    /*нагадування: запит на оновлення має вигляд
      update tableName
      set column1 = value1,
      set column2 = value2, ...
      where condition

      Тому замість columnN потрібно підставити назву ствопця, замість valueN -- знак питання
    */
    $update = "update $table_name set ";
    while($row =$result->fetch_assoc())
    {
        if($row["Field"]!="id")
        {
            $update .= $row["Field"] . " = ?, ";
        }
    }
    $update = substr($update, 0, -2)." where id = $id";
    $prepared =$conn->prepare($update);
    $prepared->bind_param(str_repeat("s", count($values)),...$values);
    $prepared->execute();
    $prepared->get_result();
    echo "Done";

}
else
{
    echo "Error: " . $conn->error;
}

$conn->close();