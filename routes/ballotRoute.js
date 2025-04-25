const express = require('express');
const { createBallot, getBallots, updateBallotByVoterID, deleteBallot, getBallotByVoterID } = require('../controllers/ballotController');
const router = express.Router();

// POST route to create or update a ballot
router.post('/', async (req, res) => {
  const { voterID, regPIN, firstChoice, secondChoice, thirdChoice } = req.body;

  // Check if all fields are filled
  if (!voterID || !regPIN || !firstChoice || !secondChoice || !thirdChoice) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Check if the ballot already exists for the voterID
    const existingBallot = await getBallotByVoterID(voterID);

    if (existingBallot) {
      // If ballot exists, update the existing ballot with the new data
      const updatedBallot = await updateBallotByVoterID(voterID, {
        regPIN,
        firstChoice,
        secondChoice,
        thirdChoice,
      });

      return res.json({
        message: 'Ballot updated successfully!',
        updatedBallot,
      });
    } else {
      // If ballot does not exist, create a new ballot
      const newBallot = await createBallot(voterID, regPIN, firstChoice, secondChoice, thirdChoice);

      return res.status(201).json({
        message: 'Ballot created successfully!',
        newBallot,
      });
    }
  } catch (err) {
    // Return a standardized error message
    res.status(400).json({ error: 'Error processing ballot', details: err.message });
  }
});

// GET route to fetch all ballots
router.get('/all', async (req, res) => {
  console.log('Fetching all ballots...');
  try {
    const ballots = await getBallots();
    res.json(ballots);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ballots' });
  }
});

// GET route to fetch one ballot by voterID
router.get('/:voterID', async (req, res) => {
  const { voterID } = req.params;

  if (!voterID) {
    return res.status(400).json({ error: 'VoterID is required' });
  }

  try {
    const ballot = await getBallotByVoterID(voterID);
    if (!ballot) {
      return res.status(404).json({ error: 'Ballot not found' });
    }

    res.json(ballot);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ballot', details: err.message });
  }
});



// PUT route to update an existing ballot by voterID
router.put('/:voterID', async (req, res) => {
  const { voterID } = req.params;
  const { regPIN, firstChoice, secondChoice, thirdChoice } = req.body;

  // Check if all fields are filled
  if (!regPIN || !firstChoice || !secondChoice || !thirdChoice) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Check if the ballot exists for the given voterID
    const existingBallot = await getBallotByVoterID(voterID);

    if (!existingBallot) {
      return res.status(404).json({ error: 'Ballot not found for this voterID' });
    }

    // Update the existing ballot with the new data
    const updatedBallot = await updateBallotByVoterID(voterID, {
      regPIN,
      firstChoice,
      secondChoice,
      thirdChoice,
    });

    res.json({
      message: 'Ballot updated successfully!',
      updatedBallot,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE route to delete a ballot by voterID
router.delete('/:voterID', async (req, res) => {
  const { voterID } = req.params;

  try {
    // Fetch ballot by voterID to check if it exists
    const ballot = await getBallotByVoterID(voterID);

    if (!ballot) {
      return res.status(404).json({ error: 'Ballot not found' });
    }

    // Delete the ballot
    await deleteBallot(ballot.id);
    res.json({ message: 'Ballot deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting ballot', details: err.message });
  }
});

module.exports = router;
