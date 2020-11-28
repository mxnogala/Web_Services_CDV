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
var cors = require('cors')
app.use(cors())
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
    let name=req.params.name;
    let schema=yup.string().max(10).matches(/^[a-zA-Z]+\s*$/);
    if (schema.isValidSync(name))
    {
        res.status(200);
        res.send('Hello '+name+"!");
    }
    else 
    {
        res.status(400);
        res.send('Name is not valid');
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
        if (err) 
        {
            res.send(500);
            res.status(500);
        };
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
    
    const consts=require('./consts');
    const log=consts.LOGIN; 
    const pass=consts.PASSWORD; 
    console.log(req.body.login);
    console.log(req.body.password);
    console.log(log);
    console.log(pass); 
    if (req.query.login!=log || req.query.password!=pass)
    {
        res.status(401);
        res.send("Niepoprawne dane"); 
    }
    else {
        var token=jwt.sign({log}, consts.PRIVATE_KEY)
        res.send(token);

    }
})


//6
app.get('/profile', (req,res) =>{
    const consts = require('./consts');
    
    if (req.headers.authorization!=null)
    {
        var token = req.headers.authorization;
        token = token.slice(7);
        jwt.verify(token, consts.PRIVATE_KEY, function (err, decoded) 
        {
            if (err)
            {
                res.status(401);
                res.send("Niepoprawny token");
            }    
            else 
            {
                res.status(200);
                res.json({ login: decoded.login });
            }
        } )
    }
    else 
    {
        res.status(500);
        res.send("Brak tokena");
    }
  });

