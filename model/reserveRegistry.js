const mongoose = require('mongoose');

const reserveSchema = new mongoose.Schema({
    lab_name: {
        type: String, 
        required: true
    },

    lab_description: {
        type: String,
        required: true
    },

    lab_sched: {
        type: Date
    },

    seat_num: {
        type: Number
    },

    lab_url: {
        type: String
    },
});

module.exports = mongoose.model('Reservations', reserveSchema);