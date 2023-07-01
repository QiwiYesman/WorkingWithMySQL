<?php

$conn = connectToDB();
if (mysqli_connect_errno())
{
    exit('Connect failed ' . mysqli_connect_error());
}


$table_name = $_POST["table_name"];
$values = $_POST["values_addForm"];

//отримуємо ствопці таблиці, так як ми їх не знаємо
$sql = "show columns from $table_name";
if ($result = $conn->query($sql))
{
    $names = array();
    //додаємо назви до масиву
    while($row =$result->fetch_assoc())
    {
        //якшо автоінкремент ввимкнено, то id теж потрібно врахувати
        if($row["Field"]!="id")
        {
            $names[] = $row["Field"];
        }

    }
    $len = count($names);
    //динамічно створюємо запит: замість назв підставляється рядкове зображення масиву назв,
    //замість значень -- знаки питань.
    $insert = "insert into $table_name("
        .implode(", ", $names).") values(";
    $insert .= str_repeat("?, ", $len);

    //видаляємо останні знаки: ", "
    $insert = substr($insert, 0, -2).")";
    //підготовка запиту
    $prepared =$conn->prepare($insert);

    //підставляємо і виконуємо запит. Замість потрібних типів можна підставити s --
    //у базі даних воно однаково приведеться до потрібних типів.
    //...values -- розпакування масиву на окремі параметри
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