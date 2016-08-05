var jsonResponse = require('../controllers/sendJson');

module.exports = {
    getEnv: function (req, res) {
        if (process.env.NODE_ENV === 'production') {
            jsonResponse.sendJsonResponse(res, 200, {env : "production" });
        }else{
            jsonResponse.sendJsonResponse(res, 200, {env : "development" });
        }

    }
}