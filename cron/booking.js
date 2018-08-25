const moment = require('moment-timezone');
var Pengunjung = require ('../models/pengunjung');
var BK = require ('../models/bk');

module.exports = () => {    
    BK.find({tanggal: moment().tz('Asia/Jakarta').format('YYYY-MM-DD')}, (err,bks) => {
        bks.forEach((bk) => {
            Pengunjung.find({}, (err,pengunjungs) => {        
                pengunjungs.forEach((pengunjung) => {
                    if (pengunjung.status === "pending") {
                        if (moment().tz('Asia/Jakarta').diff(moment(bk.mulai, "HH:mm").tz('Asia/Jakarta'), 'minutes') >= 15) {                    
                            Pengunjung.update({ bk : pengunjung.bk, status: "pending" }, {$set : {status : "canceled"}} , (err,e) => {
                            });
                        }
                    }
                });
            });
        });
    });

}