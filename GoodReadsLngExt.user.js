// ==UserScript==
// @name         GoodReads edition language finder
// @namespace    gdrs
// @version 1.3
// @description  checks wheter there is an edition with given language and adds a link to found edition to book control div 
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js 
// @author       Ladislav Behal
// @match        https://www.goodreads.com/*
// @exclude https://www.goodreads.com/work/editions/*
// @grant        none
// ==/UserScript==

var language = "Czech";

$1 = this.jQuery = jQuery.noConflict(true);
$1.fn.exists = function () {
    debug(this.length);
    return this.length !== 0;
}
var debug = function(x) {    
    console.log(x); 
};
var image = "<img style='margin: 0px 0px 0px 7px' alt='' src='//upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Flag_of_Czechoslovakia.svg/23px-Flag_of_Czechoslovakia.svg.png' width='23' height='15' class='thumbborder' srcset='//upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Flag_of_Czechoslovakia.svg/35px-Flag_of_Czechoslovakia.svg.png 1.5x, //upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Flag_of_Czechoslovakia.svg/45px-Flag_of_Czechoslovakia.svg.png 2x' data-file-width='900' data-file-height='600'>";
var loadingimage = "<img alt='' src='http://forum.xda-developers.com/clientscript/loading_small.gif'  width='16' height='16'>";
var getEditions = function(ref, data)
{
    var status = $1($1(ref).find('#editiCheckingStatus'));
        
    var editionData = $1($1($1($1(data).find("div.editionData")).has("div.dataValue:contains('"+language+"'):first")).find("a.bookTitle"));
    if(editionData !== undefined && editionData.exists())
    {              
        if(status !== undefined)
            status.remove();
        
        $1(ref).append(image);
        $1(ref).append(" ")
        editionData.removeClass();
        editionData.toggleClass("smallText");
        editionData.appendTo(ref);
    }else
    {
        status.text('Edition language not found');
    }
        
}

var getBookDetail = function(ref, url) {  
    $1.get(url).success(function(bookDetail) { 
        //extract 
        var link = $1($1(bookDetail).find("div.otherEditionsActions a:contains('all editions')")).attr('href');        
        if(link !== undefined)
        {
            debug("getting edition details for "+ link);
            $1.get(link+"?utf8=✓&per_page=100&expanded=true").success(function(data) {       
                getEditions(ref, data);
            }).error(function(jqXHR, textStatus, errorThrown) {
                debug("error:"+textStatus+" "+errorThrown);
            });       
        }
    }).error(function(jqXHR, textStatus, errorThrown) {
        debug("error:"+textStatus+" "+errorThrown);
    });
};

$1(".wtrButtonContainer").each(function() {     
     var status = $1("<div id='editiCheckingStatus'><img alt='' src='http://forum.xda-developers.com/clientscript/loading_small.gif'  width='16' height='16'> Checking editions...</div>");
    
    $1(this).height("+=35");
     $1(this).append(status);
    getBookDetail($1(this), "https://www.goodreads.com/book/show/"+$1($1(this).find('input#book_id:first')).attr('value'))
});
