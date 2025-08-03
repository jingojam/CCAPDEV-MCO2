const mongoose = require('mongoose');

const errorSchema = new mongoose.Schema({

    timestamp: { type: Date, default: Date.now },
    
    error: { type: String, required: true },
    
    stack: { type: String },
    
    route: { type: String },

    user: { type: String },

});

module.exports = mongoose.model('Error', errorSchema);