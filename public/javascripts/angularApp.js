var zumoApp = angular.module('zumoApp',[]);

zumoApp.controller('HomeController', ['$scope', function($scope) {
    $scope.segments = [
        {name: 'Big Hill', leader: 'Lance', dopeRank: 3},
        {name: 'Sprint thru the crosswalk', leader: 'Douche McGavin', dopeRank: 2},
        {name: 'Cote du Starbucks', leader: 'Frumunda Mabalz', dopeRank: 2},
        {name: 'Lorem Ipsum', leader: 'Lorizzle Mshizzle', dopeRank: 1}
    ];
    $scope.getNumber = function(num) {
        return new Array(num);   
    }
}]);
