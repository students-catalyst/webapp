const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Kursi = new Schema({
    label: String,
});

module.exports = Kursi;