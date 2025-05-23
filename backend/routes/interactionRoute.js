const express = require("express");
const router = express.Router();
const interactionController = require('../controllers/interactionController.js');

router.post('/', interactionController.createInteraction);
router.get('/:agent_id', interactionController.getInteractionsByAgentId);
router.get('/', interactionController.getAllInteraction);
router.delete('/:id', interactionController.deleteInteraction);

module .exports = router;