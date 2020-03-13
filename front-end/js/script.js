$(document).ready(function(){
  console.log("js is working");

  $('#heading').click(function(){
    $('#heading').toggle();
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



// Yanas Code

// UPDATE ITEM FORM ===============================================

  // update item
  $('#updateItemForm').submit(function(){
    event.preventDefault();

    let updateItemId = $('#updateItemId').val();
    let updateItemUsername = $('#updateItemUsername').val();
    let updateItemDes = $('#updateItemDes').val();
    let updateItemImage = $('#updateItemImage').val();
    let userId = $('#userId').val();

    $.ajax({
      url :`${url}/updateItem/${updateItemId}`,
      type :'PATCH',
      data:{
        username : updateItemUsername,
        description : updateItemDes,
        image : updateItemImage,
        userId : userId
      },
      success : function(data){
        console.log(data);

      },//success
      error:function(){
        console.log('error: cannot call api');
      }//error
    });//ajax
  });//submit function for updateItem form

  // LOGIN USER FORM ==================================================================

  // login user
  $('#inputLogin').submit(function(){
    event.preventDefault();
    let username = $('#inputUsernameLogin').val();
    let password = $('#inputPasswordLogin').val();
    console.log(username,password);
    $.ajax({
      url :`${url}/loginUser`,
      type :'POST',
      data:{
        username : username,
        password : password
      },
      success : function(loginData){
        console.log(loginData);
        if (loginData === 'user not found. Please register' ) {
          alert ('Register please');
        } else {
          sessionStorage.setItem('userId',loginData['_id']);
          sessionStorage.setItem('userName', loginData['username']);
          sessionStorage.setItem('userEmail', loginData['email']);
          console.log(sessionStorage);
        }
      },//success
      error:function(){
        console.log('error: cannot call api');
      }//error

    });//ajax
  });//submit function for login form


  // LOG OUT USER BUTTON ===============================================================

  // log out user
  $('#logoutBtn').click(function(){
    sessionStorage.clear()
    location.reload("#inputLogin");
  });

  // Yanas code ends

