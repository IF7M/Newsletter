require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const https = require("https");
const app = express();
const port = process.env.PORT;


mailchimp.setConfig({
  apiKey: process.env.API_KEY,
  server: process.env.API_SERV
});




app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  
  res.sendFile(__dirname + "/signup.html");
})



app.post("/", function(req, res) {


run(req, res);
});

const run = async (req, res) => {

  const response = await mailchimp.lists.batchListMembers(process.env.API_LIST, {
    members:[{
    email_address: req.body.email,
    status: "subscribed",
    merge_fields: {
      FNAME: req.body.fName,
      LNAME: req.body.lName,
    },
  }],
});
console.log(response.new_members.length);
if (response.new_members.length === 0) {
  res.sendFile(__dirname + "/failure.html");
  var status = "Error!";
} else {
  res.sendFile(__dirname + "/success.html");
  var status = "Success";
}
console.log(status);
}


app.post("/failure", (req, res) =>{
  res.redirect("/");
});




app.listen(port, function() {

  console.log(`Server on on port ${port}, url http://localhost:${port}`);
});

