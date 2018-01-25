$(document).ready(function(){
  var pos=[];
  var unit="C";
  var apiid="133daa16c23326f2af0d1603063dfea5";
  var link=[];
  var temp=0,min=0,max=0,maxi=[0,0,0,0];
  var r;
  try{
  navigator.geolocation.getCurrentPosition(function(position) { 
  //Get Location & Link
  pos[0]=position.coords.latitude;
  pos[1]=position.coords.longitude;
  console.log("Latitude: "+pos[0]+" & Longitude: "+pos[1]);
  link[1]="https://api.openweathermap.org/data/2.5/forecast?lat="+pos[0]+"&lon="+pos[1]+"&appid="+apiid;//Upcoming data
  link[0]="https://api.openweathermap.org/data/2.5/weather?lat="+pos[0]+"&lon="+pos[1]+"&appid="+apiid;//Today's data
    $(".footer").html("Latitude: "+pos[0]+"<br/> Longitude: "+pos[1]+"<br/>Data Source: Openweathermap.org api");
    
    //Today's Data
    $.getJSON(link[0],function(result){
      r=result;
      var imageUrl="https://github.com/rajatkantinandi/my-images/raw/master/",imgid=result.weather[0].id;
      if(imgid>=200&&imgid<300){
        imageUrl+="thunderstorm.jpg";
      }
      else if(imgid>=300&&imgid<400){
        imageUrl+="drizzle.jpg";
      }
      else if(imgid>=500&&imgid<600){
        imageUrl+="rain.jpg";
      }
      else if(imgid>=600&&imgid<700){
        imageUrl+="snow.jpg";
      }
      else if(imgid>=700&&imgid<800){
        imageUrl+="atmosphere.jpg";
      }
      else if(imgid==800){
        imageUrl+="clear.jpg";
      }
      else if(imgid>800&&imgid<900){
        imageUrl+="cloudy.jpg";
      }
      if(imgid>=900){
        imageUrl+="tornado.jpg";
      }
      if(unit=="C"){
      temp=Math.round(result.main.temp-273);
      max=Math.round(result.main.temp_max-273);
      min=Math.round(result.main.temp_min-273);
      }
      if(unit=="F"){
        temp=Math.round(1.8*(result.main.temp-273)+32);
        max=Math.round(1.8*(result.main.temp_max-273)+32);
        min=Math.round(1.8*(result.main.temp_min-273)+32);
      }
      $(".temp").text(temp);
      $(".description").text(result.weather[0].description.toUpperCase());
      $(".max").text(max);
      $(".min").text(min);
      $(".location").text(result.name+", "+result.sys.country);
      $(".humidity").text(result.main.humidity);
      $(".wind").text(result.wind.speed);
      $(".rain").text(result.clouds.all);
      $(".app").attr('style', 'background-image: url("' + imageUrl +'")');
    });
    
    
    //toogle button
    $(".sel a").on("click",function(){
      unit=this.id;
      var notunit;
      if(unit=="C"){
      temp=Math.round(r.main.temp-273);
      max=Math.round(r.main.temp_max-273);
      min=Math.round(r.main.temp_min-273);
      if($(".daily").is(":visible")){
        for(var i=1;i<5;i++){
        $(".day"+i+" .maxi").text(maxi[i-1]); 
        }
      }
      notunit="F";
      }
      if(unit=="F"){
        temp=Math.round(1.8*(r.main.temp-273)+32);
        max=Math.round(1.8*(r.main.temp_max-273)+32);
        min=Math.round(1.8*(r.main.temp_min-273)+32);
        if($(".daily").is(":visible")){
        for(var k=1;k<5;k++){
        $(".day"+k+" .maxi").text(Math.round(maxi[k-1]*1.8+32)); 
        }
      }
        notunit="C";
      }
      $(".temp").text(temp);
      $(".max").text(max);
      $(".min").text(min);
      $(".scale").text(unit);
      $("#"+unit).addClass("selected");
      $("#"+unit).removeClass("unselected");      
      $("#"+notunit).addClass("unselected");
      $("#"+notunit).removeClass("selected");
    });
    
    
    //Upcoming days data
    $(".next-btn").on("click",function(){
      $(".weather").animate({marginTop:"-55px"},800);
      $(".next-btn").css("display","none");
      $(".daily").css("visibility","visible");
      $(".daily").animate({marginTop:"-15px"},600);
      $(".current").css("font-size","25px");
      $.getJSON(link[1],function(result){
        var d = new Date();
        var days =["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
        var tday =d.getDay();
        for(var i=1;i<5;i++){
        $(".day"+i+" b").text(days[(tday+i)%7]);
        maxi[i-1]=Math.round(result.list[8*i].main.temp-273);
        $(".day"+i+" .maxi").text(maxi[i-1]);
        $(".day"+i+" .mini").text(result.list[8*i].weather[0].main);  
        }
      });     
    });
});
}
catch(err){
  $(".footer").html("Your Browser was unable to detect location.<br/> Please enable location settings on your device & allow location access to this page.");
}
});