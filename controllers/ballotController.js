const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new ballot
const createBallot = async (voterID, regPIN, firstChoice, secondChoice, thirdChoice) => {
    const existing = await prisma.ballot.findFirst({
        where: { voterID, regPIN },
    });

    if (existing) {
        throw new Error('This voter has already submitted a ballot.');
    }

    const ballot = await prisma.ballot.create({
        data: {
            voterID,
            regPIN,
            firstChoice,
            secondChoice,
            thirdChoice,
        },
    });

    return ballot;
};

// Get all ballots
const getBallots = async () => {
    try {
        const ballots = await prisma.ballot.findMany();
        console.log("ballots: ", ballots)
        return ballots;
    } catch (err) {
        throw new Error('Error fetching ballots');
    }
};

// Get ballot by voterID
async function getBallotByVoterID(voterID) {
    try {
        const ballot = await prisma.ballot.findUnique({
            where: { voterID },
        });
        return ballot;
    } catch (err) {
        console.error(err);
        throw new Error('Error fetching ballot by voterID');
    }
}

// Update ballot by voterID
const updateBallotByVoterID = async (voterID, { regPIN, firstChoice, secondChoice, thirdChoice }) => {
    try {
        // Check if the ballot exists
        const existingBallot = await prisma.ballot.findUnique({
            where: { voterID: voterID }
        });

        if (!existingBallot) {
            throw new Error(`Ballot not found for voterID: ${voterID}`);
        }

        // Update the ballot with the new data
        const updatedBallot = await prisma.ballot.update({
            where: { voterID: voterID },
            data: {
                regPIN: regPIN,
                firstChoice: firstChoice,
                secondChoice: secondChoice,
                thirdChoice: thirdChoice
            }
        });

        return updatedBallot;
    } catch (err) {
        throw new Error('Error updating ballot: ' + err.message);
    }
};

// Delete ballot by ID
const deleteBallot = async (id) => {
    try {
        await prisma.ballot.delete({
            where: { id },
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
