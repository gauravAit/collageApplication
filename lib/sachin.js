
    var records = {};
    records.overAllBattingSecond = {Inns:0, NO:0, Runs:0,	HS:0,	Avg:0, hundreds:0, fifties:0 , wickets:0};
    records.overAllBattingFirst = {Inns:0, NO:0, Runs:0,	HS:0,	Avg:0, hundreds:0, fifties:0 , wickets:0};
    records.outSideIndia = {Inns:0, NO:0, Runs:0,	HS:0,	Avg:0, hundreds:0, fifties:0 , wickets:0};
    records.inIndia = {Inns:0, NO:0, Runs:0,	HS:0,	Avg:0, hundreds:0, fifties:0 , wickets:0};
    records.winningCause = {Inns:0, NO:0, Runs:0,	HS:0,	Avg:0, hundreds:0, fifties:0 , wickets:0};
    records.losingCause = {Inns:0, NO:0, Runs:0,	HS:0,	Avg:0, hundreds:0, fifties:0 , wickets:0};
    records.secondInningsWon = {Inns:0, NO:0, Runs:0,	HS:0,	Avg:0, hundreds:0, fifties:0 , wickets:0};
    records.beforeTwoK = {Inns:0, NO:0, Runs:0,	HS:0,	Avg:0, hundreds:0, fifties:0 , wickets:0};
    records.afterTwoK = {Inns:0, NO:0, Runs:0,	HS:0,	Avg:0, hundreds:0, fifties:0 , wickets:0};
    records.againstEachTeam = {};
    records.total = {Inns:0, NO:0, Runs:0,	HS:0,	Avg:0, hundreds:0, fifties:0 , wickets:0};

    var indianCities = ['Ahmedabad','Amritsar','Bengaluru','Chandigarh','Chennai','Cuttack','Delhi','Dharamshala','Faridabad',
        'Guwahati','Gwalior','Hyderabad','Hyderabad','Indore','Jaipur','Jalandhar','Jamshedpur','BJodhpur','Kanpur','Kochi',
        'Kolkata','Margao','Mohali','Mumbai','Nagpur','New Delhi','Pune','Rajkot','Ranchi','Thiruvananthapuram','Vadodara',
      'Vijayawada','Visakhapatnam'
    ];
    var app = angular.module('stats', []);

    app.directive('recordTab', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
              t: '=src',
              title:'=title'
            },
            template:'<div class="container">'+
                        '<h3>{{title}}</h3>'+
                        '<table  class="table table-striped">'+
                          '<tr>'+
                            '<th ng-repeat="(key, value) in t">{{key}}</th>'+
                          '</tr>'+
                          '<tr>'+
                            '<td ng-repeat="(key, value) in t">'+
                                '{{value}}'+
                            '</td>'+
                          '</tr>'+
                        '</table>'+
                      '</div>'
        };
    });

    app.controller('statsController', ['$scope',function($scope){
      //$scope.createRecord();
      $scope.records = {};
      $scope.getStat = function(type) {
          if(!$scope.records){
            return null;
          }
          return $scope.records[type];
        };
      $scope.getTeams = function(){
        if(!$scope.records.againstEachTeam){
          return null;
        }
        return Object.keys($scope.records.againstEachTeam);
      }
      $scope.getTeamStat = function(team){
        return $scope.records.againstEachTeam[team]
      }

        $scope.tab = "Total";

        $scope.setTab = function (tabId) {
            $scope.tab = tabId;
        };

        $scope.isSet = function (tabId) {
            return $scope.tab === tabId;
        };

        $scope.getTabTitle = function(tabId){
          return tabId.replace( /([A-Z])/g, " $1" );
        }

        Papa.parse("sachin.csv", {
          download: true,
          header: true,
          complete: function(results) {
            var count = 0;
            results.data.forEach(d => {
              var against = "";
              count ++ ;
              if(count >= 462){
                var k =5;
              }
              if(d.opposition){
                against = d.opposition.substr(2,d.opposition.length)
              }
              if(d.batting_innings == "2nd"){
                updateRecord(records.overAllBattingSecond,d);
              }else{
                updateMirrorHighestScore(records.overAllBattingFirst,d)
              }
              if(indianCities.indexOf(d.ground) >= 0){
                updateRecord(records.inIndia,d);
              }else{
                updateMirrorHighestScore(records.outSideIndia,d)
              }
              if(d.match_result == "won"){
                updateRecord(records.winningCause,d);
                if(d.batting_innings == "2nd"){
                  updateRecord(records.secondInningsWon,d);
                }
              }else{
                updateMirrorHighestScore(records.losingCause,d);
              }
              if(d.date){
                if(parseInt(d.date.substr(d.date.length - 4,d.date.length)) <= 2000){
                  updateRecord(records.beforeTwoK,d)
                }
              }else{
                updateMirrorHighestScore(records.afterTwoK,d);
              }
              if(against){
                if(!records.againstEachTeam[against]){
                  records.againstEachTeam[against] = {Inns:0, NO:0, Runs:0,	HS:0,	Avg:0, hundreds:0, fifties:0 , wickets:0};
                }
                updateRecord(records.againstEachTeam[against],d);
              }
              updateRecord(records.total,d);
            });
            updateMirrorImage(records.overAllBattingFirst,records.overAllBattingSecond);
            updateMirrorImage(records.outSideIndia,records.inIndia);
            updateMirrorImage(records.afterTwoK,records.beforeTwoK);
            updateMirrorImage(records.losingCause,records.winningCause);
            updateAverage();
            $scope.records = records;
            $scope.$apply();
          }
        });


    }]);

    function updateRecord(type,record){
      var runs = parseInt(record.batting_score) ? parseInt(record.batting_score) : 0;
      type.Inns += 1;
      type.wickets += parseInt(record.wickets) ? parseInt(record.wickets) : 0;
      type.Runs += runs;
      if(type.HS < runs){
        type.HS = runs;
      }

      if(/DNB|\*/.test(record.batting_score)){
        type.NO += 1;
      }
      if(runs >= 50 ){
        if(runs >= 100){
          type.hundreds += 1;
        }else{
          type.fifties += 1;
        }
      }
    };

    function updateMirrorImage(image, item){
      Object.keys(item).forEach(function(key){
        if(key == "HS"){
          return;
        }
        image[key] = records.total[key] - item[key];
      });
    }
    function updateAverage(){
      Object.keys(records).forEach(function(key){
        if(key == 'againstEachTeam'){
          Object.keys(records.againstEachTeam).forEach(function(key){
            var item = records.againstEachTeam[key];
            item.Avg = (item.Runs/(item.Inns -  item.NO)).toFixed(2);
          });
          return;
        }else{
          var item = records[key]
        }
        item.Avg = (item.Runs/(item.Inns -  item.NO)).toFixed(2);
      });
    }

    function updateMirrorHighestScore(type,record){
      var runs = parseInt(record.batting_score) ? parseInt(record.batting_score) : 0;
      if(type.HS < runs){
        type.HS = runs;
      }
    }
