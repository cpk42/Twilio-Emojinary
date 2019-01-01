const MessagingResponse = require('twilio').twiml.MessagingResponse;
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const Emoji = require('./emoji')
const http = require('http');
const app = express();

// Include API keys from .env file
const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;
const twilioPhone = process.env.TWILIOPHONE;
const client = require('twilio')(accountSid, authToken);

// Initiate body-parser
app.use(bodyParser.urlencoded({
    extended: false
}));

const handleGame = (current, query) => {
    if (query == current.name) {
        return true;
    } else {
        return false;
    }
}

const getNum = (min, max) => {
    return Math.random() * (max - min) + min;
}

// Main function / Initiates Server
const main = () => {
    http.createServer(app).listen(1337, () => {
        console.log('Express server listening on port 1337');
    });

    client.messages
        .create({
            from: '+17754132967',
            body: 'Type \"start\" to start or \"exit\" to exit',
            to: twilioPhone
        })
        .then(message => console.log(message.sid))
        .done();

    var current;

    // POST request to handle queries sent by client phone
    app.post('/handle', (req, res) => {
        const twiml = new MessagingResponse();
        var query = req.body.Body.toLowerCase();

        if (query == 'start') {
            current = Emoji[Math.floor(getNum(0, 13))];
            twiml.message('Guess the Emoji: ' + current.emoji);
        } else if (query == 'exit' || query == 'quit') {
            twiml.message('Thanks for playing!');
            process.exit(1);
        } else if (handleGame(current, query)) {
            twiml.message();
            twiml.message('Good Job!\nType \"start\" to start or \"exit\" to exit');
        } else
            twiml.message('Guess again!')

        res.writeHead(200, {
            'Content-Type': 'text/xml'
        });
        res.end(twiml.toString());
    });
}

main();
