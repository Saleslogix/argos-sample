define('configuration/sample/development', ['configuration/development', 'Mobile/Sample/ApplicationModule'], function(baseConfiguration, SampleApplicationModule) {
    baseConfiguration.modules.push(new SampleApplicationModule());
    return baseConfiguration;
});