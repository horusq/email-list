const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https")
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req,res){
  res.sendFile(__dirname + "/signup.html");
});



app.post("/", function(req, res){
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const eMail =req.body.email;
  console.log(firstName, lastName, eMail);

  const data ={
    members:[
      {
        email_address:eMail,
        status:"subscribed",
        merge_fields: {
          FNAME:firstName,
          LNAME:lastName,
        }
      }
    ]
  };
  const jsonData = JSON.stringify(data);

  const url="https://us21.api.mailchimp.com/3.0/lists/c39c962791";
  const options = {
    method:"POST",
    auth:"horus:d98b2cc1dff71f24ef873b1e18239e83-us21",
  }
  const request = https.request(url, options, function(response){
    if (response.statusCode===200){
        res.sendFile(__dirname + "/success.html");
      } else {
          res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
    request.end();
});

app.post("/failure", function(req,res){
  res.redirect("/");
});

app.listen(3000, function(){
 console.log("server started on port 3000");
});



// apiKey = d98b2cc1dff71f24ef873b1e18239e83-us21
//listId = c39c962791
