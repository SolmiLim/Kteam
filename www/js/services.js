angular.module('starter.services', ['Parse'])


.factory('Category', function (Parse) {
    var Category;
    return Category = (function (_super) {
        __extends(Category, _super);

        function Category() {
            return Category.__super__.constructor.apply(this, arguments);
        }

        Category.configure("Category", "name", "description", "check", "brand", "price", "seller", "bank", "account", "usr", "imgURI","state");

        return Category;

    })(Parse.Model);
})

.factory('Customer', function (Parse) {
    var Customer;
    return Customer = (function (_super) {
        __extends(Customer, _super);

        function Customer() {
            return Customer.__super__.constructor.apply(this, arguments);
        }

        Customer.configure("Customer", "categoryTitle", "categoryid", "userId", "categoryAccount", "categoryBank", "categoryPrice", "categorySeller", "seller_id","itemImg","optional","state");

        return Customer;

    })(Parse.Model);
})

.factory('Userinfo', function (Parse) {
    var Userinfo;
    return Userinfo = (function (_super) {
        __extends(Userinfo, _super);

        function Userinfo() {
            return Userinfo.__super__.constructor.apply(this, arguments);
        }

        Userinfo.configure("Userinfo", "name", "phone", "address","userid");

        return Userinfo;

    })(Parse.Model);
})

.factory('Customerinfo', function (Parse) {
    var Customerinfo;
    return Customerinfo = (function (_super) {
        __extends(Customerinfo, _super);

        function Customerinfo() {
            return Customerinfo.__super__.constructor.apply(this, arguments);
        }

        Customerinfo.configure("Customerinfo", "sellerId", "customerId", "customerName","customerPhone", "customerAddress","categoryId","categoryName","cusoptional","state");

        return Customerinfo;

    })(Parse.Model);
})

/*
.factory('Counter', function (Parse) {
    var Counter;
    return Counter = (function (_super) {
        __extends(Customer, _super);

        function Counter() {
            return Counter.__super__.constructor.apply(this, arguments);
        }

        Customer.configure("Counter","categoryId","buy_number","rest_number","item_price" );

        return Counter;

    })(Parse.Model);
})
*/

;
