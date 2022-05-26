const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
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
        console.log('Data Base connected');

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