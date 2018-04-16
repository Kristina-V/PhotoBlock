;(function($){
        'use strict'; 
        $.fn.photoBlock =  function(options){
            var settings = $.extend( {
                direction : 'horizontal', // vertical or horizontal
                quantity : 3,//positive integer,
                optimalSize: 200,
                spacingImg: 5, //positive integer or 0
                spacingRowColumn: 5, //positive integer or 0
                imgClass: "photo-block-item"
            }, options);

            var _makeStyleString = function(styleArr){
                var styleString = "";
                for(var ruleTitle in styleArr){
                    styleString += ruleTitle+": "+styleArr[ruleTitle]+"; ";
                }
                return styleString;
            }


            var _slyleListRowColumn = function (){
                var styleArr = {};
                if(settings.spacingRowColumn){
                    if(settings.direction === "vertical")
                        styleArr["padding-right"] = settings.spacingRowColumn+"px";
                    else
                        styleArr["padding-bottom"] = settings.spacingRowColumn+"px";   
                }    
                return _makeStyleString(styleArr);
            }

            var _slyleListImg = function (){
                var styleArr = {};
                if(settings.spacingImg){
                    if(settings.direction === "vertical")
                        styleArr["padding-bottom"] = settings.spacingImg+"px";
                    else
                        styleArr["padding-right"] = settings.spacingImg+"px";     
                }    
                return _makeStyleString(styleArr);
            }            

            var _formSet = function(sizeBlock, optimalSize, images){
                console.log(sizeBlock);
                var cntCol = 0;
                var coeff;
                var k = 0;
                for(var j = 0; j < images.length; j=k){
                    var size = 1000000000;
                    var prevSize = 0;
    
                    var divElem = document.createElement("div");
                    if(settings.direction == "vertical")
                        $(divElem).addClass("cols");
                    else
                        $(divElem).addClass("rows");    
                    //var spacingsCount = 0;
                    while(size > optimalSize && k < images.length) {
                        k++;
                        var temp = 0;
                        //if(Math.abs(k - j) >=1)
                        var spacingsCount = k-j-1;
                        //console.log(spacingsCount);
                        for(var t = j; t<k; t++){
                            if(settings.direction === "vertical")
                                temp += images[t].originalHeight*(images[j].originalWidth/images[t].originalWidth);
                            else
                                temp += images[t].originalWidth*(images[j].originalHeight/images[t].originalHeight);
                        }
                        

                        //здесь
                        if(spacingsCount > 0)
                            coeff = (sizeBlock-settings.spacingImg*spacingsCount) / temp;
                        else
                            coeff = (sizeBlock) / temp;    
                        
                        prevSize = size;
                        if(settings.direction === "vertical")
                            size = coeff*images[j].originalWidth;
                        else
                            size = coeff*images[j].originalHeight;
                        if(Math.abs(prevSize - optimalSize) <  Math.abs(size - optimalSize)) {
                            size = prevSize;
                            k--;
                            break;
                        }    
                        
                        //здесь
                        for(var t = j; t<k; t++){
                            if(settings.direction === "vertical"){
                                images[t].width = Math.round(size);
                                images[t].height = Math.round(coeff*(images[j].originalWidth/images[t].originalWidth)*images[t].originalHeight);
                            }
                            else{
                                images[t].height = Math.floor(size);
                                images[t].width = Math.floor(coeff*(images[j].originalHeight/images[t].originalHeight)*images[t].originalWidth);
                            }  
                        }
                        
                    }


                    //Добавление столбца
                    for(t = j; t < k; t++){
                        var addStyle = "";
                        if(t < k-1)
                            addStyle += _slyleListImg(settings);
                        
                        $(divElem).append("<img src = '" + images[t].src + "' height='"+ images[t].height+"'" + "width='"+ images[t].width+"' style = '"+addStyle+"'>");
                    } 
                    var blockStyle = settings.direction === "vertical" ? _slyleListRowColumn(settings)+" width: "+Math.round(size)+"px;" : _slyleListRowColumn(settings)+" height: "+ Math.round(size)+"px;" ;
                    $(divElem).attr("style",  blockStyle);
                    $(this).append(divElem); 
                }
            }

    

            return this.each(function(index){
                var optimalSize = parseFloat(settings.optimalSize);
                var sizeBlock = (settings.direction === "vertical") ? parseFloat($(this).css("height")) : parseFloat($(this).css("width"));
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
                _formSet.apply( this, [parseFloat(sizeBlock), optimalSize, images]);
            });
           
            
        }


})(jQuery);