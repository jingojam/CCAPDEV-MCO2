const mongoose = require('mongoose');

const reserveSchema = new mongoose.Schema({
    lab_name: {
        type: String, 
        required: true
    },

    lab_sched: {
        type: Date //just the mm/dd/yy
    },

    lab_url: {
        type: String
    },

    startTime: {
        type: String,
        required: true
    },

    endTime: {
        type: String,
        required: true
    },

    seat: {
        type: Number,
        required: true
    },

    reservedBy: {
        type: String,
        ref: 'User',
        required: true
    },

    belongsTo: {
        type: String,
        ref: 'User',
        required: true
    },
    
    requestDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Reservations', reserveSchema);