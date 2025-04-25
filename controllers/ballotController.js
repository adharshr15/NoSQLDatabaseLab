const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new ballot
const createBallot = async (voterID, regPIN, electionData, rankings) => {
  try {
    // Use Prisma's query capabilities to find existing ballot
    const existing = await prisma.ballot.findFirst({
      where: {
        'voter.voterID': voterID
      }
    });

    if (existing) {
      throw new Error('This voter has already submitted a ballot.');
    }
    
    // Make sure election data has all required fields
    if (!electionData.electionID || !electionData.name || !electionData.date) {
      throw new Error('Election data is incomplete. Required fields: electionID, name, date');
    }
    
    // Make sure rankings are properly formatted
    if (!Array.isArray(rankings) || rankings.length === 0) {
      throw new Error('Rankings must be a non-empty array');
    }
    
    // Verify each ranking has required nominee data
    rankings.forEach(ranking => {
      if (!ranking.rank || !ranking.nominee || !ranking.nominee.nomineeID || !ranking.nominee.name) {
        throw new Error('Each ranking must include rank and nominee information');
      }
    });

    const ballot = await prisma.ballot.create({
      data: {
        voter: {
          voterID,
          regPIN
        },
        election: electionData,
        timestamp: new Date(),
        rankings: rankings
      }
    });

    return ballot;
  } catch (err) {
    throw new Error(`Error creating ballot: ${err.message}`);
  }
};

// Get all ballots
const getBallots = async () => {
  try {
    return await prisma.ballot.findMany();
  } catch (err) {
    throw new Error('Error fetching ballots');
  }
};

// Get ballot by voterID
const getBallotByVoterID = async (voterID) => {
  try {
    const ballot = await prisma.ballot.findFirst({
      where: {
        'voter.voterID': voterID
      }
    });
    return ballot || null;
  } catch (err) {
    throw new Error(`Error fetching ballot: ${err.message}`);
  }
};

// Update ballot by voterID
const updateBallotByVoterID = async (voterID, { regPIN, electionData, rankings }) => {
  try {
    const existingBallot = await prisma.ballot.findFirst({
      where: {
        'voter.voterID': voterID
      }
    });

    if (!existingBallot) {
      throw new Error(`Ballot not found for voterID: ${voterID}`);
    }

    // Make sure election data has all required fields
    if (!electionData.electionID || !electionData.name || !electionData.date) {
      throw new Error('Election data is incomplete. Required fields: electionID, name, date');
    }
    
    // Make sure rankings are properly formatted
    if (!Array.isArray(rankings) || rankings.length === 0) {
      throw new Error('Rankings must be a non-empty array');
    }

    const updatedBallot = await prisma.ballot.update({
      where: { id: existingBallot.id },
      data: {
        voter: {
          voterID,
          regPIN
        },
        election: electionData,
        rankings: rankings,
        timestamp: new Date()
      }
    });

    return updatedBallot;
  } catch (err) {
    throw new Error(`Error updating ballot: ${err.message}`);
  }
};

// Delete ballot by ID
const deleteBallot = async (id) => {
  try {
    await prisma.ballot.delete({
      where: { id }
    });
    return { message: 'Ballot deleted successfully' };
  } catch (err) {
    throw new Error(`Error deleting ballot with ID: ${id}`);
  }
};

module.exports = {
  createBallot,
  getBallots,
  deleteBallot,
  getBallotByVoterID,
  updateBallotByVoterID
};