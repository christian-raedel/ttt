var express = require('express')
    , app = express();

app.use(express.static(__dirname + '/public'));
app.listen(process.argv['port'] || 3000);
