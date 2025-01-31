const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const port = process.env.PORT || 5000
// app.use(cors({
//     origin: ["http://localhost:5173", "https://assignment-10-5fcf9.web.app"]
//   }))
app.use(express.json())
app.use(cors())

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "https://assignment-10-5fcf9.web.app");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

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
    app.get('/allspots/:email', async (req, res)=>{
      const result = await allspots.find({your_email:req.params.email}).toArray();
      res.send(result);
    })
    app.get('/allspot/:id', async (req, res)=>{
      const id = req.params.id;
      const findId = {_id : new ObjectId(id)};
      const details = await allspots.findOne(findId)
      res.send(details);
    })
    app.delete('/allspot/:id', async (req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await allspots.deleteOne(query);
      res.send(result);
    })
    app.put('/allspot/:id', async (req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true};
      const updateSpot = req.body;
      const updateSpotInfo = {
        $set: {
            image: updateSpot.image,
            tourists_spot_name: updateSpot.tourists_spot_name,
            country_Name: updateSpot.country_Name,
            average_cost: updateSpot.average_cost,
            short_description: updateSpot.short_description,
            seasonality: updateSpot.seasonality,
            travel_time: updateSpot.travel_time,
            totalVisitorsPerYear: updateSpot.totalVisitorsPerYear,
            location: updateSpot.location,
        }
      }
      const result = await allspots.updateOne(filter, updateSpotInfo, options);
      res.send(result);
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
