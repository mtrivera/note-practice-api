const Goal = require('./../models/goal');
const User = require('./../models/user');
const Pitch = require('./../models/pitch');
//const _ = require('underscore');

module.exports = {
    setSpeed: (req, res) => {
        if (req.headers['token'] === require('./../secrets').token) {
            User.findOne({_id: req.params.id}, (err, user) => {
                Goal.findOne({_id: req.params.goalid}, (err, goal) => {
                    for (var i = 0; i < req.body.pitches; i++) {
                        Pitch.findOne({pitchid: req.body.pitchObj.pitches[i].id}, (err, pitch) => {
                            pitch.setSpeed(req.body.pitchObj, i);
                            pitch.save();
                            goal.pitches.splice(goal.pitches.indexOf(pitch), 1, pitch);
                            goal.save();
                            user.goals.splice(user.goals.indexOf(goal), 1, goal);
                            user.save();
                        });
                    }
                });
                res.status(200).json(user);
            });
        }
        else{
            res.status(500).send('Access denied! Invalid token');
        }
    },
    displayPitches: (req, res) => {
        if (req.headers['token'] === require('./../secrets').token) {
            Pitch.find({userid: req.params.id}, {}, (err, pitches) => {
                res.status(200).json(pitches);
            });
        }
        else {
            res.status(500).send('Access denied! Invalid token');
        }
    }
}