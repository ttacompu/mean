var jsonResponse = require('../controllers/sendJson');
var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var doSetAverageRating = function (location) {
    var i, reviewCount, ratingAverage, ratingTotal;
    if (location.reviews && location.reviews.length > 0) {
        reviewCount = location.reviews.length;
        ratingTotal = 0;
        for (i = 0; i < reviewCount; i++) {
            ratingTotal = ratingTotal + location.reviews[i].rating;
        }
        ratingAverage = parseInt(ratingTotal / reviewCount, 10);
        location.rating = ratingAverage;
        location.save(function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Average rating updated to", ratingAverage);
            }
        });
    }
};
var updateAverageRating = function (locationid) {
    Loc
        .findById(locationid)
        .select('rating reviews')
        .exec(
        function (err, location) {
            if (!err) {
                doSetAverageRating(location);
            }
        });
};


var doAddReview = function (req, res, location) {
    if (!location) {
        sendJsonResponse(res, 404, {
            "message": "locationid not found"
        });
    } else {
        location.reviews.push({
            author: req.body.author,
            rating: req.body.rating,
            reviewText: req.body.reviewText
        });
        location.save(function (err, location) {
            var thisReview;
            if (err) {
                jsonResponse.sendJsonResponse(res, 400, err);
            } else {
                updateAverageRating(location._id);
                thisReview = location.reviews[location.reviews.length - 1];
                jsonResponse.sendJsonResponse(res, 201, thisReview);
            }
        });
    }
};


module.exports = {

    reviewsCreate: function (req, res) {
        var locationid = req.params.locationid;
        if (locationid) {
            Loc
                .findById(locationid)
                .select('reviews')
                .exec(
                function (err, location) {
                    if (err) {
                        jsonResponse.sendJsonResponse(res, 400, err);
                    } else {
                        doAddReview(req, res, location);
                    }

                })

        } else {
            jsonResponse.sendJsonResponse(res, 404, {
                "message": "locationid not found"
            });
        }

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
        if (!req.params.locationid || !req.params.reviewid) {
            jsonResponse.sendJsonResponse(res, 404, {
                "message": "Not found, locationid and reviewid are both required"
            });
            return;
        }

        Loc
            .findById(req.params.locationid)
            .select('reviews')
            .exec(function (err, location) {
                var thisReview;
                if (!location) {
                    jsonResponse.sendJsonResponse(res, 404, {
                        "message": "locationid not found"
                    });
                    return;
                } else if (err) {
                    jsonResponse.sendJsonResponse(res, 400, err);
                    return;
                }

                if (location.reviews && location.reviews.length > 0) {
                    thisReview = location.reviews.id(req.params.reviewid);
                    if (!thisReview) {
                        jsonResponse.sendJsonResponse(res, 404, {
                            "message": "reviewid not found"
                        });
                    } else {
                        thisReview.author = req.body.author;
                        thisReview.rating = req.body.rating;
                        thisReview.reviewText = req.body.reviewText;
                        location.save(function (err, location) {
                            if (err) {
                                jsonResponse.sendJsonResponse(res, 404, err);
                            } else {
                                updateAverageRating(location._id);
                                jsonResponse.sendJsonResponse(res, 200, thisReview);
                            }

                        });


                    }
                } else {
                    jsonResponse.sendJsonResponse(res, 404, {
                        "message": "No review to update"
                    });

                }

            })

    },

    reviewsDeleteOne: function (req, res) {
        if (!req.params.locationid || !req.params.reviewid) {
            jsonResponse.sendJsonResponse(res, 404, {
                "message": "Not found, locationid and reviewid are both required"
            });
            return;
        }
        Loc
            .findById(req.params.locationid)
            .select('reviews')
            .exec(
            function (err, location) {
                if (!location) {
                    jsonResponse.sendJsonResponse(res, 404, {
                        "message": "locationid not found"
                    });
                    return;
                } else if (err) {
                    jsonResponse.sendJsonResponse(res, 400, err);
                    return;
                }
                if (location.reviews && location.reviews.length > 0) {
                    if (!location.reviews.id(req.params.reviewid)) {
                        jsonResponse.sendJsonResponse(res, 404, {
                            "message": "reviewid not found"
                        });
                    } else {
                        location.reviews.id(req.params.reviewid).remove();
                        location.save(function (err) {
                            if (err) {
                                jsonResponse.sendJsonResponse(res, 404, err);
                            } else {
                                updateAverageRating(location._id);
                                jsonResponse.sendJsonResponse(res, 204, null);
                            }
                        });
                    }
                } else {
                    jsonResponse.sendJsonResponse(res, 404, {
                        "message": "No review to delete"
                    });
                }
            });

    }
}