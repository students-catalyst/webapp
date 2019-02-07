const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const Account = new Schema({
    username: String,
    fullname: String,
    password: String,
    email : String,
    role: String
});

Account.plugin(passportLocalMongoose);

module.exports = Account;