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
  
  
const getBallots = async () => {
    const ballots = await prisma.ballot.findMany();
    return ballots;
};
  
  
const updateBallot = async (id, data) => {
    const ballot = await prisma.ballot.update({
      where: { id },
      data,
    });
    return ballot;
};
  
  
const deleteBallot = async (id) => {
    await prisma.ballot.delete({
      where: { id },
    });
    return { message: 'Ballot deleted' };
};
  
  
module.exports = {
    createBallot,
    getBallots,
    updateBallot,
    deleteBallot
  };
