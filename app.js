var fs = require('fs');
var builder = require('botbuilder');
var restify = require('restify');
var apiai = require("apiai");
var APIAII = apiai('50ab8ddd9a594abfbe4cfe1a951dee8d');
const uuidv1= require('uuid/v1')();
var firstnameo;
var lastnameo;
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
var bot = new builder.UniversalBot(connector, function (session) {
  if (session.message.text) 
  {
        var request = APIAII.textRequest(session.message.text, {
            sessionId: uuidv1
        });
        request.on('response', function (response)
         {
            let result = response.result;
          //session.send(JSON.stringify(result));
             if(result.metadata.intentName=="Welcome-message")
            {
              session.send("Hi \n How can i help you");
             }
             
             else if(result.metadata.intentName=="Device_allocation")
             {
                 var givenname=firstnameo+" "+lastnameo;
                var deviceentity=result.parameters["device_entity"];
               // var ipaddress=result.parameters["number"];
                //var status_device=result.parameters["status_device"];
          
                if(password!="" && givenname!="" && deviceentity!="" )
                {
                         var obj = 
                        {
                            assigned_to:givenname,
                            name:deviceentity,
                        };
                         var gr = new GlideRecord('dev43073', 'cmdb_ci_comm', 'admin', 'BUCnMM5FWds8');              
                        gr.insert(obj).then(function(response)
                        {
                            session.send("Device updated successfully !!!"); 
                        })            
                }  
                else
                {
                     session.send(result.fulfillment.speech);    
                }
            }
            else if(result.metadata.intentName=="add_device_login")
            {
                 var password=result.parameters["password"];
                 var email=result.parameters["email"];
                 if(password!="" && email!="")   
                 {
                     var gr = new GlideRecord('dev43073', 'sys_user', 'admin', 'BUCnMM5FWds8');
                     gr.setReturnFields('first_name,last_name,email,passowrd');
                     gr.addEncodedQuery('email='+email);   
                     gr.query().then(function(result1)
                     { 
                        firstnameo=result1[0].first_name;
                        lastnameo=result1[0].last_name;
                        emaill =result1[0].email;
                        passwordd = result[0].password;
                        gr.setReturnFields('first_name,last_name');
                        if(email == emaill && password == passwordd)
                        {
                            session.send("log in successful ! want to add any device ?");
                        }
                        else{
                            session.send("you are not an autherised user");
                        }
                     }) 
                }
                else
                {
                    session.send(result.fulfillment.speech);    
                }
             }
                else if(result.metadata.intentName=="Add user")
                {
                    var email=result.parameters["email"];
                    var firstname=result.parameters["firstname"];
                    var lastname=result.parameters["lastname"];
                    var idno=result.parameters["number"];
                    var password=result.parameters["password"];
                     var jobtitle=result.parameters["title"];
                     var username=firstname+"."+lastname;
                        //if(username!="" && email!=""  && firstname!=""   && lastname!=""  && idno!="" && password!="" && jobtitle!="")
                    if(email!=""  && firstname!=""   && lastname!=""  && password!="" && jobtitle!="")
                    {
           
                         var obj = {
                          email:email,
                         user_password:password,
                        first_name:firstname,
                         last_name:lastname,
                         //employee_number:idno,
                         user_name:username,
                            title:jobtitle
                        };
                        var gr = new GlideRecord('dev43073', 'sys_user', 'admin', 'BUCnMM5FWds8');              
                         gr.insert(obj).then(function(response)
                         {
                            session.send("User created ! Do you need anything else ?"); 
                        })
                    }
                    else
                     {
                            session.send(result.fulfillment.speech);
                     }
        
                }
                else if(result.metadata.intentName=="Default Fallback Intent")
                {
                    session.send(result.fulfillment.speech);    
                }
              
      });
      request.on('error', function (error) {
            //  console.log(error);
        });
     request.end();
  }

});
          


//console.log("testing");
// intents.onDefault(function (session) {
//     session.send("Sorry...can you say that again?");
// });
