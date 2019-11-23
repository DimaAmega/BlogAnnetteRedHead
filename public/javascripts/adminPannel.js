var delete_buttons = document.getElementsByClassName('delete');
for(var i = 0; i<delete_buttons.length; i++){
    delete_buttons[i].addEventListener('click',(e)=>{
        var target = e.target;
        var data = target.getAttribute("data");
        var result = confirm("Are you rellay want to dalete all articles in this categoty?");
        if (result){
            var xhr = new XMLHttpRequest();
            xhr.open('delete', '/AdminPannel', true);
            xhr.onerror = ()=>{alert( 'ошибка: ' + (this.status ? this.statusText : 'запрос не удался') );}
            xhr.onload = ()=>{window.location.reload();}
            xhr.setRequestHeader("title",data);
            xhr.send();
        };
    })
};

var update_buttons = document.getElementsByClassName('update');
for(var i = 0; i<update_buttons.length; i++){
    update_buttons[i].addEventListener('click',(e)=>{
        var target = e.target;
        var data = target.getAttribute("data");
        var url = '/update?id_category='+data;
        window.location+=url;
    })
};


