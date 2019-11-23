
function createButton (name){
    var button = document.createElement("button");
    button.setAttribute("data",name);
    button.innerHTML=name;
    button.setAttribute("class","Сhlang");
    button.addEventListener("click",(e)=>{
            document.cookie = `lang=${e.target.getAttribute('data')}`;
            window.location.reload();
    });
    return button;
};

// console.log('Событие клик',this);
//     document.cookie = `lang=${this.getAttribute('data')}`;
//     console.log(document.cookie);
//     window.location.reload();

var body = document.body
var div = document.createElement("div");
// var document.
div.style.width = "80px";
div.style.height = "30px"
// div.style.border = "1px solid red";
div.style.background = "black";
div.style.zIndex = "100";
div.style.fontFamily = "FRANKLIN GOTHIC MEDIUM";
div.style.fontSize = "18px";

div.style.color = "white";
div.style.borderRadius="10%"
div.style.position = "fixed";
div.style.top = "1%";
div.style.right = "1%";
div.style.textAlign = "center";
div.style.overflow="hidden";
div.style.lineHeight = "30px";
div.style.transition = "all 0.1s";

div.addEventListener("mouseover",(e)=>{
    div.style.height = "60px"
    div.style.borderRadius="10%"
});
div.addEventListener("mouseout",(e)=>{
    div.style.height = "30px"
    div.style.borderRadius="10%"

});
div.innerHTML="language";
div.appendChild(createButton("ru"));
div.appendChild(createButton("en"));
div.appendChild(createButton("fr"));
body.appendChild(div);

    