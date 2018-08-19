const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const Account = new Schema({
    username: String,
    password: String,
    email : String,
    nik : String,
    role: String
});

Account.plugin(passportLocalMongoose);

module.exports = Account;