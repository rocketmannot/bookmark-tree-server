var bookshelf = require ('../../config/db/bookshelf');

var Bookmark = require("./bookmark");

module.exports = bookshelf.Model.extend({
    tableName: "comments",

    bookmark: function () {
        return this.belongsTo(Bookmark);
    }
});