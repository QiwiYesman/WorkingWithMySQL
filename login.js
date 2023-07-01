$(document).on("ready", function () {
    $(document).on("click", "#logButton", function()
    {
        let userName = $("#login").val();
        let pass = $("#password").val();
        let group = $("#group").val();
        $.ajax({
            type: "POST", //метод відправки
            url: 'login.php', //php файл, що виконуватиме запит
            data: {
                method: 'log',
                userName: userName,
                password: pass,
                group: group,
            }, // дані на відправку -- відправляється назва таблиці
            dataType: "json",
            success: function (response) {
                if(response)
                {
                    let new_window = window.open('select_form.html')
                    new_window.onload = function () {
                       let t = new_window.document.getElementById('userName')
                        t.innerHTML=group
                    }


                }
                else
                {
                    alert('Incorrect input info')
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(errorThrown);
            }
        });
    })
    $(document).on("click", "#regButton", function()
    {
        let userName = $("#login").val();
        let pass = $("#password").val();
        let group = $("#group").val();
        $.ajax({
            type: "POST", //метод відправки
            url: 'login.php', //php файл, що виконуватиме запит
            data: {
                method: 'reg',
                userName: userName,
                password: pass,
                group: group,
            },
            dataType: "json",
            // дані на відправку -- відправляється назва таблиці
            success: function (response) {
                if(response)
                {
                    alert("You are registrated. You can login")
                }
                else
                {
                    alert('Error when registrating')
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(errorThrown);
            }
        });
    })

});
