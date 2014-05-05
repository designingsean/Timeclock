timeclock.controller('users', function users($scope, usersApi) {
    $scope.newUser = '';

    getUsers();

    function getUsers() {
        $scope.newUser = '';
        usersApi.get(true).then(function(response) {
            $scope.activeUsers = response.data;
        });
        usersApi.get(false).then(function(response) {
            $scope.inactiveUsers = response.data;
        });
    }

    $scope.addUser = function() {
        usersApi.add($scope.newUser).then(function () {
            getUsers();
        });
    };

    $scope.updateUser = function(user) {
        usersApi.update(user.id).then(function() {
            getUsers();
        });
    };

});