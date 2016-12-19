'use strict';
(function () {
    angular.module('myApp', ['NvdQrCode']).controller('MainController', MainController);

    function MainController() {
        var vm = this;

        vm.data = {
            id: 123,
            name: "Naveed",
            city: "RYK"
        };
    }

})();
