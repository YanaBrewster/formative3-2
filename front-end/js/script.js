console.log(sessionStorage);

let url;

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

$(document).ready(function(){
  console.log("js is working");
  if (sessionStorage['userName']) {
    console.log('You are logged in');
    $('#logoutDIV').show();
    $('#loginDIV').hide();
    $('#signUpDIV').hide();
  } else {
    console.log('Please login');
    $('#loginDIV').show();
    $('#logoutDIV').hide();
  };

  makeCards();
  $('#loginPage').hide();
  $('#signUpPage').hide();

  //Home button
  $('#homeBtn').click(function(){
    $('#homePage').show();
    $('#loginPage').hide();
    $('#signUpPage').hide();
    makeCards();
  })

  //login button
  $('#loginBtn').click(function(){
    $('#loginPage').show();
    $('#homePage').hide();
    $('#signUpPage').hide();
  })

  //logout button
  $('#logoutBtn').click(function(){
    sessionStorage.clear();
    $('#loginDIV').show();
    $('#signUpDIV').show();
    $('#logoutDIV').hide();
    $('#signUpPage').hide();
    $('#homePage').show();
    //Natalia's code
    $('#banner').show();
    //
    makeCards();
    console.log(sessionStorage);
  })

  //login button
  $('#signUpBtn').click(function(){
    $('#signUpPage').show();
    $('#loginPage').hide();
    $('#homePage').hide();
  })

  //get Member JS and login
  $('#loginSubmitBtn').click(function(){
    let username = $('#inputUsernameLogin').val();
    let password = $('#inputPasswordLogin').val();
    let remember = $('#inputRememberLogin').is(":checked");
    console.log(username,password,remember);
    $.ajax({
      url :`${url}/loginMember`,
      type :'POST',
      data:{
        username : username,
        password : password
      },
      success : function(loginData){
        console.log(loginData);
        //Natalia's code
        showMemberName(username);
        $('#banner').hide();
        //END of Natalia's code
        if (loginData === 'Please fill in all areas') {
          alert('Please fill in all areas')
        }else if (loginData === 'Member not found. Please register') {
          alert('Register please')
        } else if (loginData === 'Not Authorized') {
          alert('Incorrect Password')
        } else if (remember) {
          sessionStorage.setItem('userId',loginData['_id']);
          sessionStorage.setItem('userName',loginData['username']);
          sessionStorage.setItem('userEmail',loginData['email']);
          console.log(sessionStorage);
          
          $('#logoutDIV').show();
          $('#homePage').show();
          makeCards();
          $('#loginDIV').hide();
          $('#signUpDIV').hide();
          $('#signUpPage').hide();
          $('#loginPage').hide();

        } else {
          $('#logoutDIV').show();
          $('#homePage').show();
          makeCards();
          $('#loginDIV').hide();
          $('#signUpDIV').hide();
          $('#signUpPage').hide();
          $('#loginPage').hide();
        }
      },//success
      error:function(){
        console.log('error: cannot call api');
      }//error
    });//ajax
  });

  function makeCards(){
    $.ajax({
      url :`${url}/allItems`,
      type :'GET',
      dataType :'json',
      success : function(itemsFromMongo){
        console.log(itemsFromMongo);
        document.getElementById('itemCards').innerHTML = "";

        var rowCount = 0;
        var numOfCols = 4;
        var cardCount = 1;

        document.getElementById('itemCards').innerHTML = '<div id="itemCardsRow' + rowCount + '" class="row ml-1 mr-1"></div>';

        for (var i = 0; i < itemsFromMongo.length; i++) {
          cardCount += (1/numOfCols);
          console.log(cardCount);
          if (i/cardCount == numOfCols) {
            rowCount += 1;
            document.getElementById('itemCardsRow' + rowCount).innerHTML +=
            '<div id="itemCardsRow' + rowCount + '" class="row ml-1 mr-1"></div>'
          }

          if ((sessionStorage['userName']) && (itemsFromMongo[i].username === sessionStorage.userName)) {
              document.getElementById('itemCardsRow' + rowCount).innerHTML +=
              `<div class="col-md-3">
              <div class="card mb-4 shadow-sm">
              <img src="${itemsFromMongo[i].image}" class="card-img-top text-muted" alt="Picture from ${itemsFromMongo[i].username} project">
              <title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"/><text x="50%" y="50%" fill="#eceeef" dy=".3em">Test</text>
              <div class="card-body">
              <p class="card-text">${itemsFromMongo[i].description}</p>
              <div class="d-flex justify-content-between align-items-center">
              <div class="btn-group">
              <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
              <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button>
              </div>
              <small class="text-muted">${itemsFromMongo[i].username}</small>
              </div>
              </div>
              </div>
              </div>`;

        } else {
          document.getElementById('itemCardsRow' + rowCount).innerHTML +=
          `<div class="col-md-3">
          <div class="card mb-4 shadow-sm">
          <img src="${itemsFromMongo[i].image}" class="card-img-top text-muted" alt="Picture from ${itemsFromMongo[i].username} project">
          <title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"/><text x="50%" y="50%" fill="#eceeef" dy=".3em">Test</text>
          <div class="card-body">
          <p class="card-text">${itemsFromMongo[i].description}</p>
          <div class="d-flex justify-content-between align-items-center">
          <div class="btn-group">
          <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
          </div>
          <small class="text-muted">${itemsFromMongo[i].username}</small>
          </div>
          </div>
          </div>
          </div>`
          ;
        }

        }
      },//success
      error:function(){
        console.log('error: cannot call api');
      }//error
    });//ajax
  };


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


  // Yanas code ENDS


  //Natalia's code
  
  function showMemberName(name){
    document.getElementById('memberName').innerHTML = "Hello " + name +"!";
  }

});
