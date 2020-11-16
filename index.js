const express = require('express');
const helmet=require('helmet');
var bodyParser=require('body-parser');
const app= express();
const port=3000;
const yup=require('yup');
const formidable = require('formidable');
const fs = require('fs');
const { nextTick } = require('process');
var jwt = require('jsonwebtoken');
var stored_data=[];
app.use(bodyParser.urlencoded({extended: true})) ;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(helmet());

app.get('/', (req, res)=> {
    res.send('Hello World!')
})

app.listen(port, ()=> {
    console.log(`Example app listening at http`);
})

app.post('/soap', (req,res)=> {
    res.send('SOAP response');
})

app.post('/rest', (req,res)=> {
    res.send('REST response');
})

//1
app.get('/info', (req,res)=> {
    var author=require('./package.json');
    res.json({'author':author.author});
    res.status(200); 

})

//2
app.get('/hello/:name', (req,res)=> {
    var name=req.params.name;
    let schema=yup.string().max(10).matches(/^[a-zA-Z]+$/);
    if (schema.isValidSync(name))
    {
        res.status(200);
        res.send('Hello '+name+'!');
    }
    else 
    {
        res.status(400);
        res.send('Podane dane nie są poprawne.');
    }
})

//3
app.post('/store', (req,res)=> {
    stored_data.push(req.body.input);
    res.json({'Stored data': stored_data});
    res.status(201);

})

//4
app.post('/parse', (req,res)=>{
    const form = formidable({ multiples: true }); 
    var toJson="{\"";
    var isOpen=false;
    form.parse(req,(err,fields, files)=> {
        
        var path=files.toParse.path;
        console.log(path);
        fs.readFile(path, (err, data) => {
            if (err) throw err;
            text=data.toString();
           for (let i=0; i<text.length; i++)
           {
               if (text[i]==":")
               {
                    toJson+="\":";
                    let isNumberTmp=parseInt(text[i+1]);
                    let isNumber=isNaN(isNumberTmp);
                   if (isNumber)
                   {
                       toJson+="{\"";
                       isOpen=true;
                   }
                    
               }
               else if (text[i]==";")
               {
                   if(isOpen)
                   {
                       toJson+="}";
                       isOpen=false;
                   }
                   toJson+=",\"";
               }
               else if (text[i]==",")
               {
                   toJson+=",\"";
               }
               else {
                   toJson+=text[i];
               }
           }
           if(isOpen)
               {
                   toJson+="}";
               }
            toJson+="}";
            toJson.trim();
      
           console.log(toJson);
            res.json(JSON.parse(toJson));
            res.status(200);
          });
    })
  })

  //5
app.get('/login', (req,res)=>{
    var login='login';
    var password='hasło';
    var token=jwt.sign({secret:'testSecret', login}, 'tokenInfo');

    if (req.body.login!=login || req.body.password!=password)
    {
        res.status(401);
        res.send("Niepoprawne dane."); 
    }
    else {
    res.send(token);
    var decoded=jwt.verify(token, 'tokenInfo');
    console.log(decoded);
    }
})


//6
app.get('/profile', (req,res)=> {

    let token = req.headers.authorization;
    token=token.slice(7);
    var decoded=jwt.decode(token);
    var login="test";
    if (decoded.login==login)
    {
        res.json({"login":decoded.login});
    }
    else {
        res.status(401);
        res.send("Niepoprawny token.");
        }
    
    
})


// app.use(function(req,res) {
//     res.setHeader('Content-Type', 'text/plain');
//     res.write('you posted: \n');
//     res.end(JSON.stringify(req.body, null,2)) ;
// })
