<?php
require_once('connect.php');
$conn = connectToDB();
if (mysqli_connect_errno())
{
    exit('Connect failed ' . mysqli_connect_error());
}

$table_name = $_GET["table_name"];
$values = $_GET["values_find"];
$fields = $conn->query("show columns from $table_name");
$names = array();
//додаємо назви до масиву
while($row =$fields->fetch_assoc())
{
    $names[] = $row["Field"];
}
$sql = "select * from $table_name where id like '$values[0]%'";
$len = count($values);
for($i=1; $i< $len; $i++)
{
    $sql.=" and `".$names[$i]."` like '".$values[$i]."%'";
}
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