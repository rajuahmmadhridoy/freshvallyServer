const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID
require('dotenv').config();
const port = process.env.PORT || 5050;
app.use(cors());;
app.use(bodyParser.json());




app.get('/', (req, res) => {
  res.send('Hello World!')
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gegqi.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("freshvellyfood").collection("product");
  const orderdCollection = client.db("freshvellyfood").collection("orderd");
  console.log('data base connected');

  app.get('/product',(req, res)=>{
    productCollection.find()
    .toArray((err, items)=>{
      res.send(items)
      // console.log('from database',items);
    })
  })

  app.post('/addProduct', (req,res)=>{
    const newproduct = req.body;
    console.log('adding new product', newproduct)
    productCollection.insertOne(newproduct) 
    .then(result => {
      console.log('inserted count',result.insertedCount);
      res.send(result.insertedCount > 0)
    } )
  })


  app.get('/product/:id',(req, res)=>{
    const id = req.params.id
    productCollection.find({_id:ObjectID(id)})
    .toArray((err, documents)=>{
      res.send(documents)
    })
  })
 
  app.post('/orderdProduct', (req,res)=>{
    const newOrderdproduct = req.body;
    console.log('adding new product', newOrderdproduct)
    orderdCollection.insertOne(newOrderdproduct) 
    .then(result => {
      console.log('inserted count',result.insertedCount);
      res.send(result.insertedCount > 0)
    } )
  })

  app.get('/productemail',(req, res)=>{
    console.log('ke hmm',req.query.email);
    orderdCollection.find({email: req.query.email})
    .toArray((err, documents)=>{
      res.send(documents)
    })
  })

  app.delete('/deleteProduct/:id',(req,res)=>{
    const id=ObjectID(req.params.id);
    console.log('delete this');
    productCollection.deleteOne({_id: id})
    .then((err,documents)=>res.send(documents))
  })
  app.delete('/deleteOrderdProduct/:id',(req,res)=>{
    const id=ObjectID(req.params.id);
    console.log('delete this');
    orderdCollection.deleteOne({_id: id})
    .then((err,documents)=>res.send(documents))
  })
});


app.listen(port)