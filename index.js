const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
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

// Verify Token
function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'Unauthorized Access' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.SECRET_TOKEN, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden Access' });
        }
        req.decoded = decoded;
        next();
    });
}

// Main Function
async function run() {
    try {
        await client.connect();
        const productionCollection = client.db("production").collection("product");
        const orderedCollection = client.db("production").collection("ordered");
        const reviewCollection = client.db("production").collection("reviews");
        const adminCollection = client.db("production").collection("admin");
        const usersCollection = client.db("production").collection("users");

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
            const result = await productionCollection.insertOne(body);
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

        // All Ordered Load from DB
        app.get('/orders', async (req, res) => {
            const result = await orderedCollection.find().toArray();
            res.send(result);
        });

        // Delete Product from Order
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderedCollection.deleteOne(query);
            res.send(result);
        });

        // Set Users on Database
        app.put('/admins/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updatedDoc = {
                $set: user,
            };
            const result = await adminCollection.updateOne(filter, updatedDoc, options);
            const token = jwt.sign({ email: email }, process.env.SECRET_TOKEN, {
                expiresIn: '1h'
            });
            res.send({ result, token });
        });

        // Make Admin by an Admin
        app.put('/admins/admin/:email', verifyJWT, async (req, res) => {
            const email = req.params.email;
            const requester = req.decoded.email;
            const requesterAccount = await adminCollection.findOne({ email: requester });
            if (requesterAccount.role === 'admin') {
                const filter = { email: email };
                const updatedDoc = {
                    $set: { role: 'admin' },
                };
                const result = await adminCollection.updateOne(filter, updatedDoc);
                res.send(result);
            }
            else {
                res.status(403).send({ message: 'Forbidden Access' })
            }
        });

        // Load User Who Ordered
        app.get('/admins', verifyJWT, async (req, res) => {
            const result = await adminCollection.find().toArray();
            res.send(result);
        });

        // Add Reviews Part Added
        app.get('/reviews', async (req, res) => {
            const reviews = await reviewCollection.find().toArray();
            res.send(reviews);
        });

        // Update Reviews Collection
        app.post('/reviews', async (req, res) => {
            const body = req.body;
            const reviews = await reviewCollection.insertOne(body);
            res.send(reviews);
        });

        // Set & Update User
        app.put('/users/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updatedDoc = {
                $set: user,
            };
            const result = await usersCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });

        // Load User
        app.get('/users', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const result = await usersCollection.find(query).toArray();
            res.send(result);
        })

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