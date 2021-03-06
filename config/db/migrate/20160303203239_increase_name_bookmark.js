
exports.up = function(knex, Promise) {
    return knex.schema.table("bookmarks", function (t) {
        t.dropColumn("name");
    }).then(function () {
        return knex.schema.table("bookmarks", function (t) {
            t.text("name");
        });
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table("bookmarks", function (t) {
        t.dropColumn("name");
    }).then(function () {
        return knex.schema.table("bookmarks", function (t) {
            t.string("name", 20);
        });
    });
};
