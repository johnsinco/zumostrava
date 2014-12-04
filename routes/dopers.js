var express = require('express');
var router = express.Router();
var strava = require('strava-v3');
var async = require('async');

router.get('/', function(req, res) {
    var segments = [];
    var doped = [{foo: 'baz'}];

    var findDopers = function(board, segment) {
        // pull the std deviation of the top-10
        // return the {name, leader, score} if above 1-std dev
        var total = 0;
        for(var i=0; i < 9; i++) {
            total += board[i].elapsed_time;
        }
        var mean = total / 9;
        console.log("mean for leaders is " + mean);
        sumsquaredif = 0;
        for(var i=0; i < 9; i++) {
            sumsquaredif += Math.abs(board[i].elapsed_time - mean);
        }
        var stddev = Math.sqrt(sumsquaredif / 9);
        console.log("STANDARD DEVIATION OF SEGMENT "+stddev);
        if((mean - board[0].elapsed_time) > 5*stddev) {
            return {"segment_name": segment.segment_name,"segment_id": segment.id,  "leader": board[0]} 
        }
    };
    strava.segments.explore({bounds: "39.420841,-104.923407,39.602013,-104.703680"}, function(err, payload) {
        if(!err) {          
            // pull averages for segments and calc the std deviation
            var data = [];
            async.each(payload.segments, function(seg, callback) {
                // this is the item iterator function
                strava.segments.listLeaderboard({id: seg.id}, function(err, result) {
                    var dopes = findDopers(result.entries, seg);
                    if(dopes != null) {
                        console.log("DOPED DUDE!! "+ dopes.segment_name + "  ... " + dopes.leader.athlete_name);
                        data.push(dopes);
                    } else {
                        console.log("no dope for " + seg.name);
                    }
                    callback(null);
                })
            },
            function(err) {
                // this is the final completion function
                console.log("IN FINAL CALLBACK");
                res.json(data);
            });
        }   
        else {
            console.log(err);
        }
    });
});

module.exports = router;
