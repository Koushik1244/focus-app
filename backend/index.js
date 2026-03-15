const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'Blitz Hack API running 🚀' });
});

// Create a new session
app.post('/sessions', async (req, res) => {
  try {
    const { wallet, duration, stake } = req.body;
    const session = await prisma.session.create({
      data: { wallet, duration, stake },
    });
    res.json({ success: true, session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Settle a session (pass or fail)
app.post('/sessions/:id/settle', async (req, res) => {
  try {
    const { focusScore } = req.body;
    const success = focusScore >= 85;
    const session = await prisma.session.findUnique({
      where: { id: req.params.id },
    });
    if (!session) return res.status(404).json({ error: 'Session not found' });
    const reward = success ? session.stake * 1.2 : 0;
    const updated = await prisma.session.update({
      where: { id: req.params.id },
      data: {
        focusScore,
        success,
        reward,
        settledAt: new Date(),
      },
    });
    res.json({ success: true, session: updated, reward });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get session history for a wallet
app.get('/sessions/:wallet', async (req, res) => {
  try {
    const sessions = await prisma.session.findMany({
      where: { wallet: req.params.wallet },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    const streak = sessions.filter(s => s.success).length;
    res.json({ sessions, streak });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Blitz Hack API running on http://localhost:${PORT}`);
});