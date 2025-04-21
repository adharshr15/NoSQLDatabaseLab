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
        return ballots;
    } catch (err) {
        throw new Error('Error fetching ballots');
    }
};

// Update a ballot by ID
const updateBallot = async (id, data) => {
<<<<<<< HEAD
    try {
        const ballot = await prisma.ballot.update({
            where: { id },
            data,
        });
        return ballot;
    } catch (err) {
        throw new Error(`Error updating ballot with ID: ${id}`);
    }
=======
    const ballot = await prisma.ballot.update({
      where: { id },
      data,
    });
    return ballot;
>>>>>>> e6d9a0ae90df0207cdd1df8785b53aace2f1da27
};

// Delete a ballot by ID
const deleteBallot = async (id) => {
<<<<<<< HEAD
    try {
        await prisma.ballot.delete({
            where: { id },
        });
        return { message: 'Ballot deleted successfully' };
    } catch (err) {
        throw new Error(`Error deleting ballot with ID: ${id}`);
    }
=======
    await prisma.ballot.delete({
      where: { id },
    });
    return { message: 'Ballot deleted' };
>>>>>>> e6d9a0ae90df0207cdd1df8785b53aace2f1da27
};

module.exports = {
    createBallot,
    getBallots,
    updateBallot,
    deleteBallot,
};
