$(document).on("ready", function () {
    $(document).on("click", "#procedures_button", function()
    {
        let user_name = document.getElementById('userName').innerHTML
        let procedure = $("#procedures").val();
        $.ajax({
            type: "GET", //метод відправки
            url: 'procedures.php', //php файл, що виконуватиме запит
            data: {
                userName:user_name,
                to_exec: procedure
            }, // дані на відправку -- відправляється назва таблиці
            dataType: "json",
            success: function (response) {
                print_table('result', response)
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(errorThrown);
            }
        });
    })
    $(document).on("click", "#backupTable_button", function()
    {
        let table_name =$("#table_name").val()
        $.ajax({
            type: "GET", //метод відправки
            url: 'backup.php', //php файл, що виконуватиме запит
            data: {
                backupMode: 'table',
                table_name: table_name
            }, // дані на відправку -- відправляється назва таблиці
            dataType: "json",
            success: function (response) {
                let blob = new Blob([response.file], {type: "application/sql"});

                // створення посилання на завантаження файлу
                let link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = "backup" +table_name + ".sql";
                link.click();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(errorThrown);
            }
        });
    })
    $(document).on("click", "#backupAll_button", function()
    {
        $.ajax({
            type: "GET", //метод відправки
            url: 'backup.php', //php файл, що виконуватиме запит
            data: {
                backupMode: 'all'
            }, // дані на відправку -- відправляється назва таблиці
            dataType: "json",
            success: function (response) {
                let blob = new Blob([response.file], {type: "application/sql"});

                // створення посилання на завантаження файлу
                let link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = "backup.sql";
                link.click();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(errorThrown);
            }
        });
    })

    $("#form").on("submit", function (e) { //встановлення запуску при відправці форми
        e.preventDefault(); // не даємо оновитися сторінці
        let user_name = document.getElementById('userName').innerHTML
        let table_name = $("#table_name").val(); //отримуємо значення з форми
        let url = "selecting.php";
        if($("#isJoined").is(":checked"))
        {
            url = "join.php";
        }
        $.ajax({
            type: "GET", //метод відправки
            url: url, //php файл, що виконуватиме запит
            data: {
                userName: user_name,
                table_name: table_name}, // дані на відправку -- відправляється назва таблиці
            dataType: "json",
            success: function (response) {
                print_table(table_name, response)
            },
            error: function (jqXHR, textStatus, errorThrown) {
               alert(errorThrown)
            }
        });
    });
});

function print_table(table_name, response)
{
    let html = ""
    let keys = response[0]
    let values = response[1]
    html += "<table><tr>"
    //вивід імен стовпців
    if(response[2]!==false) {
        for (const column of keys) {
            let colName = column["name"]
            html += "<th><input type='button' value='Sort' id=sort_" + column["name"] + "></th>"
            addSortListener(table_name, colName)
        }
        html += "</tr><tr>"
        for (const column of keys) {
            let colName = column["name"]
            html += "<th><input type='button' value='Group' id=group_" + column["name"] + "></th>"
            addGroupListener(table_name, colName)
        }
        html += "</tr><tr>"
        let findBoxesID = []
        for (const column of keys) {
            let colName = column["name"]
            html += "<th><input type='text' id=find_" + column["name"] + "></th>"
            findBoxesID.push("find_"+colName)
        }
        addFindListener(table_name, findBoxesID)
    }
    html +="</tr>"
    for (const column of keys) {
        html += "<th>" + column["name"] + "</th>"
    }
    //додаємо ще два ствопця, для вигляду
    for(let i =0; i < 2;i++)
    {
        html+="<th></th>"
    }
    html += "</tr>"


    //виводимо значення у таблицю. Для кожного запису створюється рядок, туди розміщуються дані
    for (const valuesKey of values) {
        let recordId = valuesKey[0]
        html += "<tr>"
        for (let key of valuesKey) {
            html += "<td>" + key + "</td>"
        }

        //після даних виводимо кнопки видалення/оновлення
        if(response[2]!==false) {
            html += "<td><input type='button' value='Update' id=update_" + recordId + "></td>"
            html += "<td><input type='button' value='Remove' id=remove_" + recordId + "></td>"
            html += "</tr>"

            //додаємо прослуховувачі для кнопок
            addRemoveListener(table_name, recordId)
            addUpdateDeployListener(table_name, recordId, keys, valuesKey)
        }
    }
    html += "</table>"

    //призначення контенту таблиці елементу
    $("#output").html(html)
}

function addFindListener(tableName, columnBoxesID)
{
    let name = "#find_button"
    $(document).off("click", name)
    $(document).on("click",name, function ()
    {
        //при натисканні на Оновити введені дані оновлюються
        find(tableName, columnBoxesID)
    })
}
function addSortListener(tableName, columnName)
{
    let name = "#sort_" + columnName
    $(document).off("click", name)
    $(document).on("click", name, function ()
    {
        //при натисканні на remove видаляється відповідний рядок
        sort(tableName, columnName);
    });
}

function addGroupListener(tableName, columnName)
{
    let name = "#group_" + columnName
    $(document).off("click", name)
    $(document).on("click", name, function ()
    {
        //при натисканні на remove видаляється відповідний рядок
        group(tableName, columnName);
    });
}
function addRemoveListener(tableName, recordId)
{
    let name = "#remove_"+recordId

    $(document).off("click", name)
    $(document).on("click", name, function ()
    {
        //при натисканні на remove видаляється відповідний рядок
        remove(tableName, recordId);
    });
}
function addUpdateDeployListener(tableName, recordId, keys, values)
{
    let name = "#update_"+recordId

    $(document).off("click", name)
    $(document).on("click",name, function ()
    {
        //при натисканні на update з'являється форма для оновлення відповідного запису
        deployUpdate(tableName, recordId, keys, values)
    })
}

function addUpdateListener(tableName, recordId, id_elements)
{
    let name = "#update_button"
    $(document).off("click", name)

    $(document).on("click",name, function ()
    {
        //при натисканні на Оновити введені дані оновлюються
        update(tableName, recordId, id_elements)
    })
}
function deployUpdate(tableName, recordId, columnNames, values)
{
    let html = ""
    html += "<table><tr>"
    //виводимо назви стовпців
    for (const column of columnNames) {
        html += "<th>"
        html += column["name"]
        html += "</th>"
    }

    html+="</tr><tr>"
    let id_elements = []

    //виводимо текстові поля для заповнення. ID просто виводимо (1-ий стовпець)
    for(let i =0; i < values.length; i++)
    {
        html += "<td>"
        if(i===0)
        {
            html+=recordId+"</td>"
            continue
        }

        //id текстових полів додаємо до списку
        let idElement = columnNames[i]["name"] +"_updateForm"
        id_elements.push(idElement)
        html += "<input type='text' value="+values[i]+" id="+idElement+">"
        html += "</td>"
    }
    html += "</tr></table>"
    html+= "<input type=button value='Оновити' id=update_button>"
    addUpdateListener(tableName, recordId, id_elements)
    $("#add").html(html)
}

function sort(tableName, columnName)
{
    $.ajax({
        type: "GET", //метод відправки
        url: "sort.php", //php файл, що виконуватиме запит
        data: { //додаємо назву таблиці, id запису і значення для оновлення
            table_name: tableName,
            column_name: columnName,
        },
        dataType: "json",
        success: function (response) {

            print_table(tableName, response)
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
        }

    });
}

function group(tableName, columnName)
{
    let user_name = document.getElementById('userName').innerHTML
    $.ajax({
        type: "GET", //метод відправки
        url: "group.php", //php файл, що виконуватиме запит
        data: { //додаємо назву таблиці, id запису і значення для оновлення
            table_name: tableName,
            column_name: columnName,
            userName: user_name
        },
        dataType: "json",
        success: function (response) {
            print_table(tableName, response)
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
        }

    });
}
function update(tableName, recordId, id_elements)
{
    //заповнюємо масив введеними даними з елементів
    let valuesUpdate = []
    for(const elementId of id_elements) {
        valuesUpdate.push($("#" + elementId).val())
    }
    let user_name = document.getElementById('userName').innerHTML
    $.ajax({
        type: "POST", //метод відправки
        url: "update.php", //php файл, що виконуватиме запит
        data: { //додаємо назву таблиці, id запису і значення для оновлення
            table_name: tableName,
            values_updateForm: valuesUpdate,
            id_updateForm: recordId,
            userName: user_name
        },
        success: function (response) {

            alert(response)
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
        }

    });
}

function find(tableName, id_textBoxes)
{
    let valuesToFind = []
    for(const elementId of id_textBoxes) {
        valuesToFind.push($("#" + elementId).val())
    }
    let user_name = document.getElementById('userName').innerHTML
    $.ajax({
        type: "GET", //метод відправки
        url: "filter.php", //php файл, що виконуватиме запит
        data: { //додаємо назву таблиці, id запису і значення для оновлення
            table_name: tableName,
            values_find: valuesToFind,
            userName: user_name
        },
        dataType: "json",
        success: function (response) {
            print_table(tableName, response)
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
        }

    });
}

function remove(tableName, recordId)
{
    let user_name = document.getElementById('userName').innerHTML
    $.ajax({
        type: "POST", //метод відправки
        url: "remove.php", //php файл, що виконуватиме запит
        data: {
            id_remove: recordId,
            table_name: tableName,
            userName: user_name
        },
        success: function (response) {
           alert(response)

        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
        }

    });
}
