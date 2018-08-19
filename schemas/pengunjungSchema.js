const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Account = require('./accountSchema');
const BK = require('./bkSchema');
const Kursi = require('./kursiSchema');

var Pengunjung = new Schema({
    pendaftar: Account,
    bk: BK,
    kursi: Kursi,
    nama: String,
    lembaga: String,
    email: String,
    hp: String,
    info: String,
    status: String,
});

module.exports = Pengunjung;