var app = angular.module('sachinStats', []);
records = {};
records.overAllBattingSecond = {Inns:0, NO:0, Runs:0,	HS:0,	Avg:0, hundreds:0, fifties:0 , wickets:0};
records.overAllBattingFirst = {Inns:0, NO:0, Runs:0,	HS:0,	Avg:0, hundreds:0, fifties:0 , wickets:0};
records.outSideIndia = {Inns:0, NO:0, Runs:0,	HS:0,	Avg:0, hundreds:0, fifties:0 , wickets:0};
records.inIndia = {Inns:0, NO:0, Runs:0,	HS:0,	Avg:0, hundreds:0, fifties:0 , wickets:0};
records.winningCause = {Inns:0, NO:0, Runs:0,	HS:0,	Avg:0, hundreds:0, fifties:0 , wickets:0};
records.losingCause = {Inns:0, NO:0, Runs:0,	HS:0,	Avg:0, hundreds:0, fifties:0 , wickets:0};
records.secondInningsWon = {Inns:0, NO:0, Runs:0,	HS:0,	Avg:0, hundreds:0, fifties:0 , wickets:0};
records.againstEachTeam = {Inns:0, NO:0, Runs:0,	HS:0,	Avg:0, hundreds:0, fifties:0 , wickets:0};
records.beforeTwoK = {Inns:0, NO:0, Runs:0,	HS:0,	Avg:0, hundreds:0, fifties:0 , wickets:0};
records.afterTwoK = {Inns:0, NO:0, Runs:0,	HS:0,	Avg:0, hundreds:0, fifties:0 , wickets:0};
records.total = {Inns:0, NO:0, Runs:0,	HS:0,	Avg:0, hundreds:0, fifties:0 , wickets:0};

var indianCities = ['Ahmedabad','Amritsar','Bengaluru','Chandigarh','Chennai','Cuttack','Delhi','Dharamshala','Faridabad',
    'Guwahati','Gwalior','Hyderabad','Hyderabad','Indore','Jaipur','Jalandhar','Jamshedpur','BJodhpur','Kanpur','Kochi',
    'Kolkata','Margao','Mohali','Mumbai','Nagpur','New Delhi','Pune','Rajkot','Ranchi','Thiruvananthapuram','Vadodara',
  'Vijayawada','Visakhapatnam'
];
function statsController($scope) {
    $scope.records = records;
    createRecord();
    $scope.getStat(type) = function () {
        if(!$scope.records){
          return null;
        }
        return records[type];
    };
}


createRecord = function(){
  Papa.parse("sachin.csv", {
    download: true,
    header: true,
    complete: function(results) {
      results.data.forEach(d => {
        var against = d.opposition.substr(2,d.opposition.length);
        if(d.batting_innings == "2nd"){
          updateRecord(records.overAllBattingSecond,d);
        }
        if(indianCities.indexOf(d.ground) >= 0){
          updateRecord(records.inIndia,d);
        }
        if(d.match_result == "won"){
          updateRecord(records.winningCause,d);
          if(d.batting_innings == "2nd"){
            updateRecord(records.secondInningsWon,d);
          }
        }
        if(parseInt(d.date.substr(d.date.length - 4,d.date.length)) <= 2000){
          updateRecord(records.beforeTwoK,d)
        }
        if(!records[against]){
          records[against] = {Inns:0, NO:0, Runs:0,	HS:0,	Avg:0, hundreds:0, fifties:0 , wickets:0};
        }
        updateRecord(records[against],d);
        updateRecord(records.total,d);
      });
      updateMirrorImage(records.overAllBattingFirst,records.overAllBattingSecond);
      updateMirrorImage(records.outSideIndia,records.inIndia);
      updateMirrorImage(records.afterTwoK,records.beforeTwoK);
      updateRecord(records.losingCause,records.winningCause);
    }
  });
}

function updateRecord(type,record){
  type.Inns += 1;
  type.wickets += parseInt(record.wickets);
  type.Runs += parseInt(record.batting_score);
  var runs = parseInt(record.batting_score)
  if(type.HS < runs){
    type.HS = parseInt(record.batting_score)
  }
  if(record.batting_score.indexOf('*') >= 0){
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

function updateMirrorImage(item,image){
  Object.keys(item).forEach(function(key){
    image[key] = total.key - item.key;
  });
}
