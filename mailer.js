var nodemailer = require('nodemailer');

exports.sendMail = function(transport, content) {
    console.log('Print')
    var transporter = nodemailer.createTransport(transport);
     
    // send mail with defined transport object 
    transporter.sendMail(content, function(error, info){
        if(error){
            return console.log(error);
        }
    });
}