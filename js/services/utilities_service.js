angular.module("app").factory('UtilitiesService',
    function () {

        var initialized = false;

        function generateUUID() {
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16);
            });
            return uuid;
        }

        function isListEmpty(list) {
            if (!isEmpty(list)) {
                return Object.keys(list).length === 0;
            }
            else {
                return true;
            }
        }

        function isEmpty(value) {
            return angular.isUndefined(value) || value === '' || value === null || value !== value;
        }

        function addArrayHelperMethods() {
            if (!initialized) {
                initialized = true;
                Array.prototype.propertyBasedIndexOf = function arrayObjectIndexOf(property, value) {
                    for (var i = 0, len = this.length; i < len; i++) {
                        if (this[i].hasOwnProperty(property) && this[i][property] === value) { return i; }
                    }
                    return -1;
                };

                Array.prototype.containsPropertyValue = function (property, value) {
                    var i = this.length;
                    while (i--) {
                        if (this[i].hasOwnProperty(property) && this[i][property] === value) {
                            return true;
                        }
                    }
                    return false;
                };

                Array.prototype.contains = function (obj) {
                    var i = this.length;
                    while (i--) {
                        if (this[i] === obj) {
                            return true;
                        }
                    }
                    return false;
                };

                Array.prototype.find = function (search_lambda) {
                    return this.map(search_lambda).indexOf(true);
                };

                Array.prototype.updateByIndex = function (index, updates, createMissing) {
                    createMissing = isEmpty(createMissing) ? false : createMissing;
                    if (index >= 0 && index < this.length) {
                        for (var key in updates) {
                            if (updates.hasOwnProperty(key)) {
                                this[index][key] = updates[key];
                            }
                        }
                    }
                    else if (createMissing === true && index === -1) {
                        this.push(updates);
                    }
                };

                Array.prototype.updateWhere = function (where, updates, createMissing) {
                    this.updateByIndex(this.find(where), updates, createMissing);
                };

                Array.prototype.removeByIndex = function (index) {
                    if (index >= 0 && index < this.length) {
                        this.splice(index, 1);
                    }
                };

                Array.prototype.removeWhere = function (where) {
                    this.removeByIndex(this.find(where));
                };
            }
        }

        return {
            generateUUID: generateUUID,
            isEmpty: isEmpty,
            isListEmpty: isListEmpty,
            addArrayHelperMethods: addArrayHelperMethods,
        };
    });