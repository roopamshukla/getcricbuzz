mongoose = require('mongoose');
var room = mongoose.Schema({
            "match_name": "",
            "venue": "",
            "date": "",
            "time": "",
            "match_result": "",
            "scorecard": {
                "First Inning": {
                    "team": "",
                    "batsmen": [],
                    "bowler": []
                },
                "Second Inning": {
                    "team": "",
                    "batsmen": [],
                    "bowler": []
                }
            })
module.exports = mongoose.model('room', room);
