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
  if ((!req.user) || (req.user.role !== "admin")) {
    res.redirect('/login'); 
  } else {
    res.render('addBk', { title: "Bioskop Kampus", user : req.user });
  }
});

router.post('/addBk', function (req,res) {
  if ((!req.user) || (req.user.role !== "admin")) {
    res.redirect('/login'); 
  } else {
    BK.create({ nama: req.body.nama, tanggal: req.body.tanggal, mulai: req.body.waktuAwal, berakhir: req.body.waktuAkhir, fungs : req.user }, (err,small) => {
      if (err) return console.error(err);   
      res.redirect('/'); 
    });
  }
})

router.get('/showBk/:id', function (req, res) {
  if (!req.user) {
    res.redirect('/login'); 
  } else {
    bkCollections = [];
    BK.find({ _id : req.params.id }, function(err, bk) {
      bkCollections = bk;
      res.render('showBk', { title: "Bioskop Kampus", collections : bkCollections[0] , user : req.user });
    });
  }
});

router.get('/book/:id', (req,res) => {  
  if (!req.user) {
    res.redirect('/login'); 
  } else {
    BK.findOne({ _id:req.params.id},(err,bk) => {
      res.render('bookBk', { title: "Bioskop Kampus", collections : bk, user : req.user });
    });
  }
});

router.get('/showPendingBook/:id', function (req, res) {
  if ((!req.user) || (req.user.role !== "admin") || (req.user.role !== "registrar")) {
    res.redirect('/login'); 
  } else {
    BK.findOne({ _id : req.params.id }, function(err, bk) {
      Pengunjung.find({ bk : bk, status:"pending" }, function(err, pengunjung) {
        res.render('showPendingBook', { title: "Bioskop Kampus", collections : pengunjung , user : req.user });
      });
    });
  }
});

router.get('/confirmBook/:id', (req,res) => {
  if ((!req.user) || (req.user.role !== "admin")|| (req.user.role !== "registrar")) {
    res.redirect('/login'); 
  } else {
    Pengunjung.update({ _id : req.params.id },{$set : { status : "accepted" }},(err,e) => {});
  }
});

router.get('/cancelBook/:id', (req,res) => {
  if (!req.user) {
    res.redirect('/login'); 
  } else {
    Pengunjung.update({ _id : req.params.id },{$set : { status : "canceled" }},(err,e) => {
      res.redirect('/myBookings/'); 
    });
  }
});

router.get('/visitors/:id', (req, res) => {
  if ((!req.user) || (req.user.role !== "admin") || (req.user.role !== "registrar")) {
    res.redirect('/login'); 
  } else {
    BK.findOne({ _id : req.params.id },(err, bk) => {
      Pengunjung.find({bk : bk }, (err,pengunjung) => {
        res.render('visitors', { title: "Bioskop Kampus", collections : pengunjung , user : req.user });
      })
    });
  }
});

router.get('/kursiRusak/', (req,res) => {  
  if ((!req.user) || (req.user.role !== "admin")) {
    res.redirect('/login'); 
  } else {
    KursiRusak.find({}, (err,kursiRusak) => {
      res.render('kursiRusak', { title: "Bioskop Kampus", user : req.user, dataKursiRusak : kursiRusak });
    });
  }
});

router.get('/kursiRusak/:id', (req,res) => {  
  if ((!req.user) || (req.user.role !== "admin")) {
    res.redirect('/login'); 
  } else {
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
  }
});

router.get('/register', function(req, res) {
    res.render('register', { title: "Bioskop Kampus" });
});

router.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username, email: req.body.email, nik: req.body.nik, role : "user" }), req.body.password, function(err, account) {
        if (err || (req.body.password !== req.body.passwordConfirm) || (req.body.nik.length !== 16)|| (req.body.nik.search(/[^a-zA-Z]+/) !== -1)) {
          let message = "";
          if (req.body.nik.length !== 16) {
            message = message.concat("Panjang NIK harus 16 digit!\n");
          }
          if (req.body.password !== req.body.passwordConfirm) {
            message = message.concat("Password dan konfirmasinya harus sesuai\n");
          }
          if (req.body.nik.search(/[^a-zA-Z]+/) !== -1) {
            message = message.concat("NIK hanya diisi angka!\n");
          }
          message = message.concat(err + "\n");        
          


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
  if (!req.user) {
    res.redirect('/login'); 
  } else {
    Pengunjung.find({ pendaftar : req.user }, (err,pengunjung) => {
      res.render('myBookings', { title: "Bioskop Kampus", collections : pengunjung , user : req.user });
    })
  }
});


router.get('/logout', function(req, res) {
  if (!req.user) {
    res.redirect('/login'); 
  } else {
    req.logout();
    res.redirect('/');
  }
});

router.get('/populate', function(req, res){
  if ((!req.user) || (req.user.role !== "admin")) {
    res.redirect('/login'); 
  } else {
    let row = ["Q","P","O","N","M","L","K","J","I","H","G","F","E","D","C","B","A"];
    let col = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];
    row.forEach((i) => {
      col.forEach((j) => {
        Kursi.create( {label : i+j}, (err,small) => {
          if (err) return console.error(err);
        });
      });
    });
    res.redirect('/');    
  }
});

module.exports = router;