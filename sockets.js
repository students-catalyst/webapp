const socketio = require('socket.io');
const Account = require('./models/account');
const BK = require ('./models/bk');
const Kursi = require ('./models/kursi');
const KursiRusak = require ('./models/kursiRusak');
const Pengunjung = require ('./models/pengunjung');

let bks = [];

exports.socketServer = (app, server) => {
    const io = socketio.listen(server);
  
    io.sockets.on('connection', function(socket){

        Pengunjung.find({}, (err,data) => {
            io.sockets.emit('bookedData', data);
        });
        KursiRusak.find({}, (err,kursiRusak) => {
            io.sockets.emit('dataKursiRusak', kursiRusak);
        });
        io.sockets.emit('pendings',bks);        
        socket.on('disconnect', function(){
            console.log('user disconnected');
        });
        socket.on('tambahBk', function(payload){
            bks.push(payload);
        });
        socket.on('tambahKursiPending', function(payload){
            bks.forEach((bk) => {
                if (bk.idBk === payload.idBk) {
                    bk.kursi.push(payload.idKursi);
                }            
            });        
            io.sockets.emit('pendings', bks);
        });
        socket.on('hapusKursiPending', (payload) => {
            bks.forEach((bk) => {
                if (bk.idBk === payload.idBk) {
                    let index = 0;
                    bk.kursi.forEach((kursi) => {
                        if (kursi === payload.idKursi) {
                            bk.kursi.splice(index);
                        }
                        index++;
                    });
                }         
            });        
            io.sockets.emit('pendings', bks);
        });
        socket.on('bookKursi',(payload) => {
            console.log("payload");
            console.log(payload);
            let booker;
            let bookedBk;
            let bookedKursi;
            Account.findOne({ _id : payload.pendaftar }, function(err, pendaftar) {
                booker = pendaftar;
                BK.findOne({ _id : payload.bk }, function(err, bk) {
                    bookedBk = bk;
                    Kursi.findOne({ label : payload.kursi }, function(err, kursi) {
                        bookedKursi = kursi;
                        let pengunjungPayload = {
                            pendaftar: booker,
                            bk : bookedBk,
                            kursi : bookedKursi,
                            nama : payload.nama,
                            lembaga : payload.lembaga,
                            email : payload.email,
                            hp : payload.hp,
                            info : payload.info
                        }
                        if (booker.role === "user") {
                            pengunjungPayload.status = "pending";
                        } else {
                            pengunjungPayload.status = "accepted";
                        }
                        Pengunjung.create(pengunjungPayload, (err,small) => {
                            if (err) return console.error(err);                               
                            Pengunjung.find({ }, (err,data) => {
                                KursiRusak.find({}, (err,kursiRusak) => {
                                    io.sockets.emit('dataKursiRusak', kursiRusak);
                                });
                                io.sockets.emit('bookedData', data);                                
                            });
                        });
                    });
                });
            });
        });
    });
  };
