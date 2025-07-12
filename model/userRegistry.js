const mongoose = require('mongoose');

const userSchema = new mongoose.Schema ({
    first_name: {
        type: String,
        required: true,
        trim: true
    },

    last_name: {
        type: String,
        required: true,
        trim: true 
    },

    role: {
        type: String,
        enum: ['Technician', 'Student'],
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        // this regex is assuming gmail.com is valid too (just remove if ever)
        match: /^[a-zA-Z0-9._%+-]+@(dlsu\.edu\.ph|gmail\.com)$/
    },
    password: {
        type: String,
        required: true,
    },
    
    descrption: {
        type: String,
        default: ''
    },

    profile_pic_url: {
        type: String,
        default: '/resources/profile_stock.png'
    },

    lab_reservations: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Lab'
    }]
});

module.exports = mongoose.model('User', userSchema);