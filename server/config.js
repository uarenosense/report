var path = require('path');
module.exports = {
    server:{
        staticUrl:'/static',
        distFolder:path.resolve(__dirname, '../client/src'),
        listenPort:8000,
        secret:'REPORT_U'
    },
    db:{
        url:'mongodb://localhost:27017/report'
    },
    security:{
        admins:['liwei']
    }
};