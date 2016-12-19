'use strict';
angular.module('NvdQrCode', []).directive('nvdQrCode', QrCodeDirective);

function QrCodeDirective() {
    return {
        restrict: 'E',
        template: '<div id="nvd-qr-code"></div>',
        scope: {
            content: '=content'
        },
        link: function (scope, elem, attrs) {
            scope.$watch('content', function () {
                var content = scope.content;
                if(typeof content !== 'string')
                    content = JSON.stringify(scope.content);
                new QRCode(elem.children().eq(0)[0], content);
            });
        }
    };
}