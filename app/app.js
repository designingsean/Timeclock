var timeclock = angular.module("timeclock", [])
.config(function($locationProvider, $routeProvider) {
    $routeProvider
        .when("/", { controller: "clock", templateUrl: "app/views/clock.html" })
        .when("/admin/", { controller: "admin", templateUrl: "app/views/admin.html" })
        .when("/admin/edit", { controller: "edit", templateUrl: "app/views/edit.html" })
        .when("/admin/users", { controller: "users", templateUrl: "app/views/users.html" })
        .otherwise({ redirectTo: '/timeclock' });
})
.factory('usersApi', ['$http', function($http) {
    return {
        add : function(name) {
            return $http({
                method: 'POST',
                url: "http://tlg.dev:3000/users",
                data: { name: name }
            });
        },
        get : function(active) {
            if (active) {
                return $http.get("http://tlg.dev:3000/users");
            } else {
                return $http.get("http://tlg.dev:3000/users/inactive");
            }
        },
        update : function(id) {
            return $http({
                method: 'PATCH',
                url: "http://tlg.dev:3000/users/" + id
            });
        }
    };
}])
.factory('clockApi', ['$http', function($http) {
    return {
        add : function(user, start, end) {
            return $http({
                method: 'POST',
                url: "http://tlg.dev:3000/clock",
                data: { user: user, start: start, end: end }
            });
        },
        clockIn : function(user) {
            return $http({
                method: 'POST',
                url: "http://tlg.dev:3000/clock",
                data: { user: user }
            });
        },
        get : function(user, start, end) {
            return $http({
                method: 'POST',
                url: "http://tlg.dev:3000/clock/range",
                data: { user: user, start: start, end: end }
            });
        },
        getLast : function(user) {
            return $http.get("http://tlg.dev:3000/clock/" + user);
        },
        clockOut : function(user, end) {
            return this.getLast(user).then(function(response) {
                return $http({
                    method: 'PUT',
                    url: "http://tlg.dev:3000/clock/" + response.data.id,
                    data: { end: end }
                });
            });
        },
        remove : function(id) {
            return $http({
                method: 'DELETE',
                url: "http://tlg.dev:3000/clock/" + id
            });
        }
    };
}])
.factory('payperiodFactory', function() {
    var dateStart = moment('2013-01-07').isoWeek()%2;
    return {
        periodDates : function(date) {
            var momentObj = {};
            momentDate = moment(date);
            if (momentDate.isoWeek()%2 === dateStart) {
                momentDate.day()===0 ? momentDate.day(-7) : momentDate.startOf('week').day(1);
            } else {
                momentDate.day()===0 ? momentDate.day(-13) : momentDate.startOf('week').day(-6);
            }
            momentObj['firstWeekStart'] = momentDate.format('YYYY-MM-DD');
            momentObj['secondWeekStart'] = momentObj['firstWeekEnd'] = moment(momentDate).day(8).format('YYYY-MM-DD');
            momentObj['secondWeekEnd']  = moment(momentDate).day(15).format('YYYY-MM-DD');
            return momentObj;
        }
    };
})
.factory('totaltimeFactory', function() {
    return {
        getTotal : function(obj) {
            var total = 0;
            angular.forEach(obj, function(value, key) {
                if (value.totalTime !== null)
                    total += Number(value.totalTime);
            });
            return total;
        }
    };
});