var eejs = require('ep_etherpad-lite/node/eejs');

exports.eejsBlock_exportColumn = function(hook_name, args, cb){
    args.content = args.content + eejs.require("ep_sendmail/templates/exportcolumn.ejs", {}, module);
  return cb();
}
