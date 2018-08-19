const moment = require('moment-timezone');
var Pengunjung = require ('../models/pengunjung');

module.exports = () => {    
    Pengunjung.find({}, (err,pengunjungs) => {
        
        pengunjungs.forEach((pengunjung) => {
            if (pengunjung.status === "pending") {
                if (moment().tz('Asia/Jakarta').diff(moment(pengunjung.bk.tanggal).tz('Asia/Jakarta'), 'minutes') >= 15) {                    
                    Pengunjung.update({ bk : pengunjung.bk, status: "pending" }, {$set : {status : "canceled"}} , (err,e) => {
                    });
                }
            }
        });
    });

}