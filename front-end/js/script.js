console.log(sessionStorage);

let url;
var tempStorage = {};

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
    $('#projectDIV').show();
    $('#loginDIV').hide();
    $('#signUpDIV').hide();
    $('#banner').hide();
    showMemberName(sessionStorage.userName);
  } else {
    console.log('Please login');
    $('#loginDIV').show();
    $('#signUpDIV').show();
    $('#logoutDIV').hide();
    $('#projectDIV').hide();
  }

  makeCards();
  $('#loginPage').hide();
  $('#signUpPage').hide();
  $('#projectPage').hide();

  //Home button
  $('#homeBtn').click(function(){
    $('#homePage').show();
    $('#loginPage').hide();
    $('#signUpPage').hide();
    $('#projectPage').hide();
    makeCards();
  });

  //login button
  $('#loginBtn').click(function(){
    $('#loginPage').show();
    $('#homePage').hide();
    $('#signUpPage').hide();
    $('#projectPage').hide();
  });

  //logout button
  $('#logoutBtn').click(function(){
    sessionStorage.clear();
    $('#loginDIV').show();
    $('#signUpDIV').show();
    $('#logoutDIV').hide();
    $('#projectDIV').hide();
    $('#signUpPage').hide();
    $('#projectPage').hide();
    $('#homePage').show();
    //Natalia's code
    $('#banner').show();
    //
    makeCards();
    console.log(sessionStorage);
  });

  //signup button
  $('#signUpBtn').click(function(){
    $('#signUpPage').show();
    $('#loginPage').hide();
    $('#homePage').hide();
    $('#projectPage').hide();
  });

  //project button
  $('#projectBtn').click(function(){
    $('#projectPage').show();
    //makeprojectCards();
    showMyProjects();
    $('#addItemDiv').hide();
    $('#loginPage').hide();
    $('#homePage').hide();
    $('#signUpPage').hide();
  });

  //project button
  $('#projectCancelAddBtn').click(function(){
    $('#pItemCards').show();
    makeprojectCards();
    $('#addItemDiv').hide();
  });


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
        } else {
          sessionStorage.setItem('memberId',loginData['_id']);
          sessionStorage.setItem('userName',loginData['username']);
          sessionStorage.setItem('userEmail',loginData['email']);
          console.log(sessionStorage);

          $('#logoutDIV').show();
          $('#projectDIV').show();
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

        let rowCount = 0;
        let numOfCols = 4;
        let cardCount = 1;

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

  function makeprojectCards(){
    $.ajax({
      url :`${url}/allItems`,
      type :'GET',
      dataType :'json',
      success : function(itemsFromMongo){
        console.log(itemsFromMongo);
        document.getElementById('pItemCards').innerHTML = "";
        document.getElementById('itemCards').innerHTML = "";

        let rowCount = 0;
        let numOfCols = 4;
        let cardCount = 1;

        document.getElementById('pItemCards').innerHTML = '<div id="pItemCardsRow' + rowCount + '" class="row ml-1 mr-1"></div>';

        for (var i = 0; i < itemsFromMongo.length; i++) {
          if ((sessionStorage['userName']) && (itemsFromMongo[i].username === sessionStorage.userName)) {
            cardCount += (1/numOfCols);
            console.log(cardCount);
            if (i/cardCount == numOfCols) {
              rowCount += 1;
              document.getElementById('pItemCardsRow' + rowCount).innerHTML +=
              '<div id="pItemCardsRow' + rowCount + '" class="row ml-1 mr-1"></div>';
            }
          }
          if ((sessionStorage['userName']) && (itemsFromMongo[i].username === sessionStorage.userName)) {
              document.getElementById('pItemCardsRow' + rowCount).innerHTML +=
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
            }
        }
        document.getElementById('pItemCardsRow' + rowCount).innerHTML +=
        `<div class="col-md-3">
        <div class="card mb-4 shadow-sm">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSi4cMVLwifOM2O4CyiXIVuFhlnEKVr-4W7tIJ410ternhEe0J_" class="card-img-top text-muted" alt="Add Project">
        <div class="card-body">
        <div class="d-flex justify-content-between align-items-center">
        <button id="addProjectBtn" class="btn btn-primary btn-sm py-2  card-text" href="#">Add project</button>
        </div>
        </div>
        </div>
        </div>`;

        //add project button
        $('#addProjectBtn').click(function(){
          $('#addItemDiv').show();
          $('#pItemCards').hide();

        })
      },//success
      error:function(){
        console.log('error: cannot call api');
      }//error
    });//ajax
  };

//Natalia's code
  $('#projectAddBtn').click(function(){
    console.log('click');
    let username = sessionStorage.userName;
    let name = $('#a-name').val();
    let description = $('#a-description').val();
    let image = $('#a-imageurl').val();
    // let member_id = sessionStorage.memberId;
    console.log(username, name, description, image, memberId);
    console.log(username, name, description, image, memberId);
    $.ajax({
      url :`${url}/addItem`,
      type :'POST',
      data:{
        username :username,
        // name : name,
        description : description,
        image : image,
        memberId : sessionStorage.getItem('memberId') //Natalia changed this line to make this function work (to store memberId in database)
        },
      success : function(loginData){
        console.log(loginData);

      },//success
      error:function(){
        console.log('error: cannot call api');
      }//error
    });//ajax
  });
  });//document.ready

  //Add Member
  $('#signUpSubmitBtn').click(function(){
    let username = $('#inputUserNameSignup').val();
    let email = $('#inputEmailSignup').val();
    let password = $('#inputPasswordSignup').val();
    let remember = $('#inputRememberSignup').is(":checked");
    console.log(username,email, password);
    $.ajax({
      url :`${url}/addMember`,
      type :'POST',
      data:{
        username : username,
        email : email,
        password : password
        },
      success : function(loginData){
        if (remember) {
          sessionStorage.setItem('memberId',loginData['_id']);
          sessionStorage.setItem('userName',loginData['username']);
          sessionStorage.setItem('userEmail',loginData['email']);
          console.log(sessionStorage);

          $('#logoutDIV').show();
          $('#projectDIV').show();
          $('#homePage').show();
          makeCards();
          $('#loginDIV').hide();
          $('#signUpDIV').hide();
          $('#signUpPage').hide();
          $('#loginPage').hide();

        } else {
          $('#logoutDIV').show();
          $('#projectDIV').show();
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
  });//document.ready


  // Yanas Code

  // UPDATE ITEM FORM ===============================================

  // update item
  $('#updateItemForm').submit(function(){
    event.preventDefault();

    let updateItemId = $('#updateItemId').val();
    let updateItemUsername = $('#updateItemUsername').val();
    let updateItemDes = $('#updateItemDes').val();
    let updateItemImage = $('#updateItemImage').val();
    let memberId = $('#memberId').val();

    $.ajax({
      url :`${url}/updateItem/${updateItemId}`,
      type :'PATCH',
      data:{
        username : updateItemUsername,
        description : updateItemDes,
        image : updateItemImage,
        memberId : memberId //Natalia changes this line to make this function work
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

function showMyProjects(){
    $.ajax({
      url :`${url}/allItems`,
      type :'GET',
      dataType :'json',
      success : function(itemsFromMongo){
        let currentMemberId = sessionStorage.getItem("memberId");
        let myProjects = itemsFromMongo.filter(item=>item.memberId === currentMemberId);
        renderAllCards(myProjects);
      }
    });
}; 

function renderAllCards(projects){
  for(let i=0; i<projects.length; i++){
    let card = renderCard(projects[i]);
    document.getElementById('pItemCards').innerHTML = card;
  }
}

function renderCard(project){
  return  `<div class="col-md-3">
      <div class="card mb-4 shadow-sm">
      <img src="${project.image}" class="card-img-top text-muted" alt="Picture from ${project.username} project">
      <title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"/><text x="50%" y="50%" fill="#eceeef" dy=".3em">Test</text>
        <div class="card-body">
        <p class="card-text">${project.description}</p>
          <div class="d-flex justify-content-between align-items-center">
          <div class="btn-group">
            <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
            <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button>
          </div>
          <small class="text-muted">${project.username}</small>
          </div>
        </div>
      </div>
    </div>`;
}


