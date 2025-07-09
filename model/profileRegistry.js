const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    user_attribs: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },

    profile_pic_url: {
        type: String,
        default: '/public/resources/profile_stock.png'
    },

    lab_reservations: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Lab', 
        required: true 
    }]
});

module.exports = mongoose.model('Profile', profileSchema);