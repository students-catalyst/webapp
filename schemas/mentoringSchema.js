const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Account = require('./accountSchema');

const Mentoring = new Schema({
    tanggalRequest: String,
    waktuRequest: String,
    tanggalMentoring: String,
    waktuMentoringAwal: String,
    pemohon: Account,
    mentor: Account,
    status: Number,
});

module.exports = Mentoring;