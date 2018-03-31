var request = require('request');
var cheerio = require('cheerio');
var express = require('express');
var path = require("path");
var http = require('http');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
var app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \Authorization');
    next();
});
var api = express.Router();
app.use('/', api);
api.get('/appstart', function (req, res) {
    res.sendFile(path.join(__dirname + '/view/index.html'));
});
api.get('/getData', function (req, res) {
    var matchObj = {}
    request(req.query.url, function (err, resp, html) {
        if (!err) {
            const $ = cheerio.load(html);
            /*match has result i.e. ended*/
            if ($('.cb-scrcrd-status').html() != null) {
                //matchname
                var divMatchName = $('div').filter(function () {
                    return $(this).text().toLowerCase().trim() === 'match';
                })
                matchObj['match_name'] = divMatchName.next().text();
                //venue
                var divVenue = $('div').filter(function () {
                    return $(this).text().toLowerCase() === 'venue';
                })
                matchObj['venue'] = divVenue.next().text();
                //date
                var divDate = $('div').filter(function () {
                    return $(this).text().toLowerCase() === 'date';
                })
                matchObj['date'] = divDate.next().text();
                //time
                var divTime = $('div').filter(function () {
                    return $(this).text().toLowerCase() === 'time';
                })
                matchObj['time'] = divTime.next().text();
                //match result
                var divMatchResult = $('.cb-scrcrd-status').html();
                matchObj['result'] = divMatchResult;
                //innings01
                var in1 = {
                    team: "",
                    batsman: [],
                    bowlers: []
                }
                //innings02
                var in2 = {
                    team: "",
                    batsman: [],
                    bowlers: []
                }
                var innings01Name = $('#innings_1').find('div > div > div > span').html();
                in1["team"] = innings01Name;
                var innings02Name = $('#innings_2').find('div > div > div > span').html();
                in2["team"] = innings02Name;

                var nextBatsman = $('#innings_1 > div > div > div').filter(function () {
                    return $(this).text().toLowerCase().trim() === 'batsman';
                })
                nextBatsman = nextBatsman.parent();
                while (nextBatsman.next().length >= 1) {
                    if (nextBatsman.next().children().first().children('a').text() != "")
                        in1.batsman.push(nextBatsman.next().children().first().children('a').text());
                    nextBatsman = nextBatsman.next();
                }
                var nextBowler = $('#innings_1 > div > div > div').filter(function () {
                    return $(this).text().toLowerCase().trim() === 'bowler';
                })
                nextBowler = nextBowler.parent();
                while (nextBowler.next().length >= 1) {
                    if (nextBowler.next().children().first().children('a').text() != "")
                        in1.bowlers.push(nextBowler.next().children().first().children('a').text());
                    nextBowler = nextBowler.next();
                }

                var nextBatsman = $('#innings_2 > div > div > div').filter(function () {
                    return $(this).text().toLowerCase().trim() === 'batsman';
                })
                nextBatsman = nextBatsman.parent();
                while (nextBatsman.next().length >= 1) {
                    if (nextBatsman.next().children().first().children('a').text() != "")
                        in2.batsman.push(nextBatsman.next().children().first().children('a').text());
                    nextBatsman = nextBatsman.next();
                }
                var nextBowler = $('#innings_2 > div > div > div').filter(function () {
                    return $(this).text().toLowerCase().trim() === 'bowler';
                })
                nextBowler = nextBowler.parent();
                while (nextBowler.next().length >= 1) {
                    if (nextBowler.next().children().first().children('a').text() != "")
                        in2.bowlers.push(nextBowler.next().children().first().children('a').text());
                    nextBowler = nextBowler.next();
                }
                matchObj["scorecard"] = {};
                matchObj["scorecard"]["first_innings"] = in1;
                matchObj["scorecard"]["second_innings"] = in2;
            }
            res.status(200).json({
                data: matchObj
            });
        }
    });
});
app.listen(port);