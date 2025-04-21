const express = require('express');
const { createBallot, getBallots, updateBallot, deleteBallot } = require('');
const router = express.Router();

router.post('', async (req, res) => {
  const { voterID, regPIN, firstChoice, secondChoice, thirdChoice } = req.body;
  try {
    const ballot = await createBallot(voterID, regPIN, firstChoice, secondChoice, thirdChoice);
    res.status(201).json(ballot);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('', async (req, res) => {
  try {
    const ballots = await getBallots();
    res.json(ballots);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ballots' });
  }
});

router.put('', async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const ballot = await updateBallot(parseInt(id), data);
    res.json(ballot);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await deleteBallot(parseInt(id));
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
