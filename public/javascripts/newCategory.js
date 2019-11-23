var button = document.querySelector("#NewLanguage button");
button.addEventListener("click",(e)=>{
var value = document.querySelector("#NewLanguage input").value;
if (value){
    if (value.split("").length==2){
        var input = document.createElement("input");
        input.setAttribute("type","text");
        input.setAttribute("name",value);
        input.setAttribute("placeholder",value);
        var p = document.querySelector(".register-form input");
        p.after(input);
    }
    else{
    alert("Неверный формат");
    }
}
else{
    alert("Вы не ввели язык");
}
})