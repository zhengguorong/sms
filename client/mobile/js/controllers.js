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
  .controller('DashCtrl', function ($scope,sendItem) {
    // 架号
    $scope.item = {
      selectFrame: "A",
      lattice: "",
      num: "",
      mobile: ""
    }
    $scope.frames = ["A", "B", "C", "D","E","F","G","H","I","j","K","L","M","N"];


    //添加的历史
    $scope.items = [];
    function addItem() {
      var item = {};
      item.selectFrame = $scope.item.selectFrame;
      item.lattice = $scope.item.lattice;
      item.num = $scope.item.num;
      item.mobile = $scope.item.mobile;
      sendItem.addItem(item);
      $scope.items=sendItem.getItems();
      $scope.item.num = Number($scope.item.num) + 1
    }


    $scope.deleteByIndex=function(index){
      $scope.items.splice(index,1);
    }
    $scope.mobileChange = function () {
      if ($scope.item.mobile.length == 11) {
        addItem();
        $scope.item.mobile = ""
      }
    }
    $scope.clearList = function () {
      $scope.items.splice(0,$scope.items.length);
    }

  })
  .controller('MessageCtrl', function ($scope, $stateParams,Template,sendItem,$ionicPopup,$http) {

    $scope.templates = [];
    $scope.selectedTemplate={};
    var getList = function () {
      Template.getByUserId()
        .then(function (data) {
          var canUseTemplate=[];
          for(var i=0;i<data.length;i++){
            if(data[i].state=="SUCCESS"){
              canUseTemplate.push(data[i]);
            }
          }
          $scope.templates = canUseTemplate;
          $scope.selectedTemplate=$scope.templates[0];
        })
        .catch();
    }
    $scope.selectAction=function(template){
      $scope.selectedTemplate=template;
    }
    getList();
    //$scope.$on('$ionicView.beforeEnter', function() {
    //  getList();
    //});
    $scope.send=function(){
       var items=sendItem.getItems();
       if(items.length==0){
         $ionicPopup.alert({
           title: '提示!',
           template: '还没添加发送手机号'
         });
       }else{
          var reqItems=[];
          for(var i=0;i<items.length;i++){
            var reqItem=buildSendData(items[i],$scope.selectedTemplate);
            reqItems.push(reqItem);
          }
         $http.post("/api/sends",reqItems)
           .success(function(data){

           })
       }
    }
    //构造发送内容
    var buildSendData=function(item,template){
      var number;//货架号
      var reqItem={};
      if(item){
        number=item.selectFrame+item.lattice+"格"+item.num+"号";
        reqItem.mobilePhone=item.mobile;
        if(template.isIncludeNum){
          reqItem.content=template.content.replace("#编号#",number);
        }else{
          reqItem.content=template.content;
        }

      }
      return reqItem;

    }

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
      Template.deleteById(template._id)
        .then(function(){
          getList();
        })
    }
    $scope.add = function () {
      $state.go("tab.tempAdd");
    }
    var getList = function () {
      Template.getByUserId()
        .then(function (data) {
          data.forEach(function(template,index){
            var state=template.state;
            if(state=="CHECKING"){
              template.state="审核中";
            }else if(state=="SUCCESS"){
              template.state="审核通过";
            }else if(state=="FAIL"){
              template.state="审核不通过";
            }
          })
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
