var Promise = require("bluebird");
var request = require('request');
module.exports = {
    getNews: function (cat, date) {
        var category;
        if (cat === 'sports') {
            category = 'bbc-sport';
        } else {
            category = 'google-news';
        }
        var url = "https://newsapi.org/v1/articles?source=" + category + "&sortBy=top&apiKey=100aade5989643d3985e3f7dbfcb379a";

        return new Promise(function (resolve, reject) {

            request(url, function (error, response, body) {
                body = JSON.parse(body);
                resolve(body);
            }, function (e) {
                reject(e);
            });

        });


    },
    showNews: function (res,session) {
        var articles = res.articles;
        for (var i = 0, len = articles.length; i < len; i++) {
            session.send("News "+i+":"+articles[i].title);
          }
    }

}