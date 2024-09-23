import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MasterKey } from './models/MasterKey';

dotenv.config();

const app = express();
// Use the cors middleware
app.use(cors({
  origin: 'http://localhost:5173'
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI!).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Create a new master key
app.post('/api/add-masterkey', async (req: Request, res: Response) => {
  const { shipAddr, masterKey } = req.body;

  try {
      const masterKeyBuffer = Buffer.from(masterKey); // Convert array back to Buffer
      const newMasterKey = new MasterKey({ shipAddr, masterKey: masterKeyBuffer });
      await newMasterKey.save();

      res.status(200).json({ message: 'Master key added successfully' });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Get a master key for a ship
app.get('/api/masterkeys/:shipAddr', async (req: Request, res: Response) => {
  const { shipAddr } = req.params;
  try {
    const masterKey = await MasterKey.findOne({ shipAddr });
    if (!masterKey) {
      return res.status(404).json({ error: 'Master key not found' });
    }
    res.json(masterKey);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// // Delete a master key
// app.delete('/masterkeys/:shipAddr', async (req: Request, res: Response) => {
//   const { shipAddr } = req.params;
//   try {
//     const deletedMasterKey = await MasterKey.findOneAndDelete({ shipAddr });
//     if (!deletedMasterKey) {
//       return res.status(404).json({ error: 'Master key not found' });
//     }
//     res.json({ message: 'Master key deleted' });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));