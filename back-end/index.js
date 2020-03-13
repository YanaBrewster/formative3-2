// Yanas code
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcryptjs = require('bcryptjs');
const config = require('./config.json'); // store creditials
const item = require('./models/item.js');
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

// }

// Yanas code

// GET all db items
app.get('/allItems', (req,res) =>{
  Item.find().then(result =>{
    res.send(result);
  }).catch(err => res.send(err));
});

// GET one item
app.get('/items/:id', (req,res) =>{
  const idParam = req.params.id;
  Item.findOne({_id:idParam}).then(itemResult =>{
      res.send(itemResult);
  }).catch(err => res.send(err)); //refers to mogodb id
});

//add items
app.post('/addItem', (req,res) =>{
  //checking if product is found in the db already
  Item.findOne({name:req.body.name},(err,itemResult)=>{
    if (itemResult){
      res.send('Item already added');
    } else{
      const item = new Item({
        _id : new mongoose.Types.ObjectId,
        username : req.body.username,
        description: req.body.description,
        image : req.body.image
      });
      item.save().then(result =>{
        res.send(result);
      }).catch(err => res.send(err));
    }
  })
});

// DELETE an item
app.delete('/deleteItem/:id',(req,res)=>{
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

// end of Yanas code


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
