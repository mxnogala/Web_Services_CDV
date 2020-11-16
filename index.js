const express = require('express');
const helmet=require('helmet');
var bodyParser=require('body-parser');
const app= express();
const port=3000;

app.use(helmet());

app.get('/', (req, res)=> {
    res.send('Hello World!')
})

app.listen(port, ()=> {
    console.log(`Example app listening at http`)
})

app.post('/soap', function(req,res) {
    res.send('SOAP response')
})

app.post('/rest', function(req,res) {
    res.send('REST response')
})

app.unsubscribe(bodyParser.urlencoded({extended: false})) ;
app.use(bodyParser.json())

app.use(function(req,res) {
    res.setHeader('Content-Type', 'text/plain');
    res.write('you posted: \n');
    res.end(JSON.stringify(req.body, null,2)) ;
})

