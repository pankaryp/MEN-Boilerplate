// Require the db model (mongoose)
var mongoose = require('mongoose');

// Model Schema
var modelSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    }
});

// Export the model
var modelSchema = module.exports = mongoose.model('Model', modelSchema);