angular.module('starter.controllers', [])
  .controller('LoginCtrl', function ($scope, Auth, $location) {
    $scope.user = {};
    $scope.errors = {};

    $scope.login = function (form) {
      $scope.submitted = true;

      if (form.$valid) {
        Auth.login({
          mobilePhone: $scope.user.mobilePhone,
          password: $scope.user.password
        })
          .then(function () {
            // Logged in, redirect to home
            $location.path('/');
          })
          .catch(function (err) {
            $scope.errors.other = err.message;
          });
      }
    };

  })
  .controller('RegisterCtrl', function ($scope, Auth, $location) {
    $scope.user = {};
    $scope.errors = {};

    $scope.register = function (form) {
      $scope.submitted = true;

      if (form.$valid) {
        Auth.createUser({
          name: $scope.user.name||$scope.user.mobilePhone,
          mobilePhone: $scope.user.mobilePhone,
          email: $scope.user.email,
          password: $scope.user.password
        })
          .then(function () {
            // Account created, redirect to home
            $location.path('/');
          })
          .catch(function (err) {
            err = err.data;
            $scope.errors = {};

            // Update validity of form fields that match the mongoose errors
            angular.forEach(err.errors, function (error, field) {
              form[field].$setValidity('mongoose', false);
              $scope.errors[field] = error.message;
            });
          });
      }
    };

  })
  .controller('DashCtrl', function ($scope) {
    // 架号
    $scope.item = {
      selectFrame: "A",
      lattice: "",
      num: "",
      mobile: ""
    }
    $scope.frames = ["A", "B", "C", "D"];

    function addItem() {
    }

    //添加的历史
    $scope.items = [];
    function addItem() {
      var item = {};
      item.selectFrame = $scope.item.selectFrame;
      item.lattice = $scope.item.lattice;
      item.num = $scope.item.num;
      item.mobile = $scope.item.mobile;
      $scope.items.push(item);
      $scope.item.num = Number($scope.item.num) + 1
      clearItem();
    }

    function clearItem() {
      $scope.item.mobile = ""
    }

    $scope.mobileChange = function () {
      if ($scope.item.mobile.length == 11) {
        addItem();
      }
    }
    $scope.clearList = function () {
      $scope.items = [];
    }

  })
  .controller('MessageCtrl', function ($scope, $stateParams) {

  })
  .controller('SearchCtrl', function ($scope, $stateParams) {

  })
  .controller('ManagerCtrl', function ($scope) {

  })
  .controller('TemplistCtrl', function ($scope) {
    $scope.edit = function () {
      window.location.href = "#/tab/tempedit/1";
    }
    $scope.add=function(){
      window.location.href="#/tab/tempadd";
    }
  })
  .controller('TempeditCtrl', function ($scope) {

  })
    .controller('TempaddCtrl', function ($scope) {

  });
