var mongoose = require('mongoose');
var Schema = require('../schemas/kursiSchema');

module.exports = mongoose.model('Kursi', Schema);