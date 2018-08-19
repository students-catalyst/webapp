var mongoose = require('mongoose');
var Schema = require('../schemas/kursiRusakSchema');

module.exports = mongoose.model('KursiRusak', Schema);