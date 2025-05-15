const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController.js');
const { data } = require('react-router-dom');

router.get('/tasks/:agentId', dataController.getTasks);
router.get('/followups/:agentId', dataController.getFollowUps);
router.get('/alltasks', dataController.getAllTasks);
router.get('/allproductrate', dataController.getAllProductRate);
router.get('/all', dataController.getAllHistory);
router.get('/:id', dataController.getHistory);
router.get('/productrate/:id', dataController.getProductRate);
router.post('/tasks/:taskId/complete', dataController.markTaskDone);
router.post('/tasks/:taskId/update', dataController.updateTask);
router.post('/tasks/create', dataController.createTask);
router.delete('/tasks/:taskId/delete', dataController.deleteTask);

module.exports = router;