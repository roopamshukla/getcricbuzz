mongoose = require('mongoose');
var room = mongoose.Schema({
    id: {
        type: String,
    },
    caller: {
        id: {
            type: String,
        },
    },
    connections: [{
        id: {
            type: String,
           
        },
        sdpOffer: [{
            id: {
                type: String,
                
            },
            sdp: {}
        }],
        sdpAnswer: [{
            id: {
                type: String,
                
            },
            sdp: {}
        }],
        iceCandidates: [{
            candidate: {
                type: String,
                
            },
            sdpMid: {
                type: String
            },
            sdpMLineIndex: {
                type: Number
            }
        }]
    }],
    datecreated: {
        type: Date,
        default: Date.now
    }

})
module.exports = mongoose.model('room', room);