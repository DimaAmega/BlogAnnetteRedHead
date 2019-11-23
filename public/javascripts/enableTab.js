function enableTab(id) {
    var el = document.getElementsByClassName(id);
    for(var i = 0; i<el.length;i++)
    el[i].onkeydown = function(e) {
        if (e.keyCode === 9) { // была нажата клавиша TAB

            // получим позицию каретки
            var val = this.value,
                start = this.selectionStart,
                end = this.selectionEnd;
                
            // установим значение textarea в: текст до каретки + tab + текст после каретки
            this.value = val.substring(0, start) + '\t' + val.substring(end);

            // переместим каретку
            this.selectionStart = this.selectionEnd = start + 1;

            // предотвратим потерю фокуса
            return false;
            
        }
    };
};
enableTab("addText");