(function () {
    var canvas, ctx, dragType = null;
    var bgImg = "assets/images/T-shirt-Vector.jpg";
    var maxWidth= 900;
    var savedObject = new Image();
    var fontSize, fontFamily, fontColor;
    var canvasFont={
        size:16,
        family:'arial',
        color:'block'
    }
    
    var init = function () {  
        preloadImage(bgImg, initCanvas);  //Funktionen können wie Variablen übergeben werden initThumbs();
        setThumbsDraggable();   
        setCanvasDroppable();   
        setTextDraggable();        
        initFontOptions(10,70,5);        
    };
    var initFontOptions = function(min, max, steps){
        fontSize=document.querySelector('[name="fontSize"]');
        fontFamily=document.querySelector('[name="fontFamily"]');
        fontColor=document.querySelector('[name="fontColor"]');
        for (var i = min; i <= max; i += steps) {
            var opt = document.createElement('option');
            opt.text = i + 'px';
            opt.value = i;
            fontSize.appendChild(opt);
        }
        addEv('[name="fontSize"]', 'change', changeFontSize);
        addEv('[name="fontFamily"]', 'change', changeFontFamily);
        addEv('[name="fontColor"]', 'change', changeFontColor);        
    }
    var changeFontSize = function(){
        document.querySelector('[data-role="text"]').style.fontSize = this.value+'px';
        canvasFont.size = this.value * 1;
    }
    var changeFontFamily = function(){
        document.querySelector('[data-role="text"]').style.fontFamily = this.value;
        canvasFont.family=this.value;
    }
    var changeFontColor = function(){
        document.querySelector('[data-role="text"]').style.color = this.value;
        canvasFont.color=this.value;
    }
    var setTextDraggable = function(){        
        addEv('[data-role="text"]', 'dragstart', dragText);        
    };    
    var dragText = function(e){  
        dragType="text";
        var T = {
            x:e.offsetX,
            y:e.offsetY,
            text: this.innerText
        }
        var tJson = JSON.stringify(T);
        e.dataTransfer.setData("text/plain", tJson);
    }
    var drop = function(e){
        var posX, posY;
        // Object aus JSON auslesen        
        switch(dragType){
            case null:
              return false;
              break;
            case "text":
              var T=JSON.parse(e.dataTransfer.getData("text"));       
              ctx.font=canvasFont.size + 'px ' + canvasFont.family;
              ctx.fillStyle=canvasFont.color; 
              ctx.fillText(T.text, e.offsetX-T.x, e.offsetY - T.y + canvasFont.size);  
              break;
            case "image":
                //Bild
              posX=e.offsetX-savedObject.offsetX+1;       
              posY=e.offsetY-savedObject.offsetY-1;
              ctx.drawImage(savedObject, posX, posY, savedObject.width, savedObject.height);  
              break;
          default: 
              return false;
        }      
    };    
    var setThumbsDraggable = function(){        
        addEv('[data-role="icons"] > img', 'dragstart', dragImage);
    };
    var setCanvasDroppable = function(){
        addEv('canvas', 'dragover', dragover);
        addEv('canvas', 'drop', drop);
    };
    var dragImage = function(e){ 
      dragType="image";
      console.log('dragstart');       
      console.log(e);
      savedObject = this;      
      savedObject.offsetX = e.offsetX;
      savedObject.offsetY = e.offsetY;
      e.dataTransfer.setDragImage(this, e.offsetX, e.offsetY);
    };
    
    var dragover = function(e){        
      e.preventDefault();       
    };    
    var initCanvas = function (img) {
        var h = img.height*maxWidth/img.width;
        canvas = document.querySelector('canvas');
        canvas.width=maxWidth;
        canvas.height=h;
        canvas.style.width= maxWidth + "px";
        canvas.style.height= h + "px";
        ctx = canvas.getContext('2d');
        ctx.translate(-0.5, -0.5);
        initBackground(img);        
    };
    var initBackground = function(img){
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
    var preloadImage = function (bgImg, fx) {
        var img = new Image();
        img.src = bgImg;
        img.onload = function () {  //onload ist ein Thread, der parallel zu preload
            //abgearbeitet wird
        fx(img);   //nun wird erst die Funktion onload abgearbeiten, so dass dann          
        //in dem Fall initCanvas zur Verfügung steht
        }
    } 
    
    
    var addEv = function(selector, event, callback){
        var elems = document.querySelectorAll(selector);
        for (var i=0, max = elems.length; i<max; i++){
            elems[i].addEventListener(event, callback);
        }
    }
    window.addEventListener('load', init);

})();