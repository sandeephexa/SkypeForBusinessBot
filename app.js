require('dotenv-extended').load();
var builder = require('botbuilder');
var restify = require('restify');
var apiairecognizer = require('api-ai-recognizer');
var request = require("request");

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create connector and listen for messages
var connector = new builder.ChatConnector({
    appId: 'd60f4a2a-5926-42c5-baa6-db7a8ddcd162',
    appPassword: '2uiQBbbGGAhkxnGVJDBeb9X'
});

server.post('/api/messages', connector.listen());
//POST Call Handler
var bot = new builder.UniversalBot(connector);
var recognizer = new apiairecognizer('50ab8ddd9a594abfbe4cfe1a951dee8d');

bot.recognizer(recognizer);

var intents = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', intents);

intents.matches('Welcome-message', [
    function (session, args) {
      console.log("Welcome-message Fired");
      console.log("Args : "+JSON.stringify(args));
      var responseString="Hi, what can i do for you "
      session.send(responseString);
    }
]);//Welcome Intent Fired

intents.matches('Add user', [
    function (session, args) {
        console.log("Add user")
        console.log("Args : "+JSON.stringify(args));
        var responseString="Sure !"
        session.send(responseString);
    }
]);







intents.onDefault(function(session){
    session.send("Sorry...can you say that again?");
});




// server.get('/', (req, res, next) => {
//     sendProactiveMessage(savedAddress);
//     res.send('Proactive Notification triggered');
//     next();
//   }//Proavtive Notifications
// );

// function sendProactiveMessage(address) {
//   var msg = new builder.Message().address(address);
//   msg.text('Hello, this is a notification from an external Call');
//   msg.textLocale('en-US');
//   bot.send(msg);
// }//GET Call Notification Function
