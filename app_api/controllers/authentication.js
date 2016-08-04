var jsonResponse = require('../controllers/sendJson');
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = {
    register: function (req, res) {

        if (!req.body.name || !req.body.email || !req.body.password) {
            jsonResponse.sendJsonResponseresponse(res, 400, {
                "message": "All fields required"
            });
            return;
        }

        var user = new User();
        user.name = req.body.name;
        user.email = req.body.email;
        user.setPassword(req.body.password);

        user.save(function (err) {
            var token;
            if (err) {
                jsonResponse.sendJsonResponse(res, 404, err);
            } else {
                token = user.generateJwt();
                jsonResponse.sendJsonResponse(res, 200, {
                    "token": token
                });

            }
        })

    },
    login: function (req, res) {
       
        if (!req.body.email || !req.body.password) {
            jsonResponse.sendJsonResponseNresponse(res, 400, {
                "message": "All fields required"
            });
            return;
        }

        passport.authenticate('local', function (err, user, info) {
            var token;
            if (err) {
                console.log(err);
                jsonResponse.sendJsonResponseresponse(res, 404, err);
                return;
            }

            if (user) {
                token = user.generateJwt();

                jsonResponse.sendJsonResponse(res, 200, {"token": token});
            } else {
                jsonResponse.sendJsonResponse(res, 401, info);
            }
        })(req, res);

    }
}