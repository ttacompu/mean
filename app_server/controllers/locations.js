module.exports.homelist = function(req, res){
    res.render('location-list', {title : 'home'});

}

module.exports.locationInfo = function(req, res){

 res.render('location-info', {title : 'location info'});
}

module.exports.addReview = function(req, res){
    res.render('location-review', {title : 'Add review'});
}