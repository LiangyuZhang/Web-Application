(function() {

angular.module('App')
  .controller('loginController', loginController)
  .controller('TestCtrl', TestCtrl)
  .factory('nameService',nameService)

function nameService(){
  return{
    username: null
  }
}

loginController.$inject = ['loginService', 'userService','nameService', '$location']

function loginController(loginService, userService,nameService, $location) {
  var loginCtrl = this;
  

  loginCtrl.isValid = isValid;
  loginCtrl.validatePassword=loginCtrl;
  loginCtrl.validateEmail=validateEmail;
  loginCtrl.validateZip=validateZip;
  loginCtrl.validateName=validateName;
  

  loginCtrl.login_username = "";
  loginCtrl.login_password = "";

  loginCtrl.login = login;

  //loginCtrl.faceBookRedirect = faceBookRedirect;
  

  loginCtrl.username = "";
  loginCtrl.zipcode = "";
  loginCtrl.email = "";
  loginCtrl.password = "";
  loginCtrl.passwordConfirm = "";
  loginCtrl.errormsg=false;

  loginCtrl.getUsername=getUsername;

//check the input infor then log in to the main page, otherwise shown the error message
  function login() {
    loginCtrl.errormsg=false;

    loginService.login({'username': loginCtrl.login_username, 'password': loginCtrl.login_password}).$promise.then(function (result) {
        if (result.result === 'success') {
            $location.path('main');
        }
    })
    window.setTimeout(function(){loginCtrl.errormsg = !loginCtrl.errormsg}, 3000);
    
  }


//method used for the checking data sharing between controllers
  function getUsername() {    
      return nameService.username
  }
//the register infor
  function isValid() {
      var flag = true;
      registerMsg=false;
      loginCtrl.nameerr = false;
      if (!validateName(loginCtrl.username)) {
        loginCtrl.nameerr = true;
        flag = false;
      }

      loginCtrl.ziperr = false;
      if (!validateZip(loginCtrl.zipcode)) {
        loginCtrl.ziperr = true;
        flag = false;
      }
      loginCtrl.emailerr = false;
      if (!validateEmail(loginCtrl.email)) {
        loginCtrl.emailerr = true;
        flag = false;
      }

      loginCtrl.pwderr = false;
      if (!validatePassword(loginCtrl.password, loginCtrl.passwordConfirm)) {
        loginCtrl.pwderr = true;
        flag = false;
      }

      if(flag){
        loginCtrl.registerMsg=true;
      }

      loginCtrl.isShowSuccess = false;
      if (flag) {
        loginService.register({'username':loginCtrl.username, 'email':loginCtrl.email,
        'zipcode':loginCtrl.zipcode, 'password':loginCtrl.password}).$promise.then(function (result) {
          if (result.result == "success")
            loginCtrl.isShowSuccess = true;
        });
      }

  }


  function validatePassword(p1, p2) {
    if (p1 !== p2)
        return false;

    return true;
  }

  function validateEmail(email) {
    if (!email.match(/\S+@\S+\.\S+/))
        return false;

    return true;
  }

  function validateZip(zip) {
    if (!zip.match(/(^\d{5}$)|(^\d{5}-\d{4}$)/))
        return false;

    return true;
  }

  function validateName(name) {
    if (!name.match(/^[0-9a-zA-Z]+$/))
        return false;

    return true;
  }
};
 
TestCtrl.$inject = ['nameService']
function TestCtrl(nameService) {
  this.getUsername = function() {
    return nameService.username // XXX    
  }
}


})();


