const express = require('express');
const router = express.Router();
const { Task } = require('../model/models');
const path = require('path')

// Read all tasks
router.get('/', async (req, res) => {
  const tasks = await Task.find({ user: req.session.userId });
  res.render('tasks', {tasks})
});

// Add a new task
router.post('/', async (req, res) => {
  const { title } = req.body;
  const task = new Task({ title, user: req.session.userId });
  await task.save();
  res.redirect('/tasks');
});

// Delete a task
router.delete('/:id', async (req, res) => {
  console.log(req.params.id);
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.redirect('/tasks');
    
  } catch (error) {
    console.log(error);
  }
  
});

// Update a task
router.put('/:id', async (req, res) => {
  const { completed } = req.body;
  await Task.findByIdAndUpdate(req.params.id, { completed });
  res.redirect('/tasks');
});

module.exports = router;