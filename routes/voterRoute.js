const express = require('express');
const { createVoter, getVoters, updateVoter, deleteVoter } = require('../controllers/voterControllerTemplate');
const router = express.Router();

router.post('/', async (req, res) => {
    const user = await createUser(
        // Params
    );
    res.json(user);
});
  
router.get('/', async (req, res) => {
    const users = await getUsers();
    res.json(users);
});
  
router.put('/:id', async (req, res) => {
    const user = await updateUser(
        // Params
    );
    res.json(user);
});
  
router.delete('/:id', async (req, res) => {
    await deleteUser(parseInt(req.params.id));
    res.json({ message: 'User deleted' });
});

module.exports = router