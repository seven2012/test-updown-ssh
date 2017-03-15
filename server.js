var http = require('http')
var fs = require('fs')
var url = require('url')
var formidable = require('formidable')
var util = require("util")


//console.log(Object.keys(http))
var port = process.env.PORT || 26229;

var server = http.createServer(function(request, response){

  var temp = url.parse(request.url, true)
  var path = temp.pathname
  var query = temp.query

  //从这里开始看，上面不要看

  switch(path){
    case  '/index.html':
      var htmlString = fs.readFileSync('./index.html')
      response.setHeader('Content-Type','text/html')
      response.end(htmlString)		
      break
    case "/upload":
      if (request.method.toLowerCase()=='post') {
           // parse a file upload
        var form =new formidable.IncomingForm();
        form.parse(request,function(err, fields, files){
          response.writeHead(200,{'content-type':'text/html'});
          //response.write('received upload:\n\n');
          
          fs.rename(files.upload.path, process.cwd() + "/upload/" + files.upload.name);
          var strhtml = "<html><head><meta charset='utf-8'/></head><title>下载</title><body>"
          strhtml += strhtml+"<a href='/upload?file="+files.upload.name+"' dowload target='_blank'>"+files.upload.name+"</a></body>";
          response.end(strhtml);
        });
      } else if (request.method.toLowerCase()=='get') {
          console.log(query.file);
          filepath = process.cwd()+"/upload/"+query.file;
          var data = fs.readFileSync(filepath);
          response.setHeader('Content-Type','application/octet-stream');
          response.setHeader('Content-Disposition',"attachment; filename='"+encodeURI(query.file));
          response.end(data);
      }
      break;
     case  '/form.html':
	  var data = fs.readFileSync('./form.html')
      response.setHeader('Content-Type','text/html')
      response.end(data)
      break
    case '/style.css':
      var cssString = fs.readFileSync('./style.css')
      response.setHeader('Content-Type','text/css')
      response.end(cssString)
      break
    case '/main.js':
      var functionName = query.callback
      response.end(functionName + '("my password is yyy")')
      break
    case '/data.json':
      response.setHeader('Content-Type','application/json')
      response.end('{"name":"frank","age":18}')
    default:
      response.end('404')
      break
  }

  // 代码结束，下面不要看
})

server.listen(port)
console.log('监听 26229 成功')
