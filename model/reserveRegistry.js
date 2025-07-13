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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    belongsTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    requestDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Reservation', reserveSchema);