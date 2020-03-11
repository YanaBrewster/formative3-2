// Yanas code

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcryptjs = require('bcryptjs');
const config = require('./config.json'); // store creditials
const dbItem = require('./models/item.js');
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

app.get('/', (req, res) => res.send('Hello World!'))


// // GET an item/s
// app.get('/allItems', (req,res)=>{
//   res.json(item)
// });

// GET all db items

app.get('/allDBItems', (req,res) =>{
  Item.find().then(result =>{
    res.send(result);
  }).catch(err => res.send(err));
});

// GET one item

app.get('/item/id=:id', (req,res) =>{
  const idParam = req.params.id;
  for (let i = 0; i < Item.length; i++){
    if (idParam === Item[i]._id) {
      res.json(Item[i]);
    }
  }
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
