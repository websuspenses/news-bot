var builder = require('botbuilder'); 
var restify = require('restify'); 
var apiairecognizer = require('api-ai-recognizer'); 
var request = require('request'); 
//========================================================= 
//// Bot Setup //========================================================= 
//// Setup Restify Server
var server = restify.createServer(); 
server.listen(process.env.port || process.env.PORT || 3978, function () { console.log('%s listening to %s', server.name, server.url); }); 
// Create chat bot 
var connector = new builder.ChatConnector({ appId: '0e4f90c9-79c3-41a5-aafa-2dab4a3e122a', appPassword: 'FiZiGjx8JnV8eiXfFOVeaZZ' });

var bot = new builder.UniversalBot(connector); 
var recognizer = new apiairecognizer('27ee325d2df741edb1ebd929c9a45297'); 
var intents = new builder.IntentDialog({ recognizers: [recognizer] }); 
var botHelper = require('./helpers/botHelper');
bot.dialog('/',intents);

//intents.matches('news.search',
//        function(session){ 
//            session.send("Opening First article"); 
//        }); 

//intents.matches('news.search', function (session, args) {
//    var topic = builder.EntityRecognizer.findEntity(args.entities, 'topic');
//    console.log('topic',topic);
//    if (topic) {
//        var tp = topic.entity;
//        session.send("No News for " + tp);
//    } else {
//        builder.Prompts.text(session, 'Which news do you want for?');
//    }
//});

intents.matches('news.search', [function (session, args) {
        var topic = builder.EntityRecognizer.findEntity(args.entities, 'topic');
        console.log('topic',topic);
    if (topic) {
        var tp = topic.entity;
            botHelper.getNews(tp).then(function(res){
            var articles = res.articles;
            
            botHelper.showNews(res,session);
        });
        } else {
            builder.Prompts.text(session, 'Which news do you want for?');
        }
    }, function (session, results) {
        botHelper.getNews(results.response).then(function(res){
            var articles = res.articles;
            
            botHelper.showNews(res,session);
        });
        //session.send("No News in " + results.response);
    }]);

intents.onDefault(function(session){ 
    session.send("Sorry...can you please rephrase?"); 
});