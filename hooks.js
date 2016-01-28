var eejs = require('ep_etherpad-lite/node/eejs');
var hasPadAccess = require("ep_etherpad-lite/node/padaccess");
var settings = require('ep_etherpad-lite/node/utils/Settings');
var exportTxt = require('ep_etherpad-lite/node/utils/ExportTxt')
var mailer = require('ep_mailexport/mailer')

// Hook export button
exports.eejsBlock_exportColumn = function(hook_name, args, cb){
    args.content = args.content + eejs.require("ep_mailexport/templates/exportcolumn.ejs", {}, module);
  return cb();
}

// Hook script to insert export link
exports.eejsBlock_scripts = function (hook_name, args, cb) {
    args.content = args.content + eejs.require("ep_mailexport/templates/scripts.ejs", {}, module);
    return cb();
};

// Hook export handler for mail sending
exports.expressCreateServer = function (hook_name, args, cb) {
    args.app.get('/p/:pad/:rev?/export/mail', function(req, res, next) {
        var padID = req.params.pad;
        var pluginConfig = settings.ep_mailexport;
        if (pluginConfig == null) {
            res.send("ep_mailexport is not configured in settings.json");
            return
        }

        // Load settings
        var transportOptions = pluginConfig.config;
        var contentOptions = pluginConfig.email;

        // Fetch pad text
        exportTxt.getPadTXTDocument(padID, req.params.rev, false, function(err, txt)
        {
            var content = {
                subject: padID,
                text: txt
            };

            // Merge settings with pad content
            for (var attrname in contentOptions) {
                content[attrname] = contentOptions[attrname];
            }

            // Send mail
            hasPadAccess(req, res, function() {
                mailer.sendMail(transportOptions, content);
                res.send('Mail sent');
            });
        });
    });
};
