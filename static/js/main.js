$(document).ready(function (){
    console.log('test')
    var pad_root_path = new RegExp(/.*\/p\/[^\/]+/).exec(document.location.pathname)
    var pad_root_url = document.location.href.replace(document.location.pathname, pad_root_path)
    $("#exportmaila").attr("href", pad_root_path + "/export/mail");
});
