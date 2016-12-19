'use strict';
angular.module('NvdNg', []);

// @codekit-append "nvd-ng-tree-directive.js"
// @codekit-append "nvd-ng-tree-node-service.js"
// @codekit-append "nvd-ng-tree-tree-service.js"

angular.module('NvdNg')
    .directive('nvdNgTree', ['NvdNgTreeService', function (Tree) {
        return {
            restrict: 'E',
            template: '<div ng-include="getContentUrl()"></div>',
            scope: {
                tree: '=tree',
                templateUrl: '=templateUrl'
            },
            link: function (scope, elem, attrs) {
                scope.getContentUrl = function () {
                    var url = scope.templateUrl;
                    if (!url) {
                        url = getCurrentScript();
                        url = url.replace(/js$/, 'html');
                    }
                    return url;
                };
                var getCurrentScript = function () {
                    var script = $("script[src*='nvd-ng-tree']");
                    return script.get(0).src;
                };
            }
        };
    }]);

angular.module('NvdNg')
    .factory('NvdNgNodeService', function () {
        var Node = function (data) {
            this.id = null;
            this.label = "";
            this.children = null;
            this.parentId = null;
            this.checked = false;
            this.opened = false;
            this.hasCheckedChildren = false;

            for (var prop in data)
                this[prop] = data[prop];

            if (this.children) {
                this.children = Node.makeNodes(this.children);
                var parentId = this.id;
                _.map(this.children, function (node) {
                    node.parentId = parentId;
                });
            }
        };

        Node.makeNodes = function (items) {
            var collection = [];
            for (var $i = 0; $i < items.length; $i++) {
                collection.push(new Node(items[$i]));
            }
            return collection;
        };

        Node.prototype.toggleOpen = function () {
            this.opened = !this.opened;
        };

        Node.prototype.toggleChecked = function (collection) {
            this.setChecked(!this.checked);
            // update parent status
            this.updateParentCheckedStatus(collection);
        };

        Node.prototype.setChecked = function (value) {
            this.checked = value;
            if (!value) this.hasCheckedChildren = false;
            // toggle-check for all children
            var thisNode = this;
            if (this.children) {
                _.map(thisNode.children, function (childNode) {
                    childNode.setChecked(value);
                });
            }
        };

        Node.prototype.updateParentCheckedStatus = function (collection) {
            var thisNode = this;
            if (thisNode.parentId) {
                var parentNode = thisNode.getParent(collection);
                var allChecked = true;
                var someChecked = false;
                _.map(parentNode.children, function (childNode) {
                    childNode.checked ? someChecked = true : allChecked = false;
                    if (childNode.hasCheckedChildren)
                        someChecked = true;
                });
                parentNode.checked = allChecked;
                parentNode.hasCheckedChildren = someChecked;

                if (parentNode.parentId)
                    parentNode.updateParentCheckedStatus(collection);
            }
        };

        Node.prototype.getParent = function (collection) {
            var thisNode = this;
            var secondaryCollection = [];
            var result = _.find(collection, function (node) {
                if (node.children)
                    secondaryCollection = _.union(secondaryCollection, node.children);
                return node.id == thisNode.parentId;
            });

            if (!result && secondaryCollection)
                return thisNode.getParent(secondaryCollection);

            return result;
        };

        // build the api and return it
        return Node;
    });

angular.module('NvdNg')
    .factory('NvdNgTreeService', ['NvdNgNodeService', function (Node) {
        var Tree = function (items) {
            var thisTree;
            this.nodes = Node.makeNodes(items);
        };

        Tree.prototype.getChecked = function () {
            return _.filter( this.nodes, function (node) {
                return node.checked || node.hasCheckedChildren;
            } );
        };

        // build the api and return it
        return Tree;
    }]);