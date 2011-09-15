(function() {
    var getV = Sage.Platform.Mobile.Utility.getValue,
        scope = this,
        localize = function(name, values) {
            var target = getV(scope, name);
            if (target) apply(target, values);
        },
        apply = function(object, values){
            var target = object.prototype || object;
            for(var key in values){
                if(typeof values[key] === 'object'){
                    apply(target[key], values[key]);
                } else {
                    target[key] = values[key];
                }
            }
        };

    //localize strings for src/views/account/detail.js
    localize('Mobile.SalesLogix.Account.Detail', {
        accountText: 'tnuocca'
	});

})();