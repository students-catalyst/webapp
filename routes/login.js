const express = require('express');
const session = require('express-session');
const router = express.Router();

const users = [
  {id: '2f24vvg', email: 'test@test.com', password: 'password', role: 'admin', name: 'test'}
]

router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('./')
  } else {
    res.render('login', { title: 'Bioskop Kampus Itb' });
  }
});

router.post('/', (req, res,next) => {
  console.log('Inside POST /login callback function')
  console.log(req.body)
  passport.authenticate('local', (err,user,info) => {
      console.log('Inside passport.authenticate() callback');
      console.log(`req.session.passpor : ${JSON.stringify(req.session.passport)}`)
      console.log(`req.user : ${JSON.stringify(req.user)}`);
      req.login(user, (err) => {
          console.log('Inside req.login() callback');
          console.log(`req.session.passpor : ${JSON.stringify(req.session.passport)}`)
          console.log(`req.user : ${JSON.stringify(req.user)}`);
          return res.redirect('/');
      });
  })(req,res,next);
})

module.exports = router;
