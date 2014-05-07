'use strict';

angular.module('resourceProvider', ['ngResource'])

.factory('ResourceProvider', ['$resource',
    function ($resource) {
        function GetResource(resourceUrl, methods) {
            var res = $resource(resourceUrl + '/:id', {}, methods);

            res.getById = function (id, success, error) {
                return res.get({ id: id }, success, error);
            };

            res.prototype.update = function (success, error) {
                return res.update({ id: this.id }, angular.extend({}, this, { id: undefined }), success, error);
            };

            res.prototype.saveOrUpdate = function (saveSuccess, errorSave, updateSuccess, errorUpdate) {
                if (saveSuccess && !updateSuccess)
                    updateSuccess = saveSuccess;

                if (errorSave && !errorUpdate)
                    errorUpdate = errorSave;

                if (this.id) {
                    return this.update(updateSuccess, errorUpdate);
                } else {
                    return this.$save(saveSuccess, errorSave);
                }
            };

            res.prototype.remove = function (success, error) {
                return res.remove({ id: this.id }, success, error);
            };

            res.prototype['delete'] = function (success, error) {
                return this.remove(success, error);
            };

            return res;
        }
        return {getResource : GetResource};
    }])