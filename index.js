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
        var pluginConfig = settings.ep_mailexport || {};
        var transportOptions = pluginConfig.config;
        var contentOptions = pluginConfig.email;

        var sendMail = function(txt) {
            var transporter = nodemailer.createTransport(transportOptions);

            var content = {
                subject: padID,
                text: txt
            };

            for (var attrname in contentOptions) {
                content[attrname] = contentOptions[attrname];
            }
             
            // send mail with defined transport object 
            transporter.sendMail(content, function(error, info){
                if(error){
                    return console.log(info+"\n"+error);
                }
            });
        };

        exportTxt.getPadTXTDocument(padID, req.params.rev, false, function(err, txt)
        {
            if(pluginConfig){
                sendMail(txt);
            }
        });
    });
};
