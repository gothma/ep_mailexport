var eejs = require('ep_etherpad-lite/node/eejs');

exports.eejsBlock_exportColumn = function(hook_name, args, cb){
    args.content = args.content + eejs.require("ep_sendmail/templates/exportcolumn.ejs", {}, module);
  return cb();
}

exports.eejsBlock_scripts = function (hook_name, args, cb) {
    args.content = args.content + eejs.require("ep_sendmail/templates/scripts.html", {}, module);
    return cb();
};

exports.expressCreateServer = function (hook_name, args, cb) {
    args.app.get('/p/:pad/:rev?/export/mail', function(req, res, next) {
        var padID = req.params.pad;
        console.log(padID);
    });
};
