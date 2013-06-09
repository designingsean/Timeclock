var timeclock = angular.module("timeclock", [])
.config(function($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
    .when("/timeclock", { controller: "clock", templateUrl: "/timeclock/app/views/clock.html" })
    .when("/timeclock/admin/", { controller: "edit", templateUrl: "/timeclock/app/views/edit.html" })
    .when("/timeclock/admin/report", { controller: "report", templateUrl: "/timeclock/app/views/report.html" })
    .when("/timeclock/admin/users", { controller: "users", templateUrl: "/timeclock/app/views/users.html" })
    .otherwise({ redirectTo: '/timeclock' });
})
.directive('payperiod', function() {
    return {
        restrict: 'E',
        require: '?ngModel',
        transclude: false,
        templateUrl: '/timeclock/app/partials/payperiod.html',
        replace: true,
        scope : {
            'ngModel': 'attribute'
        },
        controller: function ($scope, $http, payperiodFactory, model) {
            console.log('here');
            var periodDates = payperiodFactory.periodDates(model.$currentDate);
            $http.get("/timeclock/api/?action=clockGet&user=" + $scope.currentUser + "&start=" + periodDates.firstWeekStart + "&end=" + periodDates.firstWeekEnd).success(function(response) {
                //$scope.firstWeekTotal = getTotal(response);
                $scope.firstWeek = response;
            });
            $http.get("/timeclock/api/?action=clockGet&user=" + $scope.currentUser + "&start=" + periodDates.secondWeekStart + "&end=" + periodDates.secondWeekEnd).success(function(response) {
                //$scope.secondWeekTotal = getTotal(response);
                $scope.secondWeek = response;
            });
            $scope.totalCurrent = $scope.firstWeekTotal + $scope.secondWeekTotal;
        }
    };
});
timeclock.factory('payperiodFactory', function() {
    var dateStart = (Date.create('2013-01-07').getISOWeek())%2;
    var dateEnd = (Date.create('2013-01-20').getISOWeek())%2;
    return {
        periodDates : function(date) {
            var dateObj = {};
            date = Date.create(date);
            if (date.getISOWeek()%2 === dateStart) {
                date.isSunday() ? date.rewind({ days: 6 }) : date.beginningOfWeek().advance({ days:1 });
            } else {
                date.isSunday() ? date : date.beginningOfWeek().rewind({ days: 6 });
            }
            dateObj['firstWeekStart'] = date.format('{yyyy}-{MM}-{dd}');
            dateObj['firstWeekEnd'] = Date.create(date).advance({ days: 6 }).format('{yyyy}-{MM}-{dd}');
            dateObj['secondWeekStart'] = Date.create(date).advance({ days: 7 }).format('{yyyy}-{MM}-{dd}');
            dateObj['secondWeekEnd']  = Date.create(date).advance({ days: 13 }).format('{yyyy}-{MM}-{dd}');
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