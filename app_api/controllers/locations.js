var jsonResponse = require('../controllers/sendJson');
var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

module.exports = {

    locationsListByDistance: function (req, res) {
        jsonResponse.sendJsonResponse(res, 200, { status: "success" });
    },
    locationsCreate: function (req, res) {
    },
    locationsReadOne: function (req, res) {
        if (req.params && req.params.locationid) {
            Loc
                .findById(req.params.locationid)
                .exec(function (err, location) {
                    if (!location) {
                        jsonResponse.sendJsonResponse(res, 404, {
                            "message": "locationid not found"
                        });
                        return;
                    } else if (err) {
                        jsonResponse.sendJsonResponse(res, 404, err);
                        return;
                    }
                    jsonResponse.sendJsonResponse(res, 200, location);

                })
        }
        else {
            jsonResponse.sendJsonResponse(res, 404, { "message": "No locationid in request" });
        }



    },
    locationsUpdateOne: function () {

    },
    locationsDeleteOne: function () {

    }
}