var id_category = $("#id_category")[0].innerHTML;
var number_of_post = $("#number_of_post")[0].innerHTML;


var elem;




function addData(data){
    var keys = Object.keys(data);
    for(var i = 0;i<keys.length;i++){
        var content = data[keys[i]].content;
        elem = createElements(keys[i]);

        elem.title.val(data[keys[i]].title);
        elem.annotation.val(data[keys[i]].annotation);
        elem.geometry.val(data[keys[i]].class);

        for(var j = 0; j<content.length;j++){
            switch (content[j].type) {
                case "text":
                    elem.addText().val(content[j].data);
                break;
                case "image":
                    elem.addPhoto();
                break;
            
                default:
                break;
            }
        }
    };
};







var xhr = new XMLHttpRequest();
xhr.open('get', '/AdminPannel/getDataArtilce?id_category='+id_category+"&number="+number_of_post, true);
xhr.onerror = function (e){
    alert( 'ошибка: ' + (e.target.status + 'запрос не удался') );
}
xhr.onload = function(){
    if (this.status!=200){
    alert( 'ошибка: '+ this.status+' запрос не удался');
    }
    else{
        var data = JSON.parse(this.responseText)
        $("#loading").remove();
        addData(data);
    }
};
xhr.send();


