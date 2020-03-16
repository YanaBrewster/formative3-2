// Yanas code
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcryptjs = require('bcryptjs');
const config = require('./config.json'); // store creditials
// const item = require('./models/item.js');
const Item = require('./models/item.js');
const Member = require('./models/member.js');

const port = 3000;

app.get('/', (req, res) => res.send('Hello World from Natalia, James and Yana!'))

const mongodbURI = `mongodb+srv://${config.MONGO_USER}:${config.MONGO_PASSWORD}@${config.MONGO_CLUSTER_NAME}-fymte.mongodb.net/Formative3-2?retryWrites=true&w=majority`
mongoose.connect(mongodbURI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> console.log('DB connected'))
.catch(err =>{
  console.log(`DBConnectionError: ${err.message}`);
});

// test connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
  console.log('We are connected to MongoDB');
});

// connect endpoints
app.use((req,res,next)=>{
  console.log(`${req.method} request for ${req.url}`);
  next();//include this to go to the next middleware
});

// include body-parser, cors, bcryptjs
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(cors());



// Test Code - James {

// // Register Item
// app.post('/registerItem', (req,res)=>{
//
//   Item.findOne({username:req.body.username},(err,itemResult)=>{
//     if (itemResult){
//       res.send('name taken already. Please try another one');
//     } else{
//       const item = new Item({
//         _id : new mongoose.Types.ObjectId,
//         username : req.body.username,
//         description : req.body.description,
//         image : req.body.image
//       });
//
//       item.save().then(result =>{
//         res.send(result);
//       }).catch(err => res.send(err));
//     }
//   })
// });

// Add Member
app.post('/addMember', (req,res)=>{
  Member.findOne({username:req.body.username},(err,memberResult)=>{
    if (memberResult){
      res.send('Username taken already. Please try another one');
    } else{
      const hash = bcryptjs.hashSync(req.body.password);
      const member = new Member({
        _id : new mongoose.Types.ObjectId,
        title: req.body.title,
        username : req.body.username,
        email : req.body.email,
        password :hash
      });
      member.save().then(result =>{
        res.send(result);
      }).catch(err => res.send(err));
    }
  })
});

//get all Member
app.get('/allMember', (req,res)=>{
  Member.find().then(result =>{
    res.send(result);
  })

});

//Login Member
app.post('/loginMember', (req, res) =>{
  Member.findOne({username:req.body.username},(err, memberResult) =>{
    if (memberResult) {
      if (bcryptjs.compareSync(req.body.password, memberResult.password)){
        res.send(memberResult);
      } else {
        res.send('Not Authorized');
      }
    } else if (req.body.username === "") {
      res.send('Please fill in all areas');
    } else {
      res.send('Member not found. Please register');
    }
  });
});


// }

// Yanas code

// GET all db items
app.get('/allItems', (req,res) =>{
  Item.find().then(result =>{
    res.send(result);
  }).catch(err => res.send(err));
});

// DELETE an project
app.delete('/deleteProject/:id',(req,res)=>{
  const idParam = req.params.id;
  Item.findOne({_id:idParam}, (err,item)=>{
    if (item){
      Item.deleteOne({_id:idParam},err=>{
        res.send('deleted');
      });
    } else {
      res.send('not found');
    }
  }).catch(err => res.send(err)); //refers to mogodb id
});

// GET one item
app.get('/items/:id', (req,res) =>{
  const idParam = req.params.id;
  Item.findOne({_id:idParam}).then(itemResult =>{
      res.send(itemResult);
  }).catch(err => res.send(err)); //refers to mogodb id
});

// ADD an item
app.post('/addItem', (req,res) =>{
  //Natalia changed line below to be able to add new item, same username, different description
  Item.findOne({image:req.body.title},(err,itemResult)=>{
    if (itemResult){
      res.send('Item already added');
    } else{
      const item = new Item({
        _id : new mongoose.Types.ObjectId,
        username : req.body.username,
        title : req.body.title,
        description: req.body.description,
        image : req.body.image,
        memberId : req.body.memberId
      });
      item.save().then(result =>{
        res.send(result);
      }).catch(err => res.send(err));
    }
  })
});
// end of Yanas code


//Natalia's code

// UPDATE an item
app.patch('/updateItem/:id',(req,res)=>{
  const idParam = req.params.id;
  Item.findById(idParam,(err,item)=>{
    //first two checks
    //when item is not found
    if(!item){
      res.send('item not found');
      return;
    }
    //if memberId is not equal to memberId in request
    // if(item['member_id'] !== req.body.memberId){
    //   res.send('401 error; user has no permission to update');
    //   return;
    // }
    //this code will be reached only for existing item and the same memberID, so we can safely update
    const updatedItem ={
      username:req.body.username,
      title : req.body.title,
      description:req.body.description,
      image : req.body.image,
      memberId : req.body.memberId
    };
    Item.updateOne({_id:idParam}, updatedItem).then(result=>{
      res.send(result);
    }).catch(err=> res.send(err));

  }).catch(err=>res.send('Error'));
});
//Natalia's code ENDS

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
