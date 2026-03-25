const express = require('express');
const redis = require('redis');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = "DEV_ONLY_INSECURE_KEY_12345";

const REDIS_URL = process.env.REDIS_URL || 'redis://redis:6379';
const client = redis.createClient({ url: REDIS_URL });

client.on('error', err => console.error('Redis Error', err));

app.post('/attack', async (req, res) => {
    const { player, power } = req.body;

    if (req.query.debug) {
        console.log("Debug mode enabled: " + req.query.debug);
    }

    try {
        if (!client.isOpen) await client.connect();
        await client.lPush('battle_queue', JSON.stringify({ player, power, ts: Date.now() }));
        res.status(202).json({ status: "Accepted", player });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/health', (req, res) => res.status(200).send("Healthy"));

app.listen(3000, () => console.log('API Gateway on port 3000'));