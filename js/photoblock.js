;(function($){
        'use strict'; 
        $.fn.photoBlock =  function(options){
            var settings = $.extend( {
                direction : 'horizontal', // vertical or horizontal
                quantity : 3,//positive integer,
                optimalSize: 350,
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


            var _slyleListRowColumn = function (fullSize){
                var styleArr = {};
                if(settings.spacingRowColumn){
                    if(settings.direction === "vertical")
                        styleArr["margin-right"] = 100*settings.spacingRowColumn/fullSize+"%";
                    else
                        styleArr["margin-bottom"] = 100*settings.spacingRowColumn/fullSize+"%";   
                }    
                return _makeStyleString(styleArr);
            }

            var _slyleListImg = function (fullSize, last){
                var styleArr = {};
                if(settings.spacingImg){
                    if(settings.direction === "vertical")
                        styleArr["margin-bottom"] = 100*settings.spacingImg/fullSize+"%";
                    else{
                        //to do: последний пробел - меньше из-за масштабного округления
                        styleArr["margin-right"] = last ? Math.floor(100*settings.spacingImg/fullSize)+"%" : 100*settings.spacingImg/fullSize+"%"; 
                    }    
                
                }  
                return _makeStyleString(styleArr);
            }  
            
            var _cutNum = function(num, precision){
                var string = num.toString();
                var newArr = string.split(".");
                if(newArr.length>1){
                    var fraction = newArr[1].substr(0, precision);
                    return newArr[0]+"."+fraction;
                }
                return newArr[0]
            }

            var _formSet = function(sizeBlock, optimalSize, images){
                //console.log(sizeBlock);
                var cntCol = 0;
                var coeff;
                var k = 0;
                var blockHeightWidth = 0;
                var arDiv = [];
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
                        var spacingsCount = k-j-1;
                        for(var t = j; t<k; t++){
                            if(settings.direction === "vertical")
                                temp += images[t].originalHeight*(images[j].originalWidth/images[t].originalWidth);
                            else
                                temp += images[t].originalWidth*(images[j].originalHeight/images[t].originalHeight);
                        }
                        
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
                        //console.log(images[t]);
                        var addStyle = "";
                        if(t < k-1)
                        {
                            var last = false;
                            if(t == k-2)
                                last = true;
                            addStyle += (settings.direction === "vertical") ? _slyleListImg(size, false) : _slyleListImg(sizeBlock, last); // Любой маржин считается относительно ширины элемента
                        }
                        $(divElem).append("<img src = '" + images[t].src + "'  style = '"+addStyle+"'>");
                    } 
                    blockHeightWidth += size;
                    arDiv.push({
                        element: divElem,
                        size: size
                    });
                }

                blockHeightWidth += (arDiv.length - 1)*settings.spacingImg;
                for(var indDiv in arDiv){
                    var fullWidth = (settings.direction === "vertical") ? blockHeightWidth : sizeBlock;
                    var divAddStyle = (indDiv == arDiv.length-1) ?  "" : _slyleListRowColumn(fullWidth);
                    var blockStyle = settings.direction === "vertical" ? divAddStyle+" width: "+100*arDiv[indDiv].size/blockHeightWidth+"%;" : divAddStyle+" height: "+ 100*arDiv[indDiv].size/blockHeightWidth+"%;" ;
                    $(arDiv[indDiv].element).attr("style",  blockStyle);
                    $(this).append(arDiv[indDiv].element); 
                }

                //31.1054845419586
                //29.7008512820075
                //console.log(blockHeightWidth);
                if(settings.direction === "vertical"){
                    var parentWidth = $(this).parent().width();
                    console.dir( $(this).parent());
                    console.log("parentWidth", parentWidth);
                    $(this).css("width", (100*blockHeightWidth/parentWidth)+"%");
                }
                else{
                    var parentHeight = $(this).parent().height();
                    $(this).css("height", blockHeightWidth+"px");
                }
               
            }

    

            return this.each(function(index){
                var optimalSize = parseFloat(settings.optimalSize);
                var sizeBlock = (settings.direction === "vertical") ? parseFloat($(this).css("height")) : parseFloat($(this).css("width"));
                console.log("sizeBlock", sizeBlock);
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
                
                _formSet.apply( this, [parseFloat(sizeBlock), optimalSize, images]);
            });
           
            
        }


})(jQuery);