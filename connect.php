<?php

function connectToDB(): mysqli
{
    $db_name = "Sport";
    $user_name = $_GET["userName"]??$_POST['userName'];
    $password = $user_name . '_123';
    return new mysqli('localhost', $user_name, $password, $db_name); # встановлення зв'язку
}

function login()
{
    $db_name = "Sport";
    $user_name = $_POST["userName"];
    $password = $_POST["password"];
    $group = $_POST["group"];;
    $conn = new mysqli('localhost', 'root', 'пароль123', $db_name); # встановлення зв'язку
    if (mysqli_connect_errno())
    {
        exit('Connect failed ' . mysqli_connect_error());
    }

    $sql = "select isUser('$user_name', '$password', '$group')";
    if ($result = $conn->query($sql))
    {
        echo $result->fetch_array()[0];
    }
    else
    {
        echo "Error: " . $conn->error;
    }

    $conn->close();
}

function registration()
{
    $db_name = "Sport";
    $user_name = $_POST["userName"];
    $password = $_POST["password"];
    $group = $_POST["group"];;
    $conn = new mysqli('localhost', 'root', 'пароль123', $db_name); # встановлення зв'язку
    if (mysqli_connect_errno())
    {
        exit('Connect failed ' . mysqli_connect_error());
    }

    $sql = "select isUser('$user_name', '$password', '$group')";
    if ($result = $conn->query($sql))
    {
        if($result->fetch_array()[0])
        {
            echo false;
        }
        else
        {
            $sql = "insert into SportUsers(SportUsers.name, SportUsers.password, SportUsers.group)
                    values ('$user_name', '$password', '$group');";
            $conn->query($sql);
            echo true;

        }
    }
    else
    {
        echo "Error: " . $conn->error;
    }

    $conn->close();
}
