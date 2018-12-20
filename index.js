const MessagingResponse = require('twilio').twiml.MessagingResponse;
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const app = express();

// Include API keys from .env file
const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;
const client = require('twilio')(accountSid, authToken);



// Initiate body-parser
app.use(bodyParser.urlencoded({
  extended: false
}));


// Main function / Initiates Server
const main = () => {
    client.messages
      .create({
        from: '+17754132967',
        body: 'Ask a question pls.',
        to: '+15304489510'
      })
      .then(message => console.log(message.sid))
      .done();

  http.createServer(app).listen(1337, () => {
    console.log('Express server listening on port 1337');
  });

  // POST request to handle queries sent by client phone
  app.post('/handle', (req, res) => {
    const twiml = new MessagingResponse();
    var query = req.body.Body.toLowerCase();

    console.log(query);
    switch (query) {
      case ('hello' || 'hi' || 'hey' || 'greetings'):
        twiml.message('Hi!');
        break;
      case ('bye' || 'goodbye' || 'farewell'):
        twiml.message('Goodbye');
        break;
      default:
        twiml.message('I dont understand your question.');
    }

    res.writeHead(200, {
      'Content-Type': 'text/xml'
    });
    res.end(twiml.toString());
  });

}




main();




//
// const start = () => {
//   var response = "wow";
//   client.messages
//     .create({
//       from: '+17754132967',
//       body: response,
//       to: '+15304489510'
//     })
//     .then(message => console.log(message.sid))
//     .done();
// }
