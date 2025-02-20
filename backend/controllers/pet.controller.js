const Pet = require('../models/pet.model');
const axios = require('axios');
// const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;



exports.reportForm = async (req, res) => {
  try {
    const petPhoto = req.file ? `/uploads/${req.file.filename}` : null; // Store file path;
    const location = req.body.location ? JSON.parse(req.body.location) : null;

      const alreadyExist = await Pet.findOne({
          $and: [{ petName: req.body.petName }, { petBreed: req.body.petBreed }]
        });
        if (alreadyExist) {
          return res.status(400).json({ message: 'Pet already exists' });
        }
    const newPet = new Pet({
      userId :req.user.id,
      petName: req.body.petName,
      species: req.body.species,
      petBreed: req.body.petBreed,
      lastSeenAddress: req.body.lastSeenAddress,
      petAge: req.body.petAge,
      petFeatures: req.body.petFeatures || '',
      petPhoto: req.file ? req.file.path : null, // Save file path
      location: location, // Store location object
      status: req.body.status || 0
    });
    await newPet.save();
    res.status(201).json({ message: 'Missing pet reported successfully!', pet: newPet });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllReports = async (req, res) => {
  let status = req.params.status;
  // if (req.user.role !== 'pet_owner') return res.status(403).json({ message: 'Only pet owners can report missing pets' });
  try {
    let pets = [];
    if(status==2){
      pets = await Pet.find()
      .populate({
          path: 'userId',
          select: 'name email phoneNumber', // Select the fields you need from the User model
        })
      .sort({ dateReported: -1 }).lean();
    }else{
      pets = await Pet.find({status: Number(status)})
      .populate({
          path: 'userId',
          select: 'name email phoneNumber', // Select the fields you need from the User model
        })
      .sort({ dateReported: -1 }).lean();
    }
    res.status(200).json(pets);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};  

// Report a Sighted Pet
// exports.reportSightedPet = async (req, res) => {
//   try {
//     const { name, breed, location, photo } = req.body;
//     const newPet = new Pet({
//       name,
//       breed,
//       photo,
//       status: 'found',
//       location,
//       owner: req.user.id
//     });
//     await newPet.save();
//     res.status(201).json({ message: 'Pet sighting reported successfully', pet: newPet });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// };

// Get All Reported Pets
// exports.getAllPets = async (req, res) => {
//   try {
//     const pets = await Pet.find().populate('owner', 'name email');
//     res.status(200).json(pets);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// };

// Get a Single Pet by ID
// exports.getPetById = async (req, res) => {
//   try {
//     const pet = await Pet.findById(req.params.id).populate('owner', 'name email');
//     if (!pet) return res.status(404).json({ message: 'Pet not found' });
//     res.status(200).json(pet);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// };

// Update Pet Status
// exports.updatePetStatus = async (req, res) => {
//   try {
//     const { status } = req.body;
//     const pet = await Pet.findById(req.params.id);
//     if (!pet) return res.status(404).json({ message: 'Pet not found' });
//     pet.status = status;
//     await pet.save();
//     res.status(200).json({ message: 'Pet status updated successfully', pet });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// };

// Delete Pet Report
// exports.deletePetReport = async (req, res) => {
//   try {
//     await Pet.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: 'Pet report deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// };
