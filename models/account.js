var mongoose = require('mongoose');
var Schema = require('../schemas/accountSchema');

module.exports = mongoose.model('Account', Schema);