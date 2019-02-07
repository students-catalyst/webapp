let mongoose = require('mongoose');
let Schema = require('../schemas/mentoringSchema');

module.exports = mongoose.model('Mentoring', Schema);