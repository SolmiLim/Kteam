angular.module('starter.controllers', [])
    //피드 역순으로 나오게끔 하는 필터
    .filter('reverse', function () {
        return function (items) {
            return items.slice().reverse();
        };
    })
    .controller('DashCtrl', function ($scope) {})
    .controller('AppController', function ($scope, $state, $rootScope, $ionicHistory, $stateParams) {
        if ($stateParams.clear) {
            $ionicHistory.clearHistory();
            $ionicHistory.clearCache();
        }

        $scope.logout = function () {
            Parse.User.logOut();
            $rootScope.user = null;
            $rootScope.isLoggedIn = false;
            $state.go('welcome', {
                clear: true
            });
        };
    })

.controller('WelcomeController', function ($scope, $state, $rootScope, $ionicHistory, $stateParams) {
        if ($stateParams.clear) {
            $ionicHistory.clearHistory();
            $ionicHistory.clearCache();
        }

        $scope.login = function () {
            $state.go('app.login');
        };

        $scope.signUp = function () {
            $state.go('app.register');
        };

        $scope.uploading = function () {
            $state.go('app.uploadGoods');
        };

        if ($rootScope.isLoggedIn) {
            $state.go('app.categories');
        }
    })
    .controller('LoginController', function ($scope, $state, $rootScope, $ionicLoading) {
        $scope.user = {
            username: null,
            password: null
        };

        $scope.error = {};

        $scope.login = function () {
            $scope.loading = $ionicLoading.show({
                content: 'Logging in',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });

            var user = $scope.user;
            Parse.User.logIn(('' + user.username).toLowerCase(), user.password, {
                success: function (user) {
                    $ionicLoading.hide();
                    $rootScope.user = user;
                    $rootScope.isLoggedIn = true;
                    $state.go('app.categories', {
                        clear: true
                    });
                },
                error: function (user, err) {
                    $ionicLoading.hide();
                    // The login failed. Check error to see why.
                    if (err.code === 101) {
                        $scope.error.message = 'Invalid login credentials';
                    } else {
                        $scope.error.message = 'An unexpected error has ' +
                            'occurred, please try again.';
                    }

                }
            });
        };

        $scope.forgot = function () {
            $state.go('app.forgot');
        };
    })

.controller('ForgotPasswordController', function ($scope, $state, $ionicLoading) {
    $scope.user = {};
    $scope.error = {};
    $scope.state = {
        success: false
    };

    $scope.reset = function () {
        $scope.loading = $ionicLoading.show({
            content: 'Sending',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        Parse.User.requestPasswordReset($scope.user.email, {
            success: function () {
                // TODO: show success
                $ionicLoading.hide();
                $scope.state.success = true;
                $scope.$apply();
            },
            error: function (err) {
                $ionicLoading.hide();
                if (err.code === 125) {
                    $scope.error.message = 'Email address does not exist';
                } else {
                    $scope.error.message = 'An unknown error has occurred, ' +
                        'please try again';
                }
                $scope.$apply();
            }
        });
    };

    $scope.login = function () {
        $state.go('app.login');
    };
})


.controller('RegisterController', function ($scope, $state, $ionicLoading, $rootScope) {
    $scope.user = {};
    $scope.error = {};

    $scope.register = function () {

        // TODO: add age verification step

        $scope.loading = $ionicLoading.show({
            content: 'Sending',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        var user = new Parse.User();
        user.set("username", $scope.user.email);
        user.set("password", $scope.user.password);
        user.set("email", $scope.user.email);

        user.signUp(null, {
            success: function (user) {
                $ionicLoading.hide();
                $rootScope.user = user;
                $rootScope.isLoggedIn = true
                $state.go('app.userinfo', {
                    clear: true
                });

            },
            error: function (user, error) {
                $ionicLoading.hide();
                if (error.code === 125) {
                    $scope.error.message = 'Please specify a valid email ' +
                        'address';
                } else if (error.code === 202) {
                    $scope.error.message = 'The email address is already ' +
                        'registered';
                } else {
                    $scope.error.message = error.message;
                }
                $scope.$apply();
            }
        });
    };
})


.controller('CategoriesCtrl', function ($scope, $location, $ionicPopup, Category) {
    // 카테고리 지우기 안됨
    /*$scope.remove = function(category) {
    $ionicPopup.confirm({
      title: 'Confirm',
      template: 'Are you sure you want to delete it?'
    }).then(function(res) {
      if(res) {
        category.destroy();
        $scope.fetchAllCategories();
      }
    });
  };*/

    $scope.add = function () {
        $scope.newCategory.save();
        $scope.fetchAllCategories();
    };

    $scope.newCategory = function () {
        $location.path('app/category/')
    };

    $scope.show = function (category) {
        $location.path('app/categoryShow/' + category.objectId)
    };

    $scope.edit = function (category) {
        $location.path('app/category/' + category.objectId)
    };

    $scope.fetchAllCategories = function () {
        $scope.categories = null;
        return Category.query()
            .then(function (categories) {
                $scope.$broadcast('scroll.refreshComplete');
                return $scope.categories = categories;
            });
     //   $scope.$apply();
    };
    $scope.fetchAllCategories();
})

.controller('CategoryDetailCtrl', function ($scope, $state, $stateParams, $rootScope, $ionicHistory, $ionicPopup, Category, $ionicLoading, Userinfo) {

    // 공구하기 눌렀을 경우 userId와 categoryId, categoryTitle, category.price, category.seller, category.bank, category.account 저장함


    $scope.buy = function () {

        // 구매자가 나중에 구매내역을 확인할 경우, 해당 제품의 정보와 판매자의 정보를 출력하는데 필요하다.

        if (!$scope.buy.opt) {
            $ionicPopup.alert({
                title: '내용이 부족합니다.',
                template: '구매를 원하는 옵션을 입력해주세요.'
            });
        } else {

            var Customer = Parse.Object.extend("Customer");
            var buyinfo = new Customer();

            buyinfo.set("categoryid", $stateParams.categoryId);
            buyinfo.set("optional", $scope.buy.opt); //이거-----------------------------------------------------------------------------------------------------------
            buyinfo.set("userId", Parse.User.current().id);
            buyinfo.set("categoryTitle", $scope.category.name);
            buyinfo.set("categoryPrice", $scope.category.price);
            buyinfo.set("categorySeller", $scope.category.seller);
            buyinfo.set("categoryBank", $scope.category.bank);
            buyinfo.set("categoryAccount", $scope.category.account);
         //   buyinfo.set("itemquantity", $scope.category.quantity);
            buyinfo.set("itemImg", $scope.category.imgURI);

            buyinfo.set("state", $scope.category.state);

            // 판매자가 나중에 판매 내역을 확인할 경우, 해당 제품의 구매를 원하는 사람의 정보를 출력하는데 필요하다.

            var Customerinfo = Parse.Object.extend("Customerinfo");
            var cusinfo = new Customerinfo();

            // 판매자의 id, 구매자의 id, 구매자의 회원정보(이름, 주소, 전화번호)를 저장한다.

            cusinfo.set("sellerId", $scope.category.usr);
            cusinfo.set("categoryId", $stateParams.categoryId);
            cusinfo.set("customerId", Parse.User.current().id);
            cusinfo.set("customerName", $scope.user.name);
            cusinfo.set("customerPhone", $scope.user.phone);
            cusinfo.set("customerAddress", $scope.user.address);
            cusinfo.set("categoryName", $scope.category.name);
            cusinfo.set("cusoptional", $scope.buy.opt); //이거-----------------------------------------------------------------------------------------------------------
            cusinfo.set("state", $scope.category.state);

            buyinfo.save(null, {
                success: function (buyinfo) {
                 //   $scope.$apply();
                    $state.go('app.categories', {
                        clear: true
                    });

                },
                error: function (buyinfo, error) {
                    $ionicLoading.hide();
                   // $scope.$apply();
                }
            });
            cusinfo.save();
            //$scope.$apply();
        }

    };


    $scope.findCategory = function (categoryId) {
        return Category.query({
            'where': {
                'objectId': categoryId
            }
        }).then(function (categories) {
            if (categories[0]) {
                $scope.category = categories[0];
            } else {
                $scope.category = new Category();
            }
            return $scope.category;
          //  $scope.$apply();
        });
        $scope.category.usr = Parse.User.current().id;

    };


    $scope.findUserinfo = function () {
        return Userinfo.query({
            'where': {
                'userid': Parse.User.current().id
            }
        }).then(function (users) {
            if (users[0]) {
                $scope.user = users[0];
            } else {
                $scope.user = new Userinfo();
            }
            return $scope.user;
        });
    //    $scope.$apply();

    };



    /*****포토포토포토포토포토포토포토*****/

    $scope.uploadPhoto = function () {
        var options = {
            quality: 75,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 300,
            targetHeight: 300,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        navigator.camera.getPicture(function (imageURI) {

            imageURI = "data:image/jpeg;base64," + imageURI;
            $scope.category.imgURI = imageURI;
            $scope.$apply();

        }, function (err) {

        }, options);

    };


    //	$scope.uploadPhoto = uploadPhoto;
    $scope.saveCategory = function () {

        if (!$scope.category.name) {
            $ionicPopup.alert({
                title: '내용이 부족합니다.',
                template: '게시글의 제목을 입력해주세요.'
            });
        } else if (!$scope.category.description) {
            $ionicPopup.alert({
                title: '내용이 부족합니다.',
                template: '게시글의 내용을 입력해주세요.'
            });
        } else if (!$scope.category.check) {
            $ionicPopup.alert({
                title: '내용이 부족합니다.',
                template: '분할 수를 입력해주세요.'
            });
        } else if (!$scope.category.brand) {
            $ionicPopup.alert({
                title: '내용이 부족합니다.',
                template: '브랜드를 입력해주세요.'
            });
        } else if (!$scope.category.price) {
            $ionicPopup.alert({
                title: '내용이 부족합니다.',
                template: '제품의 가격을 입력해주세요.'
            });
        } else if (!$scope.category.seller) {
            $ionicPopup.alert({
                title: '내용이 부족합니다.',
                template: '판매자의 이름을 입력해주세요.'
            });
        } else if (!$scope.category.bank) {
            $ionicPopup.alert({
                title: '내용이 부족합니다.',
                template: '판매자의 은행명을 입력해주세요.'
            });
        } else if (!$scope.category.account) {
            $ionicPopup.alert({
                title: '내용이 부족합니다.',
                template: '판매자의 계좌 번호를 입력해주세요.'
            });
        } 
        else {
            // 판매자 정보 저장

            $scope.category.usr = Parse.User.current().id;
            $scope.category.save();
            $scope.$apply();
            $state.go('app.categories', {
                clear: true
            });
        }
     //   $scope.$apply();
    };

    $scope.findCategory($stateParams.categoryId);
    $scope.findUserinfo();
})



.controller('BuySumCtrl', function ($scope, $stateParams, $ionicPopup, Customer) {


    $scope.fetchAllCategories = function () {
        $scope.customer = null;
        return Customer.query({
            'where': {
                'userId': Parse.User.current().id
            }
        }).then(function (customer) {
        //    $scope.$apply();
            $scope.$broadcast('scroll.refreshComplete');
            return $scope.customers = customer;
        });
    };

    $scope.fetchAllCategories();

    $scope.show = function (customer) {
        $location.path('app/categoryShow/' + customer.get('categoryId'));
    };
})


/////////////////////////// 판매중인 공구 리스트 ////////////////////////////////////////////
.controller('SellSumCtrl', function ($scope, $stateParams, $ionicPopup, Customerinfo, Category, $location) {

    $scope.fetchAllCategories = function () {
        $scope.categories = null;
        return Category.query({
            'where': {
                'usr': Parse.User.current().id
            }
        }).then(function (category) {
            $scope.$broadcast('scroll.refreshComplete');
            return $scope.categories = category;
        });
    };

    $scope.fetchAllCategories();


    $scope.edit = function (category) {
        $location.path('app/category/' + category.objectId)
    };

 //   $scope.$apply();
})



.controller('SellDetailCtrl', function ($scope, $stateParams, $ionicPopup, Customerinfo, Category, $location) {

    $scope.fetchAllCusinfo = function () {
        $scope.cusinfos = null;
        return Customerinfo.query({
            'where': {
                'categoryId': $stateParams.categoryId
            }
        }).then(function (cusinfo) {
            $scope.$broadcast('scroll.refreshComplete');
            return $scope.cusinfos = cusinfo;
        });
    };

    $scope.fetchAllCusinfo();

    $scope.edit = function () {
        $location.path('app/category/' + $stateParams.categoryId)
    };

})


.controller('UserInfoCtrl', function ($scope, $state, $stateParams, $rootScope, $ionicHistory, $ionicPopup, Userinfo, $ionicLoading) {

    var currentUser = Parse.User.current();
    $scope.userEmail = currentUser.get("username");
    console.log($scope.userEmail);

    $scope.findUser = function (UserId) {
        return Userinfo.query({
            'where': {
                'userid': Parse.User.current().id
            }
        }).then(function (users) {
            if (users[0]) {
                $scope.userinfo = users[0];
            } else {
                $scope.userinfo = new Userinfo();
            }
            return $scope.user;
        });
        $scope.userinfo.userid = Parse.User.current().id;
    };


    $scope.saveUserinfo = function () {

        if (!$scope.userinfo.name) {
            $ionicPopup.alert({
                title: '내용이 부족합니다.',
                template: '이름을 입력해주세요.'
            });
        } else if (!$scope.userinfo.phone) {
            $ionicPopup.alert({
                title: '내용이 부족합니다.',
                template: '핸드폰 번호을 입력해주세요.'
            });
        } else if (!$scope.userinfo.address) {
            $ionicPopup.alert({
                title: '내용이 부족합니다.',
                template: '주소을 입력해주세요.'
            });
        } else {
            // 유저 정보 저장

            $scope.userinfo.userid = Parse.User.current().id;
            $scope.userinfo.save();
           // $state.$apply();
            $state.go('app.categories', {
                clear: true
            });
        }
    };

    $scope.findUser($stateParams.UserId);
})

;
