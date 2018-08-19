const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const KursiRusak = new Schema({
    label: String,
});

module.exports = KursiRusak;