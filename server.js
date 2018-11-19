var express = require('express'); //routing
var app = express();
var bodyParser = require('body-parser'); //response body parsing

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json()); //parse json

var port = process.env.PORT || 3000;

var routes = require('./api/routes/dataRoutes');
routes(app);

app.post("/test", function(request, response) {
  console.log(request.body);
  response.status(200).send(request.body);
});

app.listen(port);

// console.log('DATA TEST RESTful API server started on: ' + port);
