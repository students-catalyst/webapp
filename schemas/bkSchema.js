const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Account = require('./accountSchema');

var BK = new Schema({
    nama: String,
    tanggal: String,
    mulai: String,
    berakhir : String,
    fungs: Account
});

module.exports = BK;