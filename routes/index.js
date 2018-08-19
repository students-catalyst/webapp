var express = require('express');
var passport = require('passport');
var mongoose = require('mongoose');
var Account = require('../models/account');
var BK = require ('../models/bk');
var Kursi = require ('../models/kursi');
var KursiRusak = require ('../models/kursiRusak');
var Pengunjung = require ('../models/pengunjung');
var router = express.Router();


router.get('/', function (req, res) {
  if (req.user) {
    bkCollections = [];
    BK.find({}, function(err, bk) {
      bkCollections = bk;
      res.render('index', { title: "Bioskop Kampus", collections : bkCollections , user : req.user });
    });
  } else {
    res.render('index', { title: "Bioskop Kampus", user : req.user, message : req.body.message });
  }
});

router.get('/addBk', function (req, res) {
  res.render('addBk', { title: "Bioskop Kampus", user : req.user });
});

router.post('/addBk', function (req,res) {
  BK.create({ nama: req.body.nama, tanggal: req.body.tanggal, mulai: req.body.waktuAwal, berakhir: req.body.waktuAkhir, fungs : req.user }, (err,small) => {
    if (err) return console.error(err);   
    res.redirect('/'); 
  });
})

router.get('/showBk/:id', function (req, res) {
  bkCollections = [];
  BK.find({ _id : req.params.id }, function(err, bk) {
    bkCollections = bk;
    res.render('showBk', { title: "Bioskop Kampus", collections : bkCollections[0] , user : req.user });
  });
});

router.get('/book/:id', (req,res) => {  
  BK.findOne({ _id:req.params.id},(err,bk) => {
    res.render('bookBk', { title: "Bioskop Kampus", collections : bk, user : req.user });

  });
});

router.get('/showPendingBook/:id', function (req, res) {
  BK.findOne({ _id : req.params.id }, function(err, bk) {
    Pengunjung.find({ bk : bk, status:"pending" }, function(err, pengunjung) {
      res.render('showPendingBook', { title: "Bioskop Kampus", collections : pengunjung , user : req.user });
    });
  });
});

router.get('/confirmBook/:id', (req,res) => {
  Pengunjung.update({ _id : req.params.id },{$set : { status : "accepted" }},(err,e) => {
  });
});

router.get('/cancelBook/:id', (req,res) => {
  Pengunjung.update({ _id : req.params.id },{$set : { status : "canceled" }},(err,e) => {
    res.redirect('/myBookings/'); 
  });
});

router.get('/visitors/:id', (req, res) => {
  BK.findOne({ _id : req.params.id },(err, bk) => {
    Pengunjung.find({bk : bk }, (err,pengunjung) => {
      res.render('visitors', { title: "Bioskop Kampus", collections : pengunjung , user : req.user });
    })
  });
});

router.get('/kursiRusak/', (req,res) => {  
  KursiRusak.find({}, (err,kursiRusak) => {
    res.render('kursiRusak', { title: "Bioskop Kampus", user : req.user, dataKursiRusak : kursiRusak });
  });
});

router.get('/kursiRusak/:id', (req,res) => {  
  KursiRusak.findOne({ label : req.params.id }, (err,kursiRusak) => {
    if (kursiRusak) {
      KursiRusak.remove({ label: req.params.id }, (err,small) => {
        if (err) return console.error(err);   
        res.redirect('/kursiRusak/'); 
      });
    } else {
      KursiRusak.create({ label: req.params.id }, (err,small) => {
        if (err) return console.error(err);   
        res.redirect('/kursiRusak/'); 
      });
    }
  })
});

router.get('/register', function(req, res) {
    res.render('register', { title: "Bioskop Kampus" });
});

router.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username, email: req.body.email, nik: req.body.nik, role : "user" }), req.body.password, function(err, account) {
        if (err || (req.body.password !== req.body.passwordConfirm)) {
          let message = "Ada kesalahan ketika registrasi";
          return res.render('register', { title: "Bioskop Kampus", message : message, account : account });
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

router.get('/login', function(req, res) {
    res.render('login', {  title: "Bioskop Kampus", user : req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

router.get('/myBookings/', (req, res) => {
  Pengunjung.find({ pendaftar : req.user }, (err,pengunjung) => {
    res.render('myBookings', { title: "Bioskop Kampus", collections : pengunjung , user : req.user });
  })
});


router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

router.get('/populate', function(req, res){
  let row = ["Q","P","O","N","M","L","K","J","I","H","G","F","E","D","C","B","A"];
  let col = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];
  row.forEach((i) => {
    row.forEach((j) => {
      Kursi.create( {label : i+j}, (err,small) => {
        if (err) return console.error(err);
        res.redirect('/');
      });
    });
  });
  
});

module.exports = router;