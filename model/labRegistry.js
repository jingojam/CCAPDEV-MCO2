const mongoose = require('mongoose');

const labSchema = new mongoose.Schema({
    lab_name: {
        type: String, 
        required: true
    },

    lab_sched: {
        type: Date
    },

    lab_url: {
        type: String
    },

    seats: [{
        seat_num: {
            type: Number,
            required: true
        },
        
        availability: {
            type: Boolean,// (true for available, false otherwise)
            default: true
        },

        reservee: {
            name: String
        }
    }],
});

module.exports = mongoose.model('Lab', labSchema);