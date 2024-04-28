const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const port = process.env.PORT || 5000
app.use(cors({
    origin: ["http://localhost:5173", "https://assignment-10-5fcf9.web.app"]
  }))
app.use(express.json())

// MongoDB


//Start 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h4cvmus.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();


    const database = client.db('myusers');
    const user = database.collection('myusr');
    const tourists_spots = database.collection('tourists_spots');
    const allspots = database.collection('allspots');

    app.get('/user', async(req, res)=>{
      const coffee = user.find();
      const result = await coffee.toArray();
      res.send(result);
    })
    app.post('/user', async(req, res)=>{
      const coffee = req.body;
      const usrData = await user.insertOne(coffee);
      res.send(usrData);
    })
    app.get('/spots',async(req, res)=>{
      const spots = tourists_spots.find();
      const spot = await spots.toArray();
      res.send(spot);
    })
    app.get('/spots/:id', async (req, res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const result = await tourists_spots.findOne(query);
      res.send(result);
    })
    app.get('/allspots',async(req, res)=>{
      const allspot = allspots.find();
      const spotall = await allspot.toArray();
      res.send(spotall);
    })
    app.post('/allspots', async(req, res)=>{
      const newspot = req.body;
      const spotData = await allspots.insertOne(newspot);
      res.send(spotData);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);

// End


app.get('/',(req, res)=>{
    res.send('this is home page');
});


app.listen(port, ()=>{
    console.log(`server is running at ${port}`);
})
