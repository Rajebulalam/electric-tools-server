const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


// Middle Ware
app.use(cors());
app.use(express.json());

// MongoDB Connected
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nyvck.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// Main Function
async function run() {
    try {
        await client.connect();
        const productionCollection = client.db("production").collection("product");
        const orderedCollection = client.db("production").collection("ordered");

        // Get All Product from Db
        app.get('/product', async (req, res) => {
            const query = {};
            const result = await productionCollection.find(query).toArray();
            res.send(result);
        });

        // Get Product by Id
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productionCollection.findOne(query);
            res.send(result);
        });

        // Set Product On Data Base
        app.post('/product', async (req, res) => {
            const body = req.body;
            const result = await orderedCollection.insertOne(body);
            res.send(result);
        });

        // Load Product by User Email
        app.get('/items', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const result = await orderedCollection.find(query).toArray();
            res.send(result);
        });

        // Delete Product from Order
        app.delete('/items/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderedCollection.deleteOne(query);
            res.send(result);
        });

    }
    finally {

    }
}

run().catch(console.dir);

// Server Site Home Page
app.get('/', async (req, res) => {
    res.send('Hello World');
});

// Server Site Lister
app.listen(port, () => {
    console.log('Server Site Running 5000')
});

// Pass : NWAAlKc8FPfIPXR0
// User : rajebulalam