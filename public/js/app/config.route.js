var PAGES_URL = "/html/pages/";

angular.module("app").run(["$rootScope", "$state", "$stateParams", function ($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

}]).config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/overview");
    $stateProvider
        .state("app",{
            abstract: true,
            templateUrl: PAGES_URL + "/app.html",
            controller: "appController",
            resolve:{
                currentUser: ["$ocLazyLoad", "$injector", "$rootScope", "$state", function ($ocLazyLoad, $injector, $rootScope, $state) {
                    return $ocLazyLoad.load(["/js/app/services/userService.js", "/js/app/services/notificationService.js"]).then(function(){
                        var userService = $injector.get("userService");
                        return userService.getCurrentUser();
                    }).then(function(user){
                        $rootScope.currentUser = user;
                    },  function( ){
                        $state.go("login");
                    });
                }]
            }
        })
        .state("login",{
            url: "/login",
            templateUrl: PAGES_URL + "/login.html",
            controller: "loginController",
            resolve: {
                files: ["$ocLazyLoad", function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        "/assets/bundles/js/login.js"
                    ]);
                }],
                currentUser: ["$ocLazyLoad", "$injector", "$rootScope", "$state", function ($ocLazyLoad, $injector, $rootScope, $state) {
                    return $ocLazyLoad.load(["/assets/js/app/services/userService.js", "/assets/js/app/services/notificationService.js"]).then(function(){
                        var userService = $injector.get("userService");
                        return userService.getCurrentUser();
                    }).then(function(user){
                        if(user) {
                            $state.go("app.overview");
                        }
                    }, function () {
                        
                    });
                }]}
        })
        .state("logout",{
            controller: "logoutController",
            resolve: ["$ocLazyLoad", function($ocLazyLoad){
                return $ocLazyLoad.load([
                    "/assets/js/app/controllers/logoutController.js"
                ]);
            }]
        })
        .state("register",{
            url: "/register",
            templateUrl: PAGES_URL + "/register.html",
            controller: "registerController",
            resolve: ["$ocLazyLoad", function($ocLazyLoad){
                return $ocLazyLoad.load(["/assets/bundles/js/register.js"]);
            }]
        })
        .state("app.overview",{
            url: "/overview",
            templateUrl: PAGES_URL + "/overview.html",
            resolve: {
                files:
                ["$ocLazyLoad", function($ocLazyLoad){
                                    return $ocLazyLoad.load([
                                        "/assets/bundles/js/overview.js"
                                    ]);
                    }
                ],
                preferedView: ["$ocLazyLoad", "$injector", function ($ocLazyLoad, $injector) {
                    return $ocLazyLoad.load("/assets/js/app/services/preferencesService.js").then(function () {
                        var preferencesService = $injector.get("preferencesService");
                        return preferencesService.getOverviewListView();
                    });
               }],
                branches: ["$ocLazyLoad", "$injector", function ($ocLazyLoad, $injector) {
                    return $ocLazyLoad.load("/assets/js/app/services/branchService.js").then(function () {
                        var branchService = $injector.get("branchService");
                        return branchService.all();
                    })
                }]
            },
            controller: "overviewController"
        })
        .state("app.shared", {
            url: "/shared",
            templateUrl: PAGES_URL + "/shared.html",
            resolve: ["$ocLazyLoad", function($ocLazyLoad){
                return $ocLazyLoad.load(["/assets/js/app/controllers/sharedController.js"]);
            }],
            controller: "sharedController"
        })
        .state("app.user", {
            url: "/user/:id",
            templateUrl: PAGES_URL + "/user.html",
            resolve: {
                files: ["$ocLazyLoad", function($ocLazyLoad){
                    return $ocLazyLoad.load(["/assets/bundles/js/user.js"]);
                }],
                user: ["userService", "$stateParams", function (userService, $stateParams) {
                    return userService.get($stateParams.id);
                }]
            },
            controller: "userController"
        })
        .state("app.profile", {
            url: "/profile",
            templateUrl: PAGES_URL + "/profile.html",
            resolve: ["$ocLazyLoad", function($ocLazyLoad){
                return $ocLazyLoad.load(["/assets/bundles/js/profile.js"]);
            }],
            controller: "profileController"
        })
        //.state("app.plan", {
        //    url: "/plan",
        //    templateUrl: PAGES_URL + "/plan.html",
        //    resolve: ["$ocLazyLoad", function($ocLazyLoad){
        //        return $ocLazyLoad.load([
        //            "/js/app/controllers/planController.js"]);
        //    }],
        //    controller: "planController"
        //})
        .state("app.friends", {
            url: "/friends",
            templateUrl: PAGES_URL + "/friends.html",
            resolve: {
                files: ["$ocLazyLoad", function($ocLazyLoad){
                return $ocLazyLoad.load(["/assets/bundles/js/friends.js"]);
                }],
                friends: ["friendsService", function(friendsService){
                    return friendsService.all();
                }],
                isFriendsBranchesDisplayModeList: ["$ocLazyLoad", "$injector", function ($ocLazyLoad, $injector) {
                    return $ocLazyLoad.load("/js/app/services/preferencesService.js").then(function () {
                        var preferencesService = $injector.get("preferencesService");
                        return preferencesService.getFriendsBranchListView();
                    })
                }],
                isFriendsBookmarksDisplayModeList: ["$ocLazyLoad", "$injector", function ($ocLazyLoad, $injector) {
                    return $ocLazyLoad.load("/js/app/services/preferencesService.js").then(function () {
                        var preferencesService = $injector.get("preferencesService");
                        return preferencesService.getFriendsBookmarkListView();
                    })
                }]
            },
            controller: "friendsController"
        })
        .state("app.branch", {
            url: "/branch/:id/:name",
            templateUrl: PAGES_URL + "bookmarks.html",
            resolve: {
                files: ["$ocLazyLoad", function($ocLazyLoad){
                    return $ocLazyLoad.load(["/js/app/controllers/bookmarksController.js"]);
                }],
                bookmarks: ["bookmarkService", "$stateParams", function(bookmarkService, $stateParams){
                     return bookmarkService.allByBranch($stateParams.id);
                }],
                branch: ["branchService", "$stateParams", function (branchService, $stateParams) {
                    return branchService.get($stateParams.id);
                }],
                bookmarksDisplayMode: ["$ocLazyLoad", "$injector", function ($ocLazyLoad, $injector) {
                    return $ocLazyLoad.load("/js/app/services/preferencesService.js").then(function () {
                        var preferencesService = $injector.get("preferencesService");
                        return preferencesService.getBookmarkListView();
                    })
                }]
            },
            controller: "bookmarksController"
        })
        .state("app.notifications", {
            url: "/notifications",
            templateUrl: PAGES_URL + "notifications.html",
            resolve: {
                files: ["$ocLazyLoad", function($ocLazyLoad){
                    return $ocLazyLoad.load(["/js/app/controllers/notificationsController.js",
                                             "/js/app/services/notificationService.js"]);
                }],
                notifications: ["notificationService", function (notificationsService) {
                    return notificationsService.all();
                }]
            },
            controller: "notificationsController"
        })
}]);



