//titleDisplay is to display the title above each video
function titleDisplay(e,t){
    res=e;
    for(var n=0;n<t.length;n++)
    {
      res=res.replace(/\{\{(.*?)\}\}/g,function(e,r)
    {
        return t[n][r]
    }
        
    )}
      //console.log(res);
  return res
}

var videoMap = []//Map to sort the data
$(function() {
  videoMap=[]   
    $("form").on("submit", function(e) {
       e.preventDefault();       
       $("#results").html("")
       // prepare the request
       var request = gapi.client.youtube.search.list({
            part: "snippet",
            type: "video",
            q: encodeURIComponent($("#search").val()).replace(/%20/g, "+"),
            maxResults: 4,
            order: "viewCount",
            publishedAfter: "2015-01-01T00:00:00Z"
            
           
       }); 

       // execute the request
        request.execute(function(response) {
          var results = response.result;        
          //console.log(results);  
          videoMap=[]       //// 
          $.each(results.items, function(index, item) {
            //push Title,VideoID & Published date in array for sorting purpose
            videoMap.push( 
              {'title': item.snippet.title , 'videoId': item.id.videoId , 'publishedAt': item.snippet.publishedAt}
              )
            embedResults(item.snippet.title , item.id.videoId );            
         });
          resetVideoHeight();
          $("#sortOptions").show();//to display radioButtons for sorting
       });
    });
    
    $(window).on("resize", resetVideoHeight);
});

//var prev = -1;
function sortMe(x)
{ 
  
   $("#results").html("");

   if(parseInt(x) == 1)//sort By Title
   {  

     let titles = {}
     let titlesArray = []
     for( let i = 0; i < videoMap.length; i++)
     {  
       
        titlesArray.push(videoMap[i].title)
        titles[ videoMap[i].title ] = videoMap[i]
       
       
     }

      titlesArray.sort()
      $("#results").html('')
     for( let i = 0; i < titlesArray.length; i++)
     {
        embedResults( titles[titlesArray[i] ].title , titles[titlesArray[i]].videoId )
     }

   }
   else
   {//sort by Date

     let publishDates = {}
     let publishDatesArray = []
     for( let i = 0; i < videoMap.length; i++)
     {
        //console.log(videoMap[i])
        publishDatesArray.push(videoMap[i].publishedAt)
        publishDates[ videoMap[i].publishedAt ] = videoMap[i]
     
     }

   publishDatesArray.sort(function (var1, var2) { 
   var a= new Date(var1), b = new Date(var2);
    if (a > b)
      return 1;
    if (a < b)
      return -1;
   
    return 0;
});
    //console.log(publishDatesArray)

     $("#results").html('')

     for( let i = 0; i < publishDatesArray.length; i++)
     {
        embedResults( publishDates[publishDatesArray[i] ].title , publishDates[publishDatesArray[i]].videoId )
     }

   }
}
//embed Sorted Results in the iFrame
function embedResults(x , y)
{

  $.get("display/item.html", function(data) {
      
      $("#results").append(titleDisplay(data, [{"title":x, "videoid":y}]));
    

  }); 
}

function resetVideoHeight() {
    $(".video").css("height", $("#results").width() * 9/16);
}

function init() {
    gapi.client.setApiKey("Your Public Api Key");//api public key is set
    gapi.client.load("youtube", "v3", function() { 
      console.log("init working");
    $("#sortOptions").hide();
        // api is ready
    });
}


