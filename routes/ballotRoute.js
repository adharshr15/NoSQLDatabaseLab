const express = require('express');
const { createBallot, getBallots, updateBallot, deleteBallot } = require('../controllers/ballotController'); 
const router = express.Router();

// POST route to create a new ballot
router.post('/', async (req, res) => {
  const { voterID, regPIN, firstChoice, secondChoice, thirdChoice } = req.body;

  // Check if all fields are filled
  if (!voterID || !regPIN || !firstChoice || !secondChoice || !thirdChoice) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Attempt to create a new ballot
    const ballot = await createBallot(voterID, regPIN, firstChoice, secondChoice, thirdChoice);

    // Return success response with message and the created ballot
    res.status(201).json({
      message: 'Ballot created successfully!',
      ballot, // or you could select specific fields from the ballot to return
    });
  } catch (err) {
    // Return a standardized error message
    res.status(400).json({ error: 'Error creating ballot', details: err.message });
  }
});

// GET route to fetch all ballots
router.get('/', async (req, res) => {
  try {
    const ballots = await getBallots();
    res.json(ballots);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ballots' });
  }
});

// PUT route to update an existing ballot
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const ballot = await updateBallot(id, data);
    res.json(ballot);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE route to delete a ballot by id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await deleteBallot(id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
