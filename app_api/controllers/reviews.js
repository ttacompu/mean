var jsonResponse = require('../controllers/sendJson');
var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

module.exports = {

    reviewsCreate: function (req, res) {

    },

    reviewsReadOne: function (req, res) {
        if (req.params && req.params.locationid && req.params.reviewid) {
            Loc
                .findById(req.params.locationid)
                .select('name reviews')
                .exec(
                function (err, location) {
                    var response, review;
                    if (!location) {
                        jsonResponse.sendJsonResponse(res, 404, {
                            "message": "locationid not found"
                        });
                        return;
                    }
                    else if (err) {
                        jsonResponse.sendJsonResponse(res, 400, err);
                        return;
                    }

                    if (location.reviews && location.reviews.length > 0) {
                        review = location.reviews.id(req.params.reviewid);
                        if (!review) {
                            jsonResponse.sendJsonResponse(res, 404, {
                                "message": "reviewid not found"
                            });
                        } else {
                            response = {
                                location: {
                                    name: location.name,
                                    id: req.params.locationid
                                },
                                review: review
                            };
                            jsonResponse.sendJsonResponse(res, 200, response);
                        }

                    } else {
                        jsonResponse.sendJsonResponse(res, 404, {
                            "message": "No reviews found"
                        });
                    }

                });

        } else {
            jsonResponse.sendJsonResponse(res, 404, {
                "message": "Not found, locationid and reviewid are both required"
            });

        }
    },

    reviewsUpdateOne: function (req, res) {

    },

    reviewsDeleteOne: function (req, res) {

    }
}