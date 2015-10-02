var _ = require("underscore");

var logger = require("../utils/log/cntrlLog");
var Bookmark = require("../models/bookmark");
var user = require("../models/user");

var mandatoryParamFilter = require("../filters/mandatoryParamFilter");
var ensureBranchExist = require("../filters/ensureBookmarkExist");
var validateBranchOwnership = require("../filters/validateBookmarkOwnership");


var actionComposer = require("./actionComposer");

module.all = function (req, resp) {
    Bookmark.getByUserId(req.session.userId).then(function(bookmarks){
        resp.json(bookmarks);
    });
}

module.exports.get = function (req, resp) {
    Bookmark.getById(req.session.userId, req.params.id).then(function(bookmark){
        if(!bookmark){
            resp.status(404).send("bookmark not found");
            return;
        }
        resp.json(bookmark);
    });
}

module.exports.getShareInformation = actionComposer({
    beforeFilters: [mandatoryParamFilter(["id"])],
    action: function(req, resp) {
        logger.debug("get share info started " + req.params);
        Bookmark.forge({id: req.query.id}).getShareInformation().then(function(data) {
            logger.info("share data for branch: " + req.query.id + " data:" + JSON.stringify(data));
            data.owners.splice(_.findIndex(data.owners, function(owner){return owner.id === req.session.userId}),1);
            resp.json(data);
        });
    }
})

module.exports.post = function (req, resp) {
    Bookmark.persist(req.body.bookmark, req.session.userId).then(function(res){
        if(res) {
            resp.sendStatus(200);
        }else {
            resp.status(403).send("You have no right to edit this bookmark");
        }
    }, function(){
        resp.status(500).send("can not update bookmark, please contact your administrator");
    });
}

module.exports.remove = function (req, resp) {
    if(!req.body.id) {
        resp.status(400).send("id is not provided");
        return;
    }
    Bookmark.forge({id : req.body.id}).destroy().then(function() {
        resp.send("successfully removed");
    })
}

module.exports.share = actionComposer({
    beforeFiltes: [mandatoryParamFilter(["id"])],
    action: function (req, resp) {


    }
});

module.exports.unshare = function(req, resp){
    if(req.body.bookmark_id && req.body.user_id) {
        Bookmark.forge({id: req.body.bookmark_id}).unshareSecure(req.session.userId, req.body.user_id).then(function(m){
            resp.send(m);
        },function(m){
            resp.status(400).send(m);
        })
    } else {
        resp.status(400).send("bookmark or user were not specified");
    }
}