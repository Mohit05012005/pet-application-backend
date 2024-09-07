const mongoose = require('mongoose');

const petSchema = mongoose.Schema({
    PetName : {
        type: String,
        required : [true,"pet name is required field"],
        trim: true
    },
    OwnerName:{
        type: String,
        required: [true,"owner's name is required field."],
        trim: true,
        unique: [true,"owner's name should be unique."]
    },
    Species: {
        type: String,
        required: [true,"owner's name is required field."],
        trim: true  
    },
    PetAge: {
        type: Number,
        required : true
    },
    Licence: {
        type: String,
        required: false
    },
    PetImg : {
        type : String,
        required: [true,"image of pet is required field"]
    },
    Address: {
        type: String,
        required : true
    },
    PhoneNumber: {
        type: Number,
        required : true,
        unique: true
    },
    mailAddress : {
        type: String,
        required: true,
        unique: true
    },
    petDescription: {
        type: String,
        required: true
    }
})

const pet_model = mongoose.model('pets_new',petSchema);

module.exports = pet_model;