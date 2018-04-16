;(function($){
    var methods = {
        _formSet: function(heightBlock, optimalWidth, images, settings){
            var cntCol = 0;
            var coeff;
            console.dir(images);
            var k = 0;
            for(var j = 0; j < images.length; j=k+1){
                var k = j;
                var width = 1000000000;
                var prevWidth = 0;

                while(width > optimalWidth) {
                    var temp = 0;
                    for(var t = j; t<=k; t++){
                        temp += images[t].originalHeight*(images[j].originalWidth/images[t].originalWidth);
                    }
                    coeff = heightBlock / temp;
                    prevWidth = width;
                    width = coeff*images[j].originalWidth;
                    if(Math.abs(prevWidth - optimalWidth) <  Math.abs(width - optimalWidth))
                        break;
                    
                    for(var t = j; t<=k; t++){
                        images[t].width = width;
                        images[t].height = coeff*(images[j].originalWidth/images[t].originalWidth)*images[t].originalHeight;
                    }
                    k++;
                }
                
                
                //Добавление столбца
                for(t = j; t < k; t++){
                    $(divElem).append("<img src = '" + images[t].src + "' height='"+ images[t].height+"'" + "' width='"+ images[t].width+"'>");
                
                }                    
                

                var divElem = document.createElement("div");
                $(divElem).addClass("cols");
                $(divElem).css("width", Math.round(width)+"px");
                $(this).append(divElem); 
            }
        },


        init: function(options){
            var settings = $.extend( {
                direction : 'vertical', // vertical or horizontal
                quantity : 3,//positive integer,
                optimalWidth: 370,
                spacing: 10, //positive integer or 0
                imgClass: "photo-block-item"
            }, options);
            return this.each(function(){
                if(settings.direction == "vertical"){
                    var heightBlock = parseFloat($(this).css("height"));
                    var optimalWidth = parseFloat(settings.optimalWidth);
                    var photoBlockItems = $(this).find(".photo-block-item");
                    $(this).empty();
                    var images = [];
                    /*photoBlockItems.each(function(i, val){
                        
                        if($(this).is("img"))
                            image = $(this);
                        else
                        image = $(this).find("img:first");
                        images.push({
                            src: image.attr("src"),
                            originalWidth: image.attr("width"),
                            originalHeight: image.attr("height"),
                            alt: image.attr("alt"),
                            width: "",
                            height: "" 
                        }); 
                        console.dir(image);   
                    });*/

                    images = $.map(photoBlockItems, function(item, i){
                        if($(item).is("img"))
                            image = $(item);
                        else
                            image = $(item).find("img:first");
                        return  {
                            src: image.attr("src"),
                            originalWidth: image.attr("width"),
                            originalHeight: image.attr("height"),
                            alt: image.attr("alt"),
                            width: "",
                            height: "" 
                        };
                                          
                    });
                    
                    console.dir(images);
                    methods["_formSet"].apply( this, [parseFloat(heightBlock), optimalWidth, images, settings]);
          
                
                }
                
            });
            
        }

    };

    $.fn.photoBlock = function(method){
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } 
        else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } 
        else {
            $.error( 'Метод с именем ' +  method + ' не существует для jQuery.tooltip' );
        }
    }
})(jQuery);