import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'SantaOS Backend is running 🎅' });
});

// Example DB route
app.get('/now', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database connection failed' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port} 🎄`);
});
