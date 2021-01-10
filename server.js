const express = require('express');
const helmet=require('helmet');
const bodyParser=require('body-parser');
const app= express();

app.use(bodyParser.urlencoded({extended: true})) ;
app.use(bodyParser.json());
app.use(helmet());

const runServer = (port) => {
    app.listen(port, ()=> {
        console.log(`Rest server is listening at http://localhost:${port}`);
    });
};

module.exports = {
    runServer, app,
};