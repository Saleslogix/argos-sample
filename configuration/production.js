define('configuration/sample/production', ['configuration/production', 'Mobile/Sample/ApplicationModule'], function(baseConfiguration, SampleApplicationModule) {
    baseConfiguration.modules.push(new SampleApplicationModule());
    return baseConfiguration;
});