(function() {
	var getV = Sage.Platform.Mobile.Utility.getValue,
		scope = this,
		localize = function(name, values) {
			var target = getV(scope, name);
			if (target) Ext.override(target, values);
		};

    //localize strings for src/views/account/detail.js
    localize('Mobile.SalesLogix.Account.Detail', {
        accountText: 'tnuocca'
	});

})();