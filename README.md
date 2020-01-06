# About

- - - - - -

### Overview
This sample module was designed to show how you can add customizations to an existing project based on the Argos SDK. This module was designed to supplement the [argos-saleslogix][argos-saleslogix] project.

### Included Examples
*  Adding a Quick Action to an existing view (Account Detail)
*  Add a field to existing detail and edit views (Account Detail/Edit)
*  Change a label on an existing view (Account Detail)
*  Hide a field on an existing view (Account Detail)
*  Add a custom Toolbar button to an existing view (Account Detail)
*  Override the layout template for a list view (Contact List)
*  Add a custom view that derives from the base view type (Google Map view)
*  Example of overriding CSS styling (sample.css)
*  A rudimentary Groups implementation using the Groups SData endpoint (GroupsList.js)
*  Example of handling a self-join where only the ID is available (Parent in Account Detail/Edit)
*  Inserting and modifying hash tags for List View searches
*  Example of performing multiple customizations with a single customization call
*  Modifying OOTB models (new starting in 3.4)

#Installation

- - - - -

### Prerequisites
*	A web server

### Clone repository
1\.	Open a command prompt.

2\.	change to the base directory where you cloned [Argos SDK][argos-sdk], eg:

		cd \projects\mobile

3\.	Execute the following commands (clone command shown with READ-ONLY URL; if you have commit rights, use the appropriate Read+Write URL).

		cd products
		git clone git://github.com/Saleslogix/argos-sample.git

    __Note:__ If you're downloading and extracting the zip file instead of using git directly, the top-level folder in your download will probably be named something like "Saleslogix-argos-sample-nnnnn". You'll want to rename this folder to argos-sample, and put it under your products sub-folder. You'll end up with a folder structure like this:

        ...\mobile\argos-sdk
        ...\mobile\products\argos-sample

### Setup and run the application in "debug" mode

1\.  Follow the instructions for running the argos-saleslogix project in debug mode in that project's README.

2\.  Make a copy of the argos-saleslogix index-dev.html file and name it index-dev-sample.html.

3\.  Edit following lines to index-dev-sample.html. Note the relative paths pointing to the argos-sample folder. An example of this file is included with this project.

```
    require({
            baseUrl: "./",
            packages: [
            { name: 'dojo', location: '../../argos-sdk/libraries/dojo/dojo' },
            { name: 'dijit', location: '../../argos-sdk/libraries/dojo/dijit' },
            { name: 'Sage/Platform/Mobile', location: '../../argos-sdk/src' },
            { name: 'Mobile/SalesLogix', location: 'src' },
            { name: 'Mobile/Sample', location: '../argos-sample/src' }, // <-- Namespace and src folder path
            { name: 'configuration/sample', location: '../argos-sample/configuration' }, // <-- configuration/name, config folder path
            ]
    });

    var application = 'Mobile/SalesLogix/Application',
        configuration = [
            'configuration/sample/development' //<-- development config file (no extension)
        ];
    require([application].concat(configuration), function(application, configuration) {
        var localization = [
            'localization/en',
            'localization/saleslogix/en'
        ];
```

4\.	If you have any additional images, icons, etc that you wish to be available during development you will need to copy them into their respective folders within argos-saleslogix. Doing this allows any relative paths to files to remain intact when your module is deployed (all folders are merged in deployment).

5\.	Place index-dev-sample.html in the argos-saleslogix folder. In your browser, open index-dev-sample.html from the file system, or...navigate to the path `/mobile/products/argos-saleslogix/index-dev-sample.html` on your web server, eg:

		http://localhost/mobile/products/argos-saleslogix/index-dev-sample.html

### Building A Release Version

#### Before You Start

1\. Information about your customization module is defined in the `module-info.json` file at the root directory. This information will be displayed in Application Architect for easy identification and versioning.

Location:

```
mobile/products/argos-sample/module-info.json
```

Example:

```
{
    "name": "sample",
    "displayName": "Sample Customizations",
    "description": "A sample module implementation that shows how to customize the SalesLogix Mobile client.",
    "majorVersion": 1,
    "minorVersion": 1,
    "buildNumber": 0,
    "targetProduct": "saleslogix"
}
```

2\. Then open the `module-fragment.html` file also at the root of the module folder. This file will be placed into all the `index` files (either manually via copy pasting the lines or automatically through AA).

3\. Edit it to point to your where your final built script and stylesheet will be (as seen in your `build/release.jsb2` file):

```
    <!-- Sample -->
    <link type="text/css" rel="stylesheet" href="content/css/sample.css" />
    <script type="text/javascript" src="content/javascript/argos-sample.js"></script>
```

4\. If you are deploying using AA 8.0+ then all you need to do now is within AA right click on CustomModules in the SLXMobile portal and choose Add Custom Module. Then browse to the `module-info.json` file and hit okay. AA will handle building, minifying, editing the index files and enabling you to select/deselect modules as needed. Make sure to save and re-deploy after any changes.

5\. If you need an offline app manifest, or if you are not using AA 8.0+ to deploy then please continue.

#### Requirements
*	Windows
*	[NodeJS](https://nodejs.org/download/)

#### Steps
1\.     Edit the build\release.jsb2 file and ensure all of your assets (js/images/css) are included
2\.	Open a command prompt and execute the following:

        cd products/argos-sample
	build\release.cmd

3\.	The deployed application will be in a `deploy` folder in products/argos-sample. This will include all products specified in the products/argos-saleslogix/Gruntfile.js configuration

### Deploying

#### Setup

1\.	Open the deploy folder, eg:

		mobile\products\argos-saleslogix\deploy

2\. Copy all the folders within `deploy` (configuration, content and localization) and paste them into your Virtual Directory (SlxMobile) of your portal (where you deployed argos-saleslogix)

3\. Edit `index.html`, `index-nocache.html` and `index.ascx` by copying the lines from `module-fragment.html` (the ones you added earlier, this file is not copied into the deploy folder so look for it in your normal dev directory) into each file at the designated modules marker:

```
    <!-- Modules -->
    <!--{{modules}}-->
```

To:

    <!-- Modules -->
    <!-- Sample -->
    <link type="text/css" rel="stylesheet" href="content/css/sample.css" />
    <script type="text/javascript" src="content/javascript/argos-sample.js"></script>

4\. Lastly we need to add the modules configuration and the localization by editing the following lines:

```
    (function() {
        var application = 'Mobile/SalesLogix/Application',
            configuration = [
                'configuration/production'
           ];
        require([application].concat(configuration), function(application, configuration) {
            var localization = [
                'localization/en',
                'localization/saleslogix/en'
            ];
```

To:

```
    (function() {
        var application = 'Mobile/SalesLogix/Application',
            configuration = [
                'configuration/production',
                'configuration/sample/production'
           ];
        require([application].concat(configuration), function(application, configuration) {
            var localization = [
                'localization/en',
                'localization/saleslogix/en',
                'localization/sample/en'
            ];
```

#### Finished

The argos-sample module will now be part of the Saleslogix Mobile client.


[argos-sdk]: https://github.com/Saleslogix/argos-sdk "Argos SDK Source"
[argos-saleslogix]: https://github.com/Saleslogix/argos-saleslogix "Argos SalesLogix Source"
[argos-sample]: https://github.com/Saleslogix/argos-sample "Argos Sample"
