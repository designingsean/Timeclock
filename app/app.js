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
timeclock.factory('usersApi', ['$http', function($http) {
    return {
        add : function(name) {
            //
        },
        get : function(active, callback) {
            $http.get("/timeclock/api/?action=usersGet&active=" + active)
                .success(function(response) {
                    callback(null, response);
                })
                .error(function(response) {
                    callback(response, null);
                });
        },
        update : function(id) {
            //
        }
    };
}]);
timeclock.factory('clockApi', ['$http', function($http) {
    return {
        add : function(user, start, end) {
            //
        },
        clockIn : function(user, callback) {
            $http.get("/timeclock/api/?action=clockAdd&user=" + user)
                .success(function(response) {
                    callback(null, response);
                })
                .error(function(response) {
                    callback(response, null);
                });
        },
        get : function(user, start, end, callback) {
            $http.get("/timeclock/api/?action=clockGet&user=" + user + "&start=" + start + "&end=" + end)
                .success(function(response) {
                    callback(null, response);
                })
                .error(function(response) {
                    callback(response, null);
                });
        },
        getLast : function(user, callback) {
            $http.get("/timeclock/api/?action=clockGet&user=" + user)
                .success(function(response) {
                    callback(null, response);
                })
                .error(function(response) {
                    callback(response, null);
                });
        },
        update : function(id, start, end) {
            //
        },
        clockOut : function(user, callback) {
            getLast(user, function(err, response) {
                console.log(response);
                $http.get("/timeclock/api/?action=clockUpdate&id=" + id + "&end=" + end)
                    .success(function(response) {
                        callback(null, response);
                    })
                    .error(function(response) {
                        callback(response, null);
                    });
            });
        },
        delete : function(id) {
            //
        }
    };
}]);
timeclock.factory('payperiodFactory', function() {
    var dateStart = (Date.create('2013-01-07').getISOWeek())%2;
    return {
        periodDates : function(date) {
            var dateObj = {};
            date = Date.create(date);
            if (date.getISOWeek()%2 === dateStart) {
                date.isSunday() ? date.rewind({ days: 6 }) : date.beginningOfWeek().advance({ days:1 });
            } else {
                date.isSunday() ? date.rewind({ days:13 }) : date.beginningOfWeek().rewind({ days: 6 });
            }
            dateObj['firstWeekStart'] = date.format('{yyyy}-{MM}-{dd}');
            dateObj['firstWeekEnd'] = Date.create(date).advance({ days: 7 }).format('{yyyy}-{MM}-{dd}');
            dateObj['secondWeekStart'] = Date.create(date).advance({ days: 7 }).format('{yyyy}-{MM}-{dd}');
            dateObj['secondWeekEnd']  = Date.create(date).advance({ days: 14 }).format('{yyyy}-{MM}-{dd}');
            return dateObj;
        }
    };
});
timeclock.factory('totaltimeFactory', function() {
    return {
        getTotal : function(obj) {
            var total = 0;
            angular.forEach(obj, function(value, key) {
                if (value.totalTime !== null)
                    total += (value.totalTime).toNumber();
            });
            return total.round(2);
        }
    };
});