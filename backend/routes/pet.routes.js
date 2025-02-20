const express = require('express');
const router = express.Router();
const petController = require('../controllers/pet.controller');
const  verifyToken  = require('../middleware/auth.middleware');
const upload = require('../middleware/multerConfig'); // Import Multer middleware

router.post('/reportForm', verifyToken, upload.single('petPhoto'), petController.reportForm);
router.get('/getAllReports/:status',petController.getAllReports);

// router.post('/report-missing', verifyToken, petController.reportMissingPet);
// router.post('/report-sighted', verifyToken, petController.reportSightedPet);
// router.get('/:id', petController.getPetById);
// router.put('/:id', verifyToken, petController.updatePetStatus);
// router.delete('/:id', verifyToken, petController.deletePetReport);

module.exports = router;