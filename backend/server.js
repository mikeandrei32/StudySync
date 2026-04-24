import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'StudySync API is running' });
});

// TODO: Add routes for:
// - User authentication
// - Subjects
// - Tasks
// - Study plans
// - Focus sessions
// - Notes

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});