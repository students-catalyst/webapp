var mongoose = require('mongoose');
var Schema = require('../schemas/bkSchema');

module.exports = mongoose.model('BK', Schema);