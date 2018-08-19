var mongoose = require('mongoose');
var Schema = require('../schemas/pengunjungSchema');

module.exports = mongoose.model('Pengunjung', Schema);