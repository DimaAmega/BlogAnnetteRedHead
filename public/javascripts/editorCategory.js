var id_category = document.getElementsByTagName("h1")[0].getAttribute("data");

var delete_buttons = document.getElementsByClassName('delete');
for(var i = 0; i<delete_buttons.length; i++){
    delete_buttons[i].addEventListener('click',(e)=>{
        var target = e.target;
        var num = target.getAttribute("data");
        var result = confirm("Are you rellay want to dalete this article in this categoty?");
        if (result){
            var xhr = new XMLHttpRequest();
            xhr.open('delete', '/AdminPannel/deleteArtilce?id_category='+id_category+"&number="+num, true);
            xhr.onerror = function (e){
                alert( 'ошибка: ' + (e.target.status + 'запрос не удался') );
            }
            xhr.onload = function(){
                if (this.status!=200){
                alert( 'ошибка: '+ this.status+' запрос не удался');
                }
                else{
                     window.location.reload();
                }
            };
            
            xhr.send();
        };
    })
};

var update_buttons = document.getElementsByClassName('update');
for(var i = 0; i<update_buttons.length; i++){
    update_buttons[i].addEventListener('click',(e)=>{
        var target = e.target;
        var num = target.getAttribute("data");
        var url = '/AdminPannel/updateArtilce?id_category='+id_category+"&number="+num;
        window.location=url;
    })
};


