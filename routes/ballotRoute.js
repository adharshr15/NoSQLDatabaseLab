const express = require('express');
const {
  createBallot,
  getBallots,
  updateBallotByVoterID,
  deleteBallot,
  getBallotByVoterID
} = require('../controllers/ballotController');
const router = express.Router();

// POST route to create or update a ballot
router.post('/', async (req, res) => {
  try {
    const { voterID, regPIN, election, rankings } = req.body;

    if (!voterID || !regPIN) {
      return res.status(400).json({ error: 'Missing voterID or regPIN' });
    }

    if (!election || !election.electionID || !election.name || !election.date) {
      return res.status(400).json({ error: 'Missing or incomplete election data' });
    }

    if (!rankings || !Array.isArray(rankings) || rankings.length === 0) {
      return res.status(400).json({ error: 'Missing or invalid rankings' });
    }

    // Validate each ranking
    for (const rank of rankings) {
      if (!rank.rank || !rank.nominee || !rank.nominee.nomineeID || !rank.nominee.name) {
        return res.status(400).json({ 
          error: 'Invalid ranking format', 
          details: 'Each ranking must include rank and nominee information' 
        });
      }
    }

    // Parse ISO date string to Date object if needed
    const electionData = {
      ...election,
      date: new Date(election.date)
    };

    const existingBallot = await getBallotByVoterID(voterID);

    if (existingBallot) {
      const updatedBallot = await updateBallotByVoterID(voterID, {
        regPIN,
        electionData,
        rankings
      });

      return res.json({
        message: 'Ballot updated successfully!',
        updatedBallot
      });
    } else {
      const newBallot = await createBallot(voterID, regPIN, electionData, rankings);

      return res.status(201).json({
        message: 'Ballot created successfully!',
        newBallot
      });
    }
  } catch (err) {
    res.status(400).json({ error: 'Error processing ballot', details: err.message });
  }
});

// GET all ballots
router.get('/all', async (_req, res) => {
  try {
    const ballots = await getBallots();
    res.json(ballots);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ballots', details: err.message });
  }
});

// GET ballot by voterID
router.get('/:voterID', async (req, res) => {
  const { voterID } = req.params;

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

// PUT update ballot by voterID
router.put('/:voterID', async (req, res) => {
  const { voterID } = req.params;
  const { regPIN, election, rankings } = req.body;

  try {
    // Validate required fields
    if (!regPIN) {
      return res.status(400).json({ error: 'Missing regPIN' });
    }

    if (!election || !election.electionID || !election.name || !election.date) {
      return res.status(400).json({ error: 'Missing or incomplete election data' });
    }

    if (!rankings || !Array.isArray(rankings) || rankings.length === 0) {
      return res.status(400).json({ error: 'Missing or invalid rankings' });
    }

    // Parse ISO date string to Date object if needed
    const electionData = {
      ...election,
      date: new Date(election.date)
    };

    const existingBallot = await getBallotByVoterID(voterID);

    if (!existingBallot) {
      return res.status(404).json({ error: 'Ballot not found' });
    }

    const updatedBallot = await updateBallotByVoterID(voterID, {
      regPIN,
      electionData,
      rankings
    });

    res.json({
      message: 'Ballot updated successfully!',
      updatedBallot
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE ballot by voterID
router.delete('/:voterID', async (req, res) => {
  const { voterID } = req.params;

  try {
    const ballot = await getBallotByVoterID(voterID);
    if (!ballot) {
      return res.status(404).json({ error: 'Ballot not found' });
    }

    await deleteBallot(ballot.id);
    res.json({ message: 'Ballot deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting ballot', details: err.message });
  }
});

module.exports = router;