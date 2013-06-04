var timeclock = angular.module("timeclock", [])
.config(function($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
    .when("/timeclock", { controller: "clock", templateUrl: "/timeclock/app/views/clock.html" })
    .when("/timeclock/admin/", { controller: "edit", templateUrl: "/timeclock/app/views/edit.html" })
    .when("/timeclock/admin/report", { controller: "report", templateUrl: "/timeclock/app/views/report.html" })
    .when("/timeclock/admin/users", { controller: "users", templateUrl: "/timeclock/app/views/users.html" })
    .otherwise({ redirectTo: '/timeclock' });
});