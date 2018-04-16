;(function($){
        'use strict'; 
        $.fn.photoBlock =  function(options){
            var settings = $.extend( {
                direction : 'vertical', // vertical or horizontal
                quantity : 3,//positive integer,
                optimalWidth: 350,
                spacing: 10, //positive integer or 0
                imgClass: "photo-block-item"
            }, options);

            var _makeStyleString = function(styleArr){
                var styleString = "";
                for(var ruleTitle in styleArr){
                    styleString += ruleTitle+": "+styleArr[ruleTitle]+"; ";
                }
                return styleString;
            }


            var _slyleList = function (){
                var styleArr = {};
                if(settings.spacing){
                    styleArr["padding-right"] = settings.spacing+"px";
                    //styleArr["padding-right"] = styleArr["padding-bottom"] = settings.spacing+"px";
                    
                }    
                return _makeStyleString(styleArr);
            }

            var _formSet = function(heightBlock, optimalWidth, images){
                var cntCol = 0;
                var coeff;
                var k = 0;
                for(var j = 0; j < images.length; j=k){
                    var width = 1000000000;
                    var prevWidth = 0;
    
                    var divElem = document.createElement("div");
                    $(divElem).addClass("cols");

                    while(width > optimalWidth && k < images.length) {
                        k++;
                        var temp = 0;
                        for(var t = j; t<k; t++){
                            temp += images[t].originalHeight*(images[j].originalWidth/images[t].originalWidth);
                        }
                        
                        coeff = heightBlock / temp;
                        
                        prevWidth = width;
                        width = coeff*images[j].originalWidth;
                        if(Math.abs(prevWidth - optimalWidth) <  Math.abs(width - optimalWidth)) {
                            width = prevWidth;
                            k--;
                            break;
                        }       
                        for(var t = j; t<k; t++){
                            images[t].width = Math.round(width);
                            images[t].height = Math.round(coeff*(images[j].originalWidth/images[t].originalWidth)*images[t].originalHeight);
                        }
                        
                    }
                    
                    //Добавление столбца
                    for(t = j; t < k; t++){
                        $(divElem).append("<img src = '" + images[t].src + "' height='"+ images[t].height+"'" + "width='"+ images[t].width+"'>");
                    
                    }                    
                    $(divElem).css("width", Math.round(width)+"px");
                    $(divElem).attr("style",  _slyleList(settings));
                    $(this).append(divElem); 
                }
            }


            if(settings.direction == "vertical"){
                var optimalWidth = parseFloat(settings.optimalWidth);
                this.each(function(index){
                    var heightBlock = parseFloat($(this).css("height"));
                    var photoBlockItems = $(this).find(".photo-block-item");
                    $(this).empty();
                    var images = $.map(photoBlockItems, function(item, i){
                        if($(item).is("img"))
                            var image = $(item);
                        else
                            var image = $(item).find("img:first");
                        return {
                            src: image.attr("src"),
                            originalWidth: image.attr("width"),
                            originalHeight: image.attr("height"),
                            alt: image.attr("alt"),
                            width: "",
                            height: "" 
                        }
                        
                                        
                    });
                    //console.log(images);
                    _formSet.apply( this, [parseFloat(heightBlock), optimalWidth, images]);
                });
            }
            
        }


})(jQuery);