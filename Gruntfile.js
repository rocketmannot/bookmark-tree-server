
var DB_CONNECTION = {
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'Ur@n!um824',
        database: 'tree'
    }
};

module.exports = function(grunt) {
    grunt.initConfig({
        knexmigrate: {
            config: {
                directory: './config/db/migrate',
                tableName: 'knex_migrations',
                database: DB_CONNECTION
            }
        },
        knexseed: {
            config: {
                directory: './config/db/seeds',
                database: DB_CONNECTION
            }
        }
    });

    grunt.loadNpmTasks('grunt-knexseed');
    grunt.loadNpmTasks('grunt-knex-migrate');

    grunt.registerTask("setupDB", ['knexmigrate:latest', 'knexseed:run']);
};