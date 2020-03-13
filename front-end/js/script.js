$(document).ready(function(){
  console.log("js is working");

  $('#heading').click(function(){
    $('#heading').toggle();
  });

  $.ajax({
    url:'http://localhost:3000/allItems',
    type: 'GET',
    success:function(data){
      console.log(data);

    }
  })
});

//get url and port from config.json
$.ajax({
  url :'config.json',
  type :'GET',
  dataType :'json',
  success : function(configData){
    console.log(configData);
    url = `${configData.SERVER_URL}:${configData.SERVER_PORT}`;
    console.log(url);

  },//success
  error:function(){
    console.log('error: cannot call api');
  }//error
});//ajax
