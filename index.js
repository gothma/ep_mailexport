var eejs = require('ep_etherpad-lite/node/eejs');
var nodemailer = require('nodemailer');
var settings = require('ep_etherpad-lite/node/utils/Settings');
var exportTxt = require('ep_etherpad-lite/node/utils/ExportTxt')

exports.eejsBlock_exportColumn = function(hook_name, args, cb){
    args.content = args.content + eejs.require("ep_mailexport/templates/exportcolumn.ejs", {}, module);
  return cb();
}

exports.eejsBlock_scripts = function (hook_name, args, cb) {
    args.content = args.content + eejs.require("ep_mailexport/templates/scripts.ejs", {}, module);
    return cb();
};

exports.expressCreateServer = function (hook_name, args, cb) {
    args.app.get('/p/:pad/:rev?/export/mail', function(req, res, next) {
        var padID = req.params.pad;
        var emailOptions = (settings.ep_mailexport || {}).config;
        var txt = "";

        var sendMail = function(txt) {
            var transporter = nodemailer.createTransport(emailOptions);

            // setup e-mail data with unicode symbols 
            var mailOptions = {
                from: 'Fred Foo <martin@goth-1.de>', // sender address 
                to: ['ep-sendmail@ziisch.de'], // list of receivers 
                subject: 'Pad ' + padID, // Subject line 
                text: txt
            };
             
            // send mail with defined transport object 
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    return console.log(info+"\n"+error);
                }
            });
        };

        exportTxt.getPadTXTDocument(padID, req.params.rev, false, function(err, _txt)
        {
            txt = _txt;
            if(emailOptions){
                sendMail(txt);
            }
        });
    });
};
