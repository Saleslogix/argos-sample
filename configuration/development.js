/**
 * Created by argos-sample.
 * User: jhershauer
 * Date: 4/15/11
 * Time: 12:35 PM
 * To change this template use File | Settings | File Templates.
 */
define('configuration/sample/development', ['configuration/development', 'Mobile/Sample/ApplicationModule'], function(baseConfiguration, SampleApplicationModule) {
    return mergeConfiguration(baseConfiguration, {
        modules: [
            new SampleApplicationModule()
        ]
    });
});