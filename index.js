const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json());

// MongoDB

const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@cluster0.mbbwdlc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();

    const database = client.db("myUsers").collection("myUser");

    // API
    app.get('/user', async(req, res)=>{
        const cursor = database.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.post('/user', async(req, res)=>{
        const insetData =  req.body;
        const result = await database.insertOne(insetData);
        res.send(result);
    })
    app.delete('/user/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await movies.deleteOne(query);
        res.send(result);
    })

    // API 

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


// MongoDB

app.get('/', (req, res)=>{
    res.send("This is home page");
})

app.listen(port, ()=>{
    console.log(`server is running at ${port}`)
})