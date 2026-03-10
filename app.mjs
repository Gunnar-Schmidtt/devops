
// --- Timer API ---
// CREATE - Add timer
// (Moved below app definition)
import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uri = process.env.MONGO_URI;

app.use(express.static(join(__dirname, 'public')));
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToMongo() {
  try {
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log('Connected to MongoDB!');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}
connectToMongo();
// --- Timer API ---
// CREATE - Add timer
app.post('/api/timers', async (req, res) => {
  try {
    const { label, desc, startTime, dateStr, timeStr } = req.body;
    if (!label || !startTime || !dateStr || !timeStr) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const db = client.db('cis486');
    const collection = db.collection('timers');
    const timer = { label, desc, startTime, dateStr, timeStr, createdAt: new Date() };
    const result = await collection.insertOne(timer);
    res.json({ message: 'Timer added!', id: result.insertedId });
  } catch (error) {
    console.error('Error creating timer:', error);
    res.status(500).json({ error: 'Failed to add timer' });
  }
});

// READ - Get all timers
app.get('/api/timers', async (req, res) => {
  try {
    const db = client.db('cis486');
    const collection = db.collection('timers');
    const timers = await collection.find({}).toArray();
    res.json(timers);
  } catch (error) {
    console.error('Error reading timers:', error);
    res.status(500).json({ error: 'Failed to get timers' });
  }
});

// DELETE - Remove timer
app.delete('/api/timers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = client.db('cis486');
    const collection = db.collection('timers');
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Timer not found' });
    }
    res.json({ message: 'Timer deleted!' });
  } catch (error) {
    console.error('Error deleting timer:', error);
    res.status(500).json({ error: 'Failed to delete timer' });
  }
});

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

// API Health/Endpoints Documentation

// ADD NOTE - Add a dated note to a timer
app.post('/api/timers/:id/notes', async (req, res) => {
  try {
    const { id } = req.params;
    const { text, date } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Note text is required' });
    }
    const db = client.db('cis486');
    const collection = db.collection('timers');
    const note = {
      text,
      date: date ? new Date(date) : new Date()
    };
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $push: { notes: note } }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Timer not found' });
    }
    res.json({ message: 'Note added!' });
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({ error: 'Failed to add note' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    server: 'Timer Tracker Server',
    timestamp: new Date().toISOString(),
    endpoints: [
      { method: 'GET', path: '/', description: 'Serve main HTML page' },
      { method: 'POST', path: '/api/timers', description: 'Add new timer card' },
      { method: 'GET', path: '/api/timers', description: 'Get all timer cards' },
      { method: 'DELETE', path: '/api/timers/:id', description: 'Delete timer card' },
      { method: 'POST', path: '/api/timers/:id/notes', description: 'Add a note to a timer' }
    ]
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});