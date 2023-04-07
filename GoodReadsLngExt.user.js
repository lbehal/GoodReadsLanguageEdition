// ==UserScript==
// @name         GoodReads edition language finder
// @namespace    gdrs
// @version     1.6
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

window.onload = () => {
    debugger;
  var currentUrl = window.location.href;
    //https://www.goodreads.com/book/show/18007564-the-martian?from_search=true&from_srp=true&qid=DJKxvjpoXZ&rank=1
    var match = currentUrl.match(/goodreads.com\/book\/show\/(\d+)/);
  if(match !== undefined)
  {
    var bookId = match[1];
      //get additions as well
      var divBookActions = $1("div.BookPage__leftColumn div.BookActions");
      if(divBookActions !== undefined)
      {
          var status = $1("<div id='editiCheckingStatus'><img alt='' src='https://raw.githubusercontent.com/Marvel999/Android-Loading-Animation/master/LoadingAnimation/src/main/res/drawable/triad_ring.gif'  width='16' height='16'> Checking editions...</div>");
          $1(divBookActions).append(status);
          getBookDetail(divBookActions, "https://www.goodreads.com/book/show/"+bookId)
      }
  }
};

var image = "<img style='margin: 0px 0px 0px 7px' alt='' src='https://images.freeimages.com/fic/images/icons/662/world_flag/256/flag_of_czech_republic.png' width='23' height='15' class='thumbborder' >";
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
        debugger;
        //var link = $1($1(bookDetail).find("div.otherEditionsActions a:contains('All Editions')")).attr('href');
        var match = bookDetail.match(/https:\/\/www.goodreads.com\/work\/editions\/\d+/);
        var link = $1($1(bookDetail).find("a[href^='https://www.goodreads.com/work/editions/']:first")).attr('href');
        if(match !== undefined)
        {
            link = match[0];
            debug("getting edition details for "+ link);
            $1.get(link+"?utf8=✓&per_page=10000&expanded=true").success(function(data) {
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
     var status = $1("<div id='editiCheckingStatus'><img alt='' src='https://raw.githubusercontent.com/Marvel999/Android-Loading-Animation/master/LoadingAnimation/src/main/res/drawable/triad_ring.gif'  width='16' height='16'> Checking editions...</div>");
    
    $1(this).height("+=35");
     $1(this).append(status);
    var bookId = $1($1(this).find('input#book_id:first')).attr('value');
    getBookDetail($1(this), "https://www.goodreads.com/book/show/"+bookId)

});
