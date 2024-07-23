const express = require('express');
const userModel = require('../models/userModel');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await userModel.getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.post('/', async (req, res) => {
  const { name, balance } = req.body;
  try {
    const user = await userModel.createUser(name, balance);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.post('/:id/deposit', async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
  try {
    const user = await userModel.getUserById(id);
    const newBalance = user.balance + amount;
    const updatedUser = await userModel.updateUserBalance(id, newBalance);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to deposit amount' });
  }
});

router.post('/:id/withdraw', async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
  try {
    const user = await userModel.getUserById(id);
    if (user.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }
    const newBalance = user.balance - amount;
    const updatedUser = await userModel.updateUserBalance(id, newBalance);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to withdraw amount' });
  }
});

module.exports = router;
