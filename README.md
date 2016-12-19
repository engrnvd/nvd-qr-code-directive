# A Simple QR Code Generator

## Requires

qrcode.js: 
https://davidshimjs.github.io/qrcodejs/

## Usage

### JS:

```
    angular.module('myApp', ['NvdQrCode']).controller('MainController', MainController);

    function MainController() {
        var vm = this;

        vm.data = {
            id: 123,
            name: "Naveed",
            city: "RYK"
        };
    }
    
```

### HTML:

```

<nvd-qr-code content="vm.data"></nvd-qr-code>

```

If `content` is not a string, it will be converted to a JSON encoded string automatically.