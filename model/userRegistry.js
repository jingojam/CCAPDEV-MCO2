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
        enum: ['TECHNICIAN', 'STUDENT'],
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,

        match: /^[a-zA-Z0-9._%+-]+@(dlsu\.edu\.ph)$/
    },
    password: {
        type: String,
        required: true,
    },
    
    description: {
        type: String,
        default: 'Describe yourself!'
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