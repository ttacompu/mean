var jsonResponse = require('../controllers/sendJson');
var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

module.exports={

    locationsListByDistance : function(req, res){
        jsonResponse.sendJsonResponse(res, 200, {status : "success"});
    },
    locationsCreate : function(req, res){
    },
    locationsReadOne : function () {
    },
    locationsUpdateOne : function(){

    },
    locationsDeleteOne : function () {
        
    }
}