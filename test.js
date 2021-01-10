
const BASE_URL = "http://localhost:3000";
const PATHS = {
  INFO: "/info",
  HELLO: "/hello",
  STORE: "/store",
  PARSE: "/parse",
  LOGIN: "/login",
  PROFILE: "/profile",
};
const axios = require('axios');
axios.defaults.baseURL = BASE_URL;
const parses = require("./parsers");


test("Info endpoint positive test", async () => {
  const response = await axios.get(PATHS.INFO);
  expect(response.status).toEqual(200);
  expect(response.data).toEqual({ author: '23621' });
});

test("Hello endpoint positive test", async() => {
  const name="Monika";
  const response=await axios.get(PATHS.HELLO+"/"+name); 
  expect(response.status).toEqual(200); 
  expect(response.data).toEqual("Hello "+name+"!");
})

test("Hello endpoint positive test- whitespaces", async() => {
  const name="Monika ";
  try 
 { 
   await axios.get(PATHS.HELLO+"/"+name); 
 }
 catch (response)
 {
  expect(response.status).toEqual(200); 
  expect(response.data).toEqual('Hello '+name+"!");
 }
})

test("Hello endpoint negative test - numbers in name", async () => {
  const name = '1234';
  try {
      await axios.get(PATHS.HELLO + '/' + name);
  } catch ({ response }) {
      expect(response.status).toEqual(400);
      expect(response.data).toEqual('Name is not valid');
  }
});

test("Hello endpoint negative test - too long", async () => {
  name="Monikaaaaaaaaa"
  try {
    await axios.get(PATHS.HELLO + "/" + name);
  } catch ({ response }) {
    expect(response.status).toEqual(400);
    expect(response.data).toEqual("Name is not valid");
  }
});

test("Hello endpoint negative test - polish chars", async () => {
  name="Monikął"
  try {
    await axios.get(PATHS.HELLO + "/" + name);
  } catch ({ response }) {
    expect(response.status).toEqual(400);
    expect(response.data).toEqual("Name is not valid");
  }
});

test("Store endpoint positive test - first request", async () => {
  const qs = require("qs");
  const data = qs.stringify({ input: "testowa wartość" })
  const response = await axios.post(PATHS.STORE, data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
})

test("Store endpoint positice test- second request", async()=> {
  const qs = require("qs");
  const data = qs.stringify({ input: "testowa wartość" })
  const response = await axios.post(PATHS.STORE, data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
  expect(response.status).toEqual(200);
  expect(response.data).toEqual({"Stored data": ["testowa wartość", "testowa wartość"]})
 
})

test("Parse endpoint positive test", ()=> {
  const parsers=require("./parsers")
  const data="value_A:1;value_B:2;value_C:value_D:3,value_E:4;value_F:5;value_G:value_H:6";
  const result=parsers.parse(data);
  expect(result).toEqual({
    value_A: 1,
    value_B: 2, 
    value_C: { value_D: 3, value_E: 4 },
    value_F: 5,
    value_G: { value_H: 6},
  });

});

test("Login endpoint positive test", async() => {
  const consts = require('./consts');
  var log=consts.LOGIN;
  var pass=consts.PASSWORD;
  const response = await axios.get(PATHS.LOGIN, 
    {
      headers: 
      {
          'Content-Type': 'application/json',
        },
      params: 
      {
          login: log,
          password: pass,
        }
      })
    expect(response.status).toEqual(200);
    expect(response.data).not.toEqual(null);
});

test("Login endpoint negative test - incorrect login ", async()=> {
  const consts = require('./consts');
  const pass=consts.PASSWORD;
  try {
    await axios.get(PATHS.LOGIN, 
    {
      headers: 
      {
          'Content-Type': 'application/json',
        },
      params: 
      {
          login: 'test123',
          password: pass,
        }
      })
  } catch ({response}){
    expect(response.status).toEqual(401);
    expect(response.data).toEqual("Niepoprawne dane");
  }
   
});

test("Login endpoint negative test - incorrect password ", async()=> {
  const consts = require('./consts');
  const log=consts.LOGIN;
  try {
    await axios.get(PATHS.LOGIN, 
    {
      headers: 
      {
          'Content-Type': 'application/json',
        },
      params: 
      {
        login: log,
        password: 'password',
      }
      })
  } catch ({response}){
    expect(response.status).toEqual(401);
    expect(response.data).toEqual("Niepoprawne dane");
  }
   
});

test("Profile endpoint positive test", async()=> {
  const consts = require('./consts');
  const jwt = require('jsonwebtoken');
  const log= consts.LOGIN;
  let token = jwt.sign({'login':log}, consts.PRIVATE_KEY);
  const response = await axios.get(PATHS.PROFILE, 
  {
    headers: {
      'Authorization': 'Bearer ' + token
      },
  });

    expect(response.status).toEqual(200);
    expect(response.data).toEqual({
        login: "test"
    });

});

test("Profile endpoint negative test - token is missing ", async()=> {
  const consts = require('./consts');
  const log=consts.LOGIN;
  try {
    await axios.get(PATHS.PROFILE);
  }
  catch({response}) 
  {
    expect(response.status).toEqual(500);
    expect(response.data).toEqual("Brak tokena");
  }
   
});

test("Profile endpoint negative test - icorrect token ", async()=> {
  const consts = require('./consts');
  const log=consts.LOGIN;
  const jwt = require('jsonwebtoken');
  let token = jwt.sign({'login':log}, consts.PRIVATE_KEY);
  try
  {
    await axios.get(PATHS.PROFILE, 
      {
        headers: {
          'Authorization': 'aaa ' + token
          },
  })
} catch ({response})
{
  expect(response.status).toEqual(401);
  expect(response.data).toEqual("Niepoprawny token");
}
   
});
