angular.module('starter.controllers', ['starter.services'])

.controller('AppCtrl', function($scope, $ionicModal, $log, $timeout, trackInfoService) {
  
  $scope.loadError = false;
  $scope.categories = [];

  $scope.reloadCategories = function(){
      trackInfoService.getCategories().then(
    function(data){
      $scope.categories = data;
      $scope.loadError = false;
    },
    function(errorPayload) {
        $log.error('failure loading categories', errorPayload);
        $scope.loadError = true;
    });
  };

  $scope.reloadCategories();
  

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

})

.controller('HomeCtrl', function($scope, $timeout, $log, trackInfoService) {
var WTF = false;
  // $scope.showInfinite = false;
  $scope.scrollInfo = {};
  $scope.scrollInfo.page = 0;
  $scope.scrollInfo.limit = 3;
  $scope.scrollInfo.newTracks = [];
  $scope.scrollInfo.noMoreTracks = false;
  
  $scope.doRefresh = function(){
    $scope.scrollInfo = {};
    $scope.scrollInfo.page = 0;
    $scope.scrollInfo.limit = 3;
    $scope.scrollInfo.newTracks = [];
    $scope.scrollInfo.noMoreTracks = false;
    $scope.loadMore();
    $scope.$broadcast('scroll.refreshComplete');
  };

  $scope.loadMore = function(){
    
    console.log($scope.scrollInfo.page);
    if(WTF){
      return false;
    }
    WTF = true;

    trackInfoService.findNew($scope.scrollInfo).then(
      function(fetchedTracks) {
        $log.log(fetchedTracks);
        if(fetchedTracks.length < 1){
          $scope.scrollInfo.noMoreTracks = true;
        }
        fetchedTracks.forEach(function(track){
          // $log.log(track);
          $scope.scrollInfo.newTracks.push(track);
        });
        // $scope.$broadcast('scroll.refreshComplete');
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.scrollInfo.page++;
        // $scope.showInfinite = true;
        WTF=false;
      }
    );
  };

  // $scope.loadMore();

  $scope.moreDataCanBeLoaded = function(){
    if($scope.scrollInfo.page > 5 || $scope.scrollInfo.noMoreTracks ){
      return false;
    }else{
      return true;
    }
  };
})

.controller('SearchCtrl', function($scope, $log, trackInfoService) {

  $scope.searchData ={};
  $scope.searchData.results = [];
  $scope.searchData.nothingFound = false;

  $scope.clearInput = function(){
    $scope.searchData.searchTerm = "";
  };
  $scope.runSearch = function(){
    // $log.log($scope.form.searchTerm);
    $scope.searchData.results = [];
      trackInfoService.findTracks($scope.searchData.searchTerm).then(
        function(results) {
          $log.log(results);
          if(results.length>0){
            $scope.searchData.nothingFound = false;
            $scope.searchData.results = results;
          }else{
            $scope.searchData.nothingFound =true;
          }
        }
      );
  };

  $scope.getItemHeight = function(item, index) {
    //Make evenly indexed items be 10px taller, for the sake of example
    return (index % 2) === 0 ? 50 : 60;
  };

})

.controller('FavoritesCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Fave1', id: 1 },
    { title: 'Fave2', id: 2 },
    { title: 'Fave3', id: 3 }
  ];
})

.controller('CategoryCtrl', function($scope, $stateParams, $log, $ionicLoading, trackInfoService) {
  $scope.loadError = false;
  $ionicLoading.show({
    template: '<i class="icon ion-loading-c"></i> Loading...'
  });

  $scope.loadCatTracks = function(){
    trackInfoService.getCategoryTracks($stateParams.category).then(
    function(categoryTracks){
      console.log(categoryTracks);
      $scope.pageTitle = categoryTracks.name;
      $scope.results = categoryTracks.tracks;
      $ionicLoading.hide();
      $scope.loadError = false;
    },
    function(errorPayload) {
        $log.error('failure loading category tracks', errorPayload);
        $scope.loadError = true;
        $ionicLoading.hide();
    });
  };
  
  $scope.loadCatTracks();

})

.controller('PlayerCtrl', function(  $scope, $stateParams, $ionicLoading, trackInfoService) {
    
  $ionicLoading.show({
    template: '<i class="icon ion-loading-c"></i> Loading...'
  });

  $scope.currTrack = {};
  $scope.currTrack.isPlaying = false;

    //call service to get track data from id
  trackInfoService.getTrackData($stateParams.trackid).then(
    function(fetchedTrack){

      console.log(fetchedTrack);
      $scope.trackData = fetchedTrack;
      $scope.pageTitle = $scope.trackData.title;

      $scope.playlist1[0] = {src:$scope.trackData.stream_url, type:$scope.trackData.file_type};
      $ionicLoading.hide();
      // console.log($scope.playlist1);
    }
  );
  
  

  $scope.seekPercentage = function ($event) {
    var percentage = ($event.offsetX / $event.target.offsetWidth);
    if (percentage <= 1) {
      return percentage;
    } else {
      return 0;
    }
  };
  
  $scope.currTrack.playerControl = function(){

    $scope.currTrack.isPlaying = !$scope.currTrack.isPlaying;
    $scope.audio1.playPause();

    $scope.$watch('audio1.ended',function(){
      if($scope.audio1.ended){
        console.log("ended do something");
         $scope.currTrack.isPlaying = !$scope.currTrack.isPlaying;
      }
    });
  }

  $scope.currTrack.addFavorite = function(){
    console.log("add favorite");
  }

  


})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
