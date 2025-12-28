import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'SantaOS Backend is running 🎅' });
});

// API Routes
app.use('/api', router);

app.listen(port, () => {
    console.log(`Server running on port ${port} 🎄`);
});
