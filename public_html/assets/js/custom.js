(function () {
    var canvas, ctx;
    var bgImg = "assets/images/T-shirt-Vector.jpg";
    var maxWidth= 900;
    var savedObject = new Image();
    
    var init = function () {  
        preloadImage(bgImg, initCanvas);  //Funktionen können wie Variablen übergeben werden initThumbs();
        setThumbsDraggable();   
        setCanvasDroppable();        
    };
    var setThumbsDraggable = function(){        
        addEv('[data-role="icons"] > img', 'dragstart', drag);
    };
    var setCanvasDroppable = function(){
        addEv('canvas', 'dragover', dragover);
        addEv('canvas', 'drop', drop);
    };
    var drag = function(e){        
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
    var drop = function(e){
        var width=150;
        var height=150;
        var posX=e.offsetX-savedObject.offsetX;       
        var posY=e.offsetY-savedObject.offsetY;
        ctx.drawImage(savedObject, posX, posY, width, height);
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