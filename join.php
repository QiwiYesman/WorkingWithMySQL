<?php
require_once('connect.php');
$conn = connectToDB();
if (mysqli_connect_errno())
{
    exit('Connect failed ' . mysqli_connect_error());
}
$table_name = $_GET["table_name"];
$sql = "";
switch ($table_name)
{
    case "Country":
        $sql = "select c.name from Country c";
        break;
    case "City":
        $sql = "select c.name as City, C2.name as Country from City
    c join Country C2 on C2.id = c.id_country";
        break;
    case "Result":
        $sql = "select T.name as Tournament, S.name as Sportsman, r.value, r.valueType from Result r 
    join Sportsman S on S.id = r.id_sportsman
    join Tournament T on T.id = r.id_tournament";
        break;
    case "Sportsman":
        $sql = "select s.name as Sportsman, T.name as Title, s.age from Sportsman s
    join Title T on T.id = s.id_title";
        break;
    case "SportType":
        $sql = "select c.name from SportType c";
        break;
    case "Team":
        $sql = "select c.name from Team c";
        break;
    case "TeamMember":
        $sql = "select S.name as Sportsman, T.name as Team, tm.isCaptain from TeamMember tm
    join Sportsman S on S.id = tm.id_sportsman
    join Team T on T.id = tm.id_team";
        break;
    case "TeamTournament":
        $sql = "select T.name as Team, tour.name as Tournament, tt.place from TeamTournament tt
    join Team T on T.id = tt.id_team
    join Tournament tour on tt.id_tournament = tour.id";
        break;
    case "Title":
        $sql = "select c.name from Title c";
        break;
    case "Tournament":
        $sql = "select t.name as Tournament, t.date, ST.name as SportType, C.name as City from Tournament t
    join City C on C.id = t.id_city
    join SportType ST on ST.id = t.id_sportType";
        break;

}

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