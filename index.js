const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser')
require('dotenv').config()
const port = process.env.PORT || 5000

app.use(cors())
app.use(bodyParser.json())


app.get('/', (req, res) => {
  res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0hcik.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const eventCollection = client.db("volunteer").collection("events");
  const donationCollection = client.db("volunteer").collection("donation");

  app.get('/events', (req, res) => {
    eventCollection.find()
    .toArray((err, items) => {
      res.send(items)
    })
  })
  app.get('/singleEvent/:id', (req, res) => {
  const id = ObjectID(req.params.id)
  eventCollection.find({_id: id})
      .toArray((err, items) => {
          res.send(items)
      })
})


  app.post('/donation', (req, res) => {
    const newEvent = req.body;
    // console.log("adding new event: ", newEvent);
    donationCollection.insertOne(newEvent)
    .then(result => {
      // console.log('inserted count', result.insertedCount);
       res.send(result. insertCode > 0)
    })
  })

  app.get('/allDonation', (req, res) => {
    console.log(req.query.email);
    donationCollection.find({email: req.query.email})
    .toArray((err, items) => {
      res.send(items)
    })
  })

  app.post('/addEvent', (req, res) => {
    const newEvent = req.body;
    console.log('adding new event: ', newEvent)
    eventCollection.insertOne(newEvent)
    .then(result => {
        console.log('inserted count', result.insertedCount);
        res.send(result.insertedCount > 0)
    })
})

  app.delete('/delete/:id', (req, res) => {
    // console.log(req.params.id);
    const id = ObjectID(req.params.id);
    // console.log(id);
    donationCollection.findOneAndDelete({_id: id})
    .then( result => {
      console.log(result);
        // res.send(!!result.value)
    })
  })

});


app.listen(port)