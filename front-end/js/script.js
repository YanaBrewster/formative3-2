console.log(sessionStorage);
console.log(sessionStorage['memberId']);

let url;
var tempStorage = {};
sessionStorage;

//get url and port from config.json
$.ajax({
  url :'config.json',
  type :'GET',
  dataType :'json',
  success : function(configData){
    // console.log(configData);
    url = `${configData.SERVER_URL}:${configData.SERVER_PORT}`;
    // console.log(url);
  },//success
  error:function(){
    console.log('error: cannot call api');
  }//error
});//ajax

$(document).ready(function(){
  // console.log("js is working");

  //check if there is any session sessionStorage
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

  //mak home page cards and hide other pages
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
    $('#memberName').empty();
    //
    makeCards();
    // console.log(sessionStorage);
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
    $('#updateItemDiv').hide();
    $('#pItemCards').show();
    $('#pItemCardsBefore').show();
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
    // console.log(username,password,remember);
    $.ajax({
      url :`${url}/loginMember`,
      type :'POST',
      data:{
        username : username,
        password : password
      },
      success : function(loginData){
        console.log(loginData);
        if (loginData === 'Please fill in all areas') {
          alert('Please fill in all areas')
        }else if (loginData === 'Member not found. Please register') {
          alert('Register please')
        } else if (loginData === 'Not Authorized') {
          alert('Incorrect Password')
        } else if (remember) {
          //Natalia's code
          showMemberName(username);
          $('#banner').hide();
          //END of Natalia's code

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
          sessionStorage.setItem('memberId',loginData['_id']);
          sessionStorage.setItem('userName',loginData['username']);
          sessionStorage.setItem('userEmail',loginData['email']);
          console.log(sessionStorage);
          //Natalia's code
          showMemberName(username);
          $('#banner').hide();
          //END of Natalia's code
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

  //make home page cards function
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

          if ((sessionStorage['memberId']) && (itemsFromMongo[i].member_Id === sessionStorage.memberId)) {
            document.getElementById('itemCardsRow' + rowCount).innerHTML +=
            `<div class="col-md-3">
            <div class="card mb-4 shadow-sm">
            <img src="${itemsFromMongo[i].image}" class="card-img-top text-muted" alt="Picture from ${itemsFromMongo[i].username}\'s project">
            <strong>${itemsFromMongo[i].title}</strong>
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
            <img src="${itemsFromMongo[i].image}" class="card-img-top text-muted" alt="Picture from ${itemsFromMongo[i].username}\'s project">
            
            <div class="card-body">
            <strong>${itemsFromMongo[i].title}</strong>
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

  //make My Projects home page cards
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
          if ((sessionStorage['memberId']) && (itemsFromMongo[i].member_Id === sessionStorage.memberId)) {
            cardCount += (1/numOfCols);
            console.log(cardCount);
            if (i/cardCount == numOfCols) {
              rowCount += 1;
              document.getElementById('pItemCardsRow' + rowCount).innerHTML +=
              '<div id="pItemCardsRow' + rowCount + '" class="row ml-1 mr-1"></div>';
            }
          }
          if ((sessionStorage['memberId']) && (itemsFromMongo[i].member_Id === sessionStorage.memberId)) {
            document.getElementById('pItemCardsRow' + rowCount).innerHTML +=
            `<div class="col-md-3">
            <div class="card mb-4 shadow-sm">
            <img src="${itemsFromMongo[i].image}" class="card-img-top p-4 text-muted" alt="Picture from ${itemsFromMongo[i].username}\'s project">
            <strong class="text-bold">${itemsFromMongo[i].title}</strong>
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

  // Add Project Code
  //Natalia's code
  $('#projectAddBtn').click(function(){
    let username = sessionStorage.userName;
    let title = $('#a-name').val();
    console.log(title);
    let description = $('#a-description').val();
    let image = $('#a-imageurl').val();
    $.ajax({
      url :`${url}/addItem`,
      type :'POST',
      data:{
        username :username,
        title : title,
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

//Add Member Code
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
});//document.ready


// Yanas Code

// UPDATE ITEM FORM ===============================================

// update item
$('#projectUpdateBtn').click(function(){
  console.log('button pressed');
  event.preventDefault();
  let projectId = $('#updateProjectId').val();
  let projectUsername = $('#updateProjectUsername').val();
  let projectTitle = $('#updateProjectTitle').val();
  let projectDescription = $('#updateProjectDescription').val();
  let projectImage = $('#updateProjectImage').val();
  let memberId = $('#updateProjectMemberId').val();

  $.ajax({
    url :`${url}/updateItem/${projectId}`,
    type :'PATCH',
    data:{
      _id: projectId,
      username : projectUsername,
      title: projectTitle,
      description : projectDescription,
      image : projectImage,
      memberId : memberId
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

// Yana and Natalia 
// Delete project

$('#projectDeleteBtn').on('click',function(){
  // event.preventDefault();
  let projectId = $('#deleteProjectId').val();
  console.log(projectId);
    $.ajax({
    url :`${url}/deleteProject/${projectId}`,
    type :'DELETE',
    success : function(data){
      console.log(data);
      if (data=='deleted'){
        alert('deleted');
        $('#deleteProjectId').val('');
      } else {
        alert('Error while deleting project');
      }
    },//success
    error:function(){
      console.log('error: cannot call api');
    }//error
  });//ajax
});

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
      myProjects = itemsFromMongo.filter(item=>item.memberId === currentMemberId);
      renderAllCards(myProjects);
      showAddProjectButton();
    }
  });
};

function showAddProjectButton(){
  document.getElementById('pItemCardsBefore').innerHTML = "";
  document.getElementById('pItemCardsBefore').innerHTML += `<div class="col-md-3">
  <div class="card mb-4 shadow-sm">
  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSi4cMVLwifOM2O4CyiXIVuFhlnEKVr-4W7tIJ410ternhEe0J_" class="card-img-top text-muted" alt="Add Project">
  <div class="card-body">
  <div class="d-flex justify-content-between align-items-center">
  <button id="addProjectBtn" onclick="showAddProjectForm()" class="btn btn-primary btn-sm py-2  card-text" href="#">Add project</button>
  </div>
  </div>
  </div>
  </div>`;
}

function showAddProjectForm(){
  $('#addItemDiv').show();
  $('#pItemCards').hide();
}

function renderAllCards(projects){
  document.getElementById('pItemCards').innerHTML = "";
  for(let i=0; i<projects.length; i++){
    let project = projects[i];
    let card = renderCard(project);
    document.getElementById('pItemCards').innerHTML += card;
  }
}

function renderCard(project){
  return  `<div class="col-md-3">
  <div class="card mb-4 shadow-sm">
  <img src="${project.image}" class="card-img-top text-muted" alt="Picture from ${project.username} project">
  <div class="card-body">
  <strong>${project.title}</strong>
  <p class="card-text">${project.description}</p>
  <small class="text-muted">Author: ${project.username}</small>
  <div class="d-flex justify-content-between align-items-center">
  <div class="btn-group">
  <button id="deleteProject_${project._id}" onclick="showDeleteForm('${project._id}')" type="button" class="btn btn-sm btn-outline-secondary">Delete</button>
  <button id="updateProject_${project._id}" onclick="showUpdateForm('${project._id}')" type="button" class="btn btn-sm btn-outline-secondary ">Update</button>
  </div>
  
  </div>
  </div>
  </div>
  </div>`;
}

function showUpdateForm(projectId){
  $('#updateItemDiv').show();
  $('#pItemCards').hide();
  $('#pItemCardsBefore').hide();
  // console.log(projectId);
  let projects = myProjects.filter(item=>item._id === projectId);
  let project = projects[0];
  $('#updateProjectId').val(project._id);
  $('#updateProjectUsername').val(project.username);
  $('#updateProjectTitle').val(project.title);
  $('#updateProjectDescription').val(project.description);
  $('#updateProjectImage').val(project.image);
  $('#updateProjectMemberId').val(project.memberId);
  $('#updateProjectForm').removeClass("d-none");
}

function showDeleteForm(projectId){
  $('#deleteItemDiv').show();
  $('#pItemCards').hide();
  $('#pItemCardsBefore').hide();
  // console.log(projectId);
  let projects = myProjects.filter(item=>item._id === projectId);
  let project = projects[0];
  $('#deleteProjectId').val(project._id);
  $('#deleteProjectForm').removeClass("d-none");
}
