$(document).on("ready", function ()
{
    $("#add_button").on("click", function () {
       //встановлення запуску при відправці форми
        let table_name = $("#table_name").val(); //отримуємо значення з форми
        $.ajax({
            type: "GET", //метод відправки
            url: "column_names.php", //php файл, що виконуватиме запит
            data: {table_name: table_name},
            dataType: "json", //очікуємо отримати json файл
            success: function (response) {
                let html = ""
                html += "<table><tr>"
                //вивід назва стовпців
                for (const responseKey of response) {
                    html += "<th>"
                    html += responseKey[0]
                    html += "</th>"
                }

                html+="</tr><tr>"
                let id_elements = []
                //виводимо текстові поля для заповнення. Id цих полів зберігаємо у список
                for(const responseKey of response)
                {
                    html += "<td>"
                    let idElement = responseKey[0] +"_addForm"
                    id_elements.push(idElement)
                    html += "<input type='text' id="+idElement+">"
                    html += "</td>"
                }
                html += "</tr></table>"
                html+= "<input type=button value='Додати' id=add_new_record>"
                addInsertListener(table_name, id_elements)
                $("#add").html(html)


            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(errorThrown);
            }

        });

    });
});
function addInsertListener(tableName, arrayOfIdElements)
{
    let name = "#add_new_record"

    $(document).off("click", name)
    $(document).on("click",name, function ()
    {
        addValues(tableName, arrayOfIdElements)
    })
}

function addValues(table_name, arrayOfIdElements)
{
    let valuesToAdd = []
    for (const elementId of arrayOfIdElements) {
        //якщо на id стоїть автоінкремент, то краще пропустити його.
        //інакше додавання id теж потрібне
        if(elementId!=="id_addForm")
        {
            valuesToAdd.push($("#" + elementId).val())
        }
    }
    $.ajax({
        type: "POST", //метод відправки
        url: "insert.php", //php файл, що повертатиме значення
        data: {
            table_name: table_name,
            values_addForm: valuesToAdd
        },
        success: function (response) {

           alert(response)
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
        }

    });
}
