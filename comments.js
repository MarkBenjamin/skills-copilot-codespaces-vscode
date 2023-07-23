// create a simple web server
// use the http module
const http = require('http');
// use the url module
const url = require('url');
// use the querystring module
const qs = require('querystring');
// use the fs module
const fs = require('fs');

// create a server
http.createServer(function (req, res) {
  // get the url
  const urlParts = url.parse(req.url, true);
  // get the pathname
  const path = urlParts.pathname;
  // get the query
  const query = urlParts.query;
  // content header
  res.writeHead(200, {'Content-Type': 'text/plain'});

  // if the path is '/comment'
  if (path === '/comment') {
    // if the request is a POST request
    if (req.method === 'POST') {
      // create a string to hold the data
      let body = '';
      // when the request receives data
      req.on('data', function (data) {
        // append the data
        body += data;
      });
      // when the request is done receiving data
      req.on('end', function () {
        // parse the body
        const comment = qs.parse(body);
        // get the comment
        const commentText = comment.comment;
        // append the comment to the file
        fs.appendFile('comments.txt', commentText + '\n', function (err) {
          // if there is an error
          if (err) {
            // throw the error
            throw err;
          }
          // log a message
          console.log('Comment saved!');
          // read the file
          fs.readFile('comments.txt', function (err, data) {
            // if there is an error
            if (err) {
              // throw the error
              throw err;
            }
            // convert the data to a string
            const commentList = data.toString();
            // write the response
            res.end(commentList);
          });
        });
      });
    }
  }
}).listen(3000);

// log message to console
console.log('Server running at http://localhost:3000/comments');
