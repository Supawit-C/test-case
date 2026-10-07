import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import userRoutes from './UserRoutes.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = Number(process.env.PORT) || 3000;
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (_req, res) => {
    res.send('User API is running. Open /test.html to try it.');
});
app.use('/api', userRoutes);
function getMongoUri() {
    if (process.env.MONGODB_URI) {
        return process.env.MONGODB_URI;
    }
    const configPath = path.join(process.cwd(), 'config.json');
    if (!fs.existsSync(configPath)) {
        return undefined;
    }
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    return config.connection;
}
async function startServer() {
    const mongoUri = getMongoUri();
    if (mongoUri) {
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');
    }
    else {
        console.warn('MongoDB connection not configured. The server is running, but database-backed API routes are unavailable.');
    }
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}
startServer().catch((error) => {
    console.error('Unable to start server:', error);
    process.exitCode = 1;
});
export default app;
