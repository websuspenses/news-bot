var builder = require('botbuilder');
var apiairecognizer = require('api-ai-recognizer'); 
var connector = new builder.ConsoleConnector().listen(); 
var bot = new builder.UniversalBot(connector); 
var recognizer = new apiairecognizer('27ee325d2df741edb1ebd929c9a45297'); 
var intents = new builder.IntentDialog({ recognizers: [recognizer] }); 
var request = require('request');
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
        })
        } else {
            builder.Prompts.text(session, 'Which news do you want for?');
        }
    }, function (session, results) {
        botHelper.getNews(results.response).then(function(res){
            var articles = res.articles;
            
            botHelper.showNews(res,session);
        })
        //session.send("No News in " + results.response);
    }]);

intents.onDefault(function(session){ 
    session.send("Sorry...can you please rephrase?"); 
});