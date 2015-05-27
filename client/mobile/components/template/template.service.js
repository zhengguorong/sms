'use strict'

angular.module('starter')
  .factory('Template',function Template($location, $rootScope, $http, $q){
    return {
      getByUserId:function(callback){
        var cb = callback || angular.noop;
        var deferred = $q.defer();
        $http.get("/api/templates").
          success(function(data,status){
            deferred.resolve(data);
            return cb();
          })
          .error(function(err){
            deferred.resolve(data);
            return cb();
          }.bind(this));
        return deferred.promise;
      },
      addTemplate:function(template,callback){
        var cb = callback || angular.noop;
        var deferred = $q.defer();
        $http.post('/api/templates',template)
          .success(function (data) {
            deferred.resolve(data);
            return cb();
          })
          .error(function(err){
            deferred.resolve(data);
            return cb();
          }.bind(this));
        return deferred.promise;
      },
      updateTemplate:function(template,callback){
        var cb = callback || angular.noop;
        var deferred = $q.defer();
        $http.put('/api/templates/'+template._id,template)
          .success(function (data) {
            deferred.resolve(data);
            return cb();
          })
          .error(function(err){
            deferred.resolve(data);
            return cb();
          }.bind(this));
        return deferred.promise;
      },
      getById:function(templateId,callback){
        var cb = callback || angular.noop;
        var deferred = $q.defer();
        $http.get('/api/templates/'+templateId)
          .success(function (data) {
            deferred.resolve(data);
            return cb();
          })
          .error(function(err){
            deferred.resolve(data);
            return cb();
          }.bind(this));
        return deferred.promise;
      },
      deleteById:function(templateId,callback){
        var cb = callback || angular.noop;
        var deferred = $q.defer();
        $http.delete('/api/templates/'+templateId)
          .success(function (data) {
            deferred.resolve(data);
            return cb();
          })
          .error(function(err){
            deferred.resolve(data);
            return cb();
          }.bind(this));
        return deferred.promise;
      }
    }
})
