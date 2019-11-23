var add_button = document.getElementById("add_language_button");
var container = document.getElementById("container");

function validateDataOfLanguage(value){
    if(value.split("").length==2){
        if(value.match(/\d/g)){
            return false;
        }
        return true;
    }  
    else return false;
};

function createInput(attr){
    return $("<input>").attr(attr);
};
function createTextAtea(attr){
    return $("<textArea>").attr(attr);
};
function createButton(attr){
    return $("<button>").attr(attr);
};

function createElements(str_lang){

    var End = $("<div>").css({width:"100%",height:"2px",backgroundColor:"#00c4f5"});
    var count_tArea = 1;
    var count_Images = 1;
    var images_arr = [];
    var textArea_arr = [];


    var p = $("<p>").append(`ARTICLE ON LANGUAGE - ${str_lang.toUpperCase()}`);
    var title = createInput({name:`title_${str_lang}`,type:"text",placeholder:"title"});
    var annotation = createTextAtea({name:`annotation_${str_lang}`,placeholder:"annotation"});
    var geometry = createInput({name:`class_${str_lang}`,type:"text",placeholder:"geometry: like b_i_j"});
    var count = createInput({name:`count_${str_lang}`,type:"text",style:"display:none;"});

    var addText = createButton({type:"button"}).append("Add text").bind("click",()=>{
        var tArea = createTextAtea({name:`text_${str_lang}_${count_tArea++}`,placeholder:"your paragraph here"});
        textArea_arr.push(tArea);
        End.before(tArea);
    });

    var addPhoto = createButton({type:"button"}).append("Add photo").bind("click",()=>{
        var input = createInput({type:"file",name:`file`,accept:"image/*"}); 
        images_arr.push(input);
        End.before(input);
        var input = createInput({type:"text",name:`image_${str_lang}_${count_Images++}`,style:"display:none;"}); 
        images_arr.push(input);
        End.before(input);        
    });

    var deletePhoto = createButton({type:"button"}).append("Delete img").bind("click",()=>{
        if(images_arr.length) {
            images_arr.pop().remove();
            images_arr.pop().remove();
            count_Images--;
        }
        else{
            alert("Not have any photos");
        }
    })
    var deleteTExt = createButton({type:"button"}).append("Delete text").bind("click",()=>{
        if(textArea_arr.length){
            textArea_arr.pop().remove();
            count_tArea--;
        }
        else{
            alert("Not have any text Areas")
        }
    });

        var register_form = $("#register-form");

        register_form.prepend(End);
        register_form.prepend($("<div>").css({width:"100%",height:"2px",backgroundColor:"#00c4f5"}));
        register_form.prepend(deletePhoto);
        register_form.prepend(deleteTExt);
        register_form.prepend(addText);
        register_form.prepend(addPhoto);
        register_form.prepend(count);
        register_form.prepend(geometry);
        register_form.prepend(annotation);
        register_form.prepend(title);
        register_form.prepend(p);
        container.setAttribute("class","enable");
        return {
            title:title,
            annotation:annotation,
            geometry:geometry,
            addPhoto: ()=>{
                var input = createInput({type:"text",name:`image_${str_lang}_${count_Images++}`,style:"display:none;"});
                End.before(input);  
                images_arr.push(input);
                var input = createInput({type:"file",name:`file`});
                End.before(input);
                images_arr.push(input);
                return input;
            },
            addText: ()=>{
                console.log("HEY!");
                var tArea = createTextAtea({name:`text_${str_lang}_${count_tArea++}`,placeholder:"your paragraph here"});
                End.before(tArea);
                textArea_arr.push(tArea);
                return tArea;
            }
        }
};

add_button.addEventListener("click",()=>{
    var str_lang = document.getElementById("add_language_input").value;
    if(validateDataOfLanguage(str_lang)){
        createElements(str_lang);
    }
    else{
        alert("Not correct!");
    }
})