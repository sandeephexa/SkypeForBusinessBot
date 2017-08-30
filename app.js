var fs = require('fs');
var builder = require('botbuilder');
var restify = require('restify');
require('dotenv-extended').load();
var apiairecognizer = require('api-ai-recognizer');
const unhandledRejection = require("unhandled-rejection");
let rejectionEmitter = unhandledRejection({
    timeout: 20
});
rejectionEmitter.on("unhandledRejection", (error, promise) => {
    fs.writeFileSync("./data.json", JSON.stringify(error), "utf8");
});

rejectionEmitter.on("rejectionHandled", (error, promise) => {
    fs.writeFileSync("./data.json", JSON.stringify(error), "utf8");
})
var GlideRecord = require('servicenow-rest').gliderecord;
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

var connector = new builder.ChatConnector({
    appId: 'd105ed4b-a5a0-4423-8fd4-61932d183b3f',
    appPassword: 'cpTjMdQ9phYCiHbFOEVG5iN'
});
server.post('/', connector.listen());
builder.Prompts.text(session, "What is your name?");
var bot = new builder.UniversalBot(connector);
var recognizer = new apiairecognizer('50ab8ddd9a594abfbe4cfe1a951dee8d');
bot.recognizer(recognizer);
var intents = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', intents);
intents.matches('Welcome-message', [
    function (session, args) {
        session.send("How can I help you?");
    }
]);//Welcome Intent Fired
// intents.matches('User registration',[
//      function (session, args) {
//      session.send("sure, Can you please tell me your name ?");
//      }
// ]);
// intents.matches('User registration - yes',[
//      function (session, args) {
//       var name = builder.EntityRecognizer.findEntity(args.entities, 'name');   
//      session.send("Nice to meet you "+firstname+". Can I have your Employee ID number please.");
//      }
// ]);

intents.matches('Add user', function()
{
    // function (session, args) {
    //     var gr = new GlideRecord('dev43073', 'sys_user', 'admin', 'DEUCD78YCgkJ');
    //     var firstname = builder.EntityRecognizer.findEntity(args.entities, 'firstname');
    //     var lastname = builder.EntityRecognizer.findEntity(args.entities, 'lastname');
    //     var title = builder.EntityRecognizer.findEntity(args.entities, 'title');
    //     var emails = builder.EntityRecognizer.findEntity(args.entities, 'email');
    //     var username = builder.EntityRecognizer.findEntity(args.entities, 'username');
    //     var password = builder.EntityRecognizer.findEntity(args.entities, 'password');
    //     var fulfillment = builder.EntityRecognizer.findEntity(args.entities, 'fulfillment');
    //     var actionIncomplete = builder.EntityRecognizer.findEntity(args.entities, 'actionIncomplete');
     
    //   if (fulfillment) {
    //      var speech = fulfillment.entity;        
    //      //session.send(speech+JSON.stringify(args));
    //  }
    //     session.send(JSON.stringify(args));
     
       
    // }
    //builder.Prompts.text(session, "What is your name?");
}
);

intents.onDefault(function (session) {
    session.send("Sorry...can you say that again?");
});
