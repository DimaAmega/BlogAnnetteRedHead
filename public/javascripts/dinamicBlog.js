var main = document.getElementsByClassName("content");
var articles = main[0].querySelectorAll("div"); 


for (var i = 0; i<articles.length;i++ ){
	articles[i].addEventListener("mouseover", function(e){
		var img = this.querySelectorAll("a>img")[0];
		var mark = this.querySelectorAll("p")[1];
		if (e.target.tagName == "A") {
			img.style = "filter: brightness(0.6); object-fit: cover; transform: scale(1.1); box-shadow: 4px 4px 100px 20px  black; ";
		} else if (e.target.tagName == "P") 
		{
		} 
		 else e.target.style = "filter: brightness(0.6); object-fit: cover; transform: scale(1.1); box-shadow: 4px 4px 100px 20px  black;";
	  	mark.style = "opacity:1; top:12%;";
	})
	articles[i].addEventListener("mouseout", function(e) {
		e.target.style = "";
		var mark = this.querySelectorAll("p")[1];
		mark.style = "opacity:0;"
	});
}
