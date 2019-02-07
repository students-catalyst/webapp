var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
let Mentoring = require('../models/mentoring');
var router = express.Router();
var nodemailer = require('nodemailer');
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
const homeUrl = (process.env.homeUrl || 'http://localhost:8080');
const {google} = require('googleapis');

cloudinary.config({
  cloud_name: 'djpvro5sh',
  api_key: '791419568376272',
  api_secret: 'Wy8CCQN8rre2XtxpiJh9I3Yja2Q'
});
const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  filename: function (req, file, cb) {
    cb(undefined, req.user._id);
  },
  folder: "profpic",
  allowedFormats: ["jpg", "png"],
  transformation: [{ grafity: "face", width: 100, height: 100, crop: "thumb" }],
  format:"png",
  });

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mahdiarnaufal@gmail.com',
    pass: 'mahdiarnaufal13'
  }
});

router.get('/member', function (req, res) {
  if (req.user) {
    res.render('member', { title: "StudentsCatalyst - Member Area", user : req.user });
  } else {
    res.render('member', { title: "StudentsCatalyst - Member Area", user : req.user, message : req.body.message });
  }
});

router.get('/register', function(req, res) {
    res.render('register', { title: "StudentsCatalyst" });
});

router.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username, email: req.body.email, nik: req.body.nik, role : "user" }), req.body.password, function(err, account) {
      let message = "";
      if (err || (req.body.password !== req.body.passwordConfirm)) {
        if (req.body.password !== req.body.passwordConfirm) {
          message = message.concat("Password dan konfirmasinya harus sesuai\n");
        }
        message = message.concat(err + "\n");        

        return res.render('register', { title: "StudentsCatalyst", message : message, account : account });
      }
      if (message.length === 0) {
        passport.authenticate('local')(req, res, function () {
            res.redirect('/member');
        });
      }
    });
});

router.get('/login', function(req, res) {
    res.render('login', {  title: "StudentsCatalyst", user : req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/member');
});

router.get('/logout', function(req, res) {
  if (!req.user) {
    res.redirect('/login'); 
  } else {
    req.logout();
    res.redirect('/member');
  }
});

router.get('/mentorship', function(req, res) {
  if (!req.user) {
    res.redirect('/login'); 
  } else {
    Account.find({ role : "mentor" }, (err,mentors) => {
      if (typeof req.query.success !== 'undefined') {
        res.render('mentorship', { title: "Mentorship", user : req.user, message : req.body.message, collections : mentors, success : req.query.success });
      } else {
        res.render('mentorship', { title: "Mentorship", user : req.user, message : req.body.message, collections : mentors});
      }
    });    
  }
});


router.get('/profile/edit', function (req, res) {
  if (!req.user) {
    res.redirect('/login'); 
  } else {
    res.render('edit_profile', { title: "Edit Profile", user : req.user, message : req.body.message }); 
  }
});

router.post('/profile/edit', (req, res) => {
  if (!req.user) {
    res.redirect('/login'); 
  } else {
    cloudinary.v2.uploader.upload(req.files.path,
      {public_id: req.user._id, invalidate: true},
      function(error, result){console.log(result, error)});
    console.log(req.file) // to see what is returned to you
    
    res.redirect('/profile'); 
  }
      
    });

router.get('/profile', function (req, res) {
  if (!req.user) {
    res.redirect('/login'); 
  } else {
    res.render('profile', { title: "Profile", user : req.user, message : req.body.message }); 
  }
});


router.post('/request/:id', function(req, res) {
  if (!req.user) {
    res.redirect('/login'); 
  } else {
    let date = new Date();
    let currentDate = date.getDate();
    let currentMonth = date.getMonth()+1;
    let currentYear = date.getFullYear();
    let currentHours = date.getHours();
    let currentMinutes = date.getMinutes();
    let currentSeconds = date.getSeconds();
    Account.findOne({ _id : req.params.id },(err,mentor) => {
      if (err) {
        
      } else {
        Mentoring.create({
          tanggalRequest: currentDate + '-' + currentMonth + '-' + currentYear, 
          waktuRequest: currentHours+':'+currentMinutes+':'+currentSeconds,
          tanggalMentoring: req.body.tanggal,
          waktuMentoringAwal: req.body.waktuAwal,
          pemohon : req.user,
          mentor : mentor,
          status : 0,
        }, (err,mentoring) => {
          if (err) {

          } else {
            let html = `Ada request mentoring dari ${req.user.name} pada tanggal ${req.body.tanggal}, Pukul ${req.body.waktuAwal}. Apakah anda bersedia?<br><a href="${homeUrl}/request/accept/${mentoring._id}">Ya</a> | <a href="${homeUrl}/request/deny/${mentoring._id}">Tidak</a>`
            let mailOptions = {
              from: 'mahdiarnaufal@gmail.com',
              to: 'diarn_7@live.com',
              subject: 'Ada request mentoring!',
              html: html,
            };
            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                res.redirect('/mentorship/?success=false'); 
              } else {
                res.redirect('/mentorship/?success=true'); 
              }
            }); 
          }
        });        
      }
    });    
    
  }
});

router.get('/request/accept/:id',(req,res) => {  
  Mentoring.findOneAndUpdate({ _id:req.params.id, status:0}, { $set: { status: 1 }}, { new: true }, (err, mentoring) => {
    if (err) {
      res.render('mentoring_request_not_found', { title: "Students Catalyst", collection : mentoring}); 
    } else {
      res.render('accept', { title: "Students Catalyst", collection : mentoring}); 
    }
  });
  Mentoring.findById(req.params.id,(err,mentor) => {
    const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];

    let privatekey = require("../privatekey.json");
    // configure a JWT auth client
    let jwtClient = new google.auth.JWT(
        privatekey.client_email,
        null,
        privatekey.private_key,
        SCOPES);
    //authenticate request
    jwtClient.authorize(function (err, tokens) {
    if (err) {
    console.log(err);
    return;
    } else {
    console.log("Successfully connected!");
    }
    });

    let jamMentoringAkhir = parseInt(mentor.waktuMentoringAwal.substring(0,2),10) + 1;
    let menitMentoringAkhir = parseInt(mentor.waktuMentoringAwal.substring(3,5),10);
    if (menitMentoringAkhir === 0) {
      menitMentoringAkhir = '00';
    }
    let event = {
      'summary': 'Mentoring',
      'description': 'Mentoring bersama '+mentor.mentor.fullname,
      'start': {
        'dateTime': mentor.tanggalMentoring + 'T' + mentor.waktuMentoringAwal + ':00+07:00',
        'timeZone': 'Asia/Jakarta'
      },
      'end': {
        'dateTime': mentor.tanggalMentoring + 'T' + jamMentoringAkhir + ':' + menitMentoringAkhir + ':00+07:00',
        'timeZone': 'Asia/Jakarta'
      },
      'attendees': [
        {'email': mentor.mentor.email},
        {'email': mentor.pemohon.email},
      ],
      'reminders': {
        'useDefault': false,
        'overrides': [
          {'method': 'email', 'minutes': 24 * 60},
          {'method': 'popup', 'minutes': 10},
        ],
      },
    };
  
  
    if (err) {

    } else {
      let calendar = google.calendar('v3');
      calendar.events.insert({
        auth: jwtClient,
        calendarId: 'primary',
        resource: event,
      }, (err, event) => {

        if (err) {

        }
      });
    }
    
  })
});

router.get('/request/deny/:id',(req,res) => {  
  Mentoring.findOneAndUpdate({ _id:req.params.id, status:0}, { $set: { status: -1 }}, { new: true }, (err, mentoring) => {
    if (err) {
      res.render('mentoring_request_not_found', { title: "Students Catalyst", collection : mentoring}); 
    } else {
      res.render('deny', { title: "Students Catalyst", collection : mentoring}); 
    }
  });
});

router.get('/request/abort/:id',(req,res) => {  
  Mentoring.findByIdAndDelete(req.params.id, (err, mentoring) => {
    if (err) {
      res.redirect('/requests/?abort=false'); 
    } else {
      res.redirect('/requests/?abort=true'); 
    }
  });
});

router.get('/requests', function(req, res) {
  if (!req.user) {
    res.redirect('/login'); 
  } else {
    Mentoring.find({ pemohon : req.user },(err,mentorings) => {
      if (err) {
        
      } else {
        if (typeof req.query.abort !== 'undefined') {
          res.render('requests', { title: "Riwayat Mentoring", user : req.user, message : req.body.message, collections:mentorings, abort:req.query.abort }); 
        } else {
          res.render('requests', { title: "Riwayat Mentoring", user : req.user, message : req.body.message, collections:mentorings }); 
        }        
      }
    });    
  }
});

router.get('/', (req,res) => {
  res.render('home');
});
module.exports = router;