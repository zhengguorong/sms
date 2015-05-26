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
          name: $scope.user.name || $scope.user.mobilePhone,
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
    $scope.frames = ["A", "B", "C", "D","E","F","G","H","I","j","K","L","M","N"];

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
  .controller('MessageCtrl', function ($scope, $stateParams,Template) {
    $scope.templates = [];
    $scope.selectedTemplate={};
    var getList = function () {
      Template.getByUserId()
        .then(function (data) {
          $scope.templates = data;
          $scope.selectedTemplate=data[0];
        })
        .catch();
    }
    $scope.$on('$ionicView.beforeEnter', function() {
      getList();
    });

  })
  .controller('SearchCtrl', function ($scope, $stateParams) {

  })
  .controller('ManagerCtrl', function ($scope) {

  })
  .controller('TemplistCtrl', function ($scope, $http, Template,$state) {
    $scope.templates = [];
    $scope.edit = function (template) {
      $state.go("tab.tempedit",{id:template._id})
    }
    $scope.delete = function (template) {
      $http.delete("/api/templates/" + template._id).
        success(function (data) {
          getList();
        })
    }
    $scope.add = function () {
      $state.go("tab.tempAdd");
    }
    var getList = function () {
      Template.getByUserId()
        .then(function (data) {
          $scope.templates = data;
        })
        .catch();
    }
    $scope.$on('$ionicView.beforeEnter', function() {
      getList();
    });
  }
)
  .controller('TempeditCtrl', function ($scope,Template,$stateParams,$state) {
    $scope.template={};
    var getTemplate=function(id){
      Template.getById(id)
        .then(function(data){
          $scope.template=data;
        })
        .catch();
    }
    $scope.updateChecked = function (value) {
      if (!value) {
        $scope.template.content = $scope.template.content.replace("快递编号#编号#", "");
      } else {
        $scope.template.content = "快递编号#编号#" + ($scope.template.content || "");
      }
    }
    $scope.updateTempplate = function (form) {
      $scope.submitted = true;
      if (form.$valid) {
        Template.updateTemplate($scope.template)
          .then(function(data){
            $state.go("tab.templist");
          })
          .catch();
      }
    }
    var id=$stateParams.id;
    getTemplate(id);
  })
  .controller('TempaddCtrl', function ($scope,Template,$state) {
    $scope.template = {
      content: "快递编号#编号#",
      isIncludeNum: true
    };
    $scope.updateChecked = function (value) {
      if (!value) {
        $scope.template.content = $scope.template.content.replace("快递编号#编号#", "");
      } else {
        $scope.template.content = "快递编号#编号#" + ($scope.template.content || "");
      }
    }
    $scope.addTempplate = function (form) {
      $scope.submitted = true;
      if (form.$valid) {
        Template.addTemplate($scope.template)
          .then(function(data){
            $state.go("tab.templist");
          })
          .catch();
      }
    }

  });
