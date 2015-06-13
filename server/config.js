var path = require('path');
module.exports = {
    server:{
        staticUrl:'/report',
        distFolder:path.resolve(__dirname, '../client/dist'),
        listenPort:8000,
        secret:'REPORT_U'
    },
    db:{
        url:'mongodb://localhost:27017/report'
    },
    security:{
        admins:['lwadmin@163.com']
    },
    mail:{
        host:'smtp.163.com',
        port:465,
        secure:true,
        auth:{
            user:'llwwtest2@163.com',
            pass:'qrkleqszhqbxpipq'
        }
    }
};