const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const equipmentController = require('../controllers/authController');
const router = express.Router();

// Routes
router.post('/', protect, equipmentController.addEquipment);
router.get('/', protect, equipmentController.getEquipments);
router.put('/:id', protect, equipmentController.updateEquipment);


module.exports = router;
