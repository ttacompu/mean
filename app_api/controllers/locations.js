var jsonResponse = require('../controllers/sendJson');
var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var theEarth = (function () {
    var earthRadius = 6371;

    var getDistanceFromRads = function (rads) {
        return parseFloat(rads * earthRadius);
    }

    var getRadsFromDistance = function (distance) {
        return parseFloat(distance / earthRadius);
    }
    return {
        getDistanceFromRads: getDistanceFromRads,
        getRadsFromDistance: getRadsFromDistance
    };
})();

module.exports = {

    locationsListByDistance: function (req, res) {
       
        var lng = parseFloat(req.query.lng);
        var lat = parseFloat(req.query.lat);
        var point = {
            type: "Point",
            coordinates: [lng, lat]
        };

        var geoOptions = {
            spherical: true,
            maxDistance: theEarth.getRadsFromDistance(20),
            num: 10
        }

        

        if (!lng || !lat) {
            jsonResponse.sendJsonResponse(res, 404, { message: "lng and lat query parameters are required" });
            return;
        }

        Loc.geoNear(point, geoOptions, function (err, results, stats) {
            var locations = [];

            if (err) {
                jsonResponse.sendJsonResponse(res, 404, err);
            } else {
                results.forEach(function (doc) {
                    locations.push({
                        distance: theEarth.getDistanceFromRads(doc.dis),
                        name: doc.obj.name,
                        address: doc.obj.address,
                        rating: doc.obj.rating,
                        facilities: doc.obj.facilities,
                        _id: doc.obj._id
                    })
                });

                jsonResponse.sendJsonResponse(res, 200, { status: locations });
            }
        });
    },
    locationsCreate: function (req, res) {
        Loc.create({
            name: req.body.name,
            address: req.body.address,
            facilities: req.body.facilities.split(","),
            coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
            openingTimes: [{
                days: req.body.days1,
                opening: req.body.opening1,
                closing: req.body.closing1,
                closed: req.body.closed1,
            }]
        }, function (err, location) {
            if (err) {
                jsonResponse.sendJsonResponse(res, 400, err);
            } else {
                jsonResponse.sendJsonResponse(res, 201, location);
            }
        });
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
        if (!req.params.locationid) {
            jsonResponse.sendJsonResponse(res, 404, {
                "message": "Not found, locationid is required"
            });
            return;
        }
        Loc
            .findById(req.params.locationid)
            .select('-reviews -rating')
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
                location.name = req.body.name;
                location.address = req.body.address;
                location.facilities = req.body.facilities.split(",");
                location.coords = [parseFloat(req.body.lng),
                    parseFloat(req.body.lat)];
                location.openingTimes = [{
                    days: req.body.days1,
                    opening: req.body.opening1,
                    closing: req.body.closing1,
                    closed: req.body.closed1,
                }];
                location.save(function (err, location) {
                    if (err) {
                        jsonResponse.sendJsonResponse(res, 404, err);
                    } else {
                        jsonResponse.sendJsonResponse(res, 200, location);
                    }
                });
            });
    },
    locationsDeleteOne: function () {
        var locationid = req.params.locationid;
        if (locationid) {
            Loc
                .findByIdAndRemove(locationid)
                .exec(
                function (err, location) {
                    if (err) {
                        jsonResponse.sendJsonResponse(res, 404, err);
                        return;
                    }
                    jsonResponse.sendJsonResponse(res, 204, null);
                }
                );
        } else {
            jsonResponse.sendJsonResponse(res, 404, {
                "message": "No locationid"
            });
        }

    }
}