/**
 * Created by argos-sample.
 * User: jhershauer
 * Date: 4/15/11
 * Time: 12:35 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.namespace("Configuration.development");

(function() {
	var merge = function(configuration, moduleConfiguration) {
		if (configuration)
		{
			if (configuration.modules && moduleConfiguration.modules)
				configuration.modules = configuration.modules.concat(moduleConfiguration.modules);

			if (configuration.connections && moduleConfiguration.connections)
				configuration.connections = Ext.apply(configuration.connections, moduleConfiguration.connections);
		}
	};

	merge(Configuration.development, {
		modules: [
			new Mobile.Sample.ApplicationModule()
		]
	});
})();