const express = require('express');
const app = express();

app.use(express.static('dist'));

app.get('/', function (req, res) {
   res.send('Hello World');
})

const server = app.listen(8080, function () {
   const host = server.address().address
   const port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)
});
