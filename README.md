# About

- - - - - -

### Overview
This sample module was designed to show how you can add customizations to an existing project based on the Argos SDK. This module was designed to supplement the [argos-saleslogix][argos-saleslogix] project.

### Included Examples
*  Creating and registering a custom list view (Ticket Activities)
*  Adding a Quick Action to an existing view (Account Detail)
*  Add a field to existing detail and edit views (Account Detail/Edit)
*  Change a label on an existing view (Account Detail)
*  Hide a field on an existing view (Account Detail)
*  Add a custom Toolbar button to an existing view (Account Detail)
*  Override the layout template for a list view (Contact List)
*  Add a custom view that derives from the base view type (Google Map view)
*  Example of overriding CSS styling (sample-app.css)

#Installation

- - - - - 

### Prerequisites
*	A web server

### Clone repository
1.	Open a command prompt
2.	change to the base directory where you cloned [Argos SDK][argos-sdk], eg:

		cd \projects\sage\mobile
3.	Execute the following commands (clone command shown with READ-ONLY URL; if you have commit rights, use the appropriate Read+Write URL).

		cd products
		git clone git://github.com/SageScottsdalePlatform/argos-sample.git

    __Note:__ If you're downloading and extracting the zip file instead of using git directly, the top-level folder in your download will probably be named something like "SageScottsdalePlatform-argos-sample-nnnnn". You'll want to rename this folder to argos-sample, and put it under your products sub-folder. You'll end up with a folder structure like this:
        ...\mobile\argos-sdk
        ...\mobile\products\argos-sample

### Setup and run the application in "debug" mode
1.	Follow the instructions for running the argos-saleslogix project in debug mode in that project's README
2.  Make a copy of the argos-saleslogix index-dev.html file and name it index-dev-sample.html.
3.  Add the following lines to index-dev-sample.html. Note the relative paths pointing to the argos-sample folder. An example of this file is included with this project.

        <!-- Argos Sample -->
        <script type="text/javascript" src="../argos-sample/src/ApplicationModule.js"></script>
        <script type="text/javascript" src="../argos-sample/src/views/TicketActivity/List.js"></script>
        <!-- Configuration -->
        <script type="text/javascript" src="../argos-sample/configuration/development.js"></script>

  **Note:** Insert the argos-sample Configuration line after the existing one from index-dev.html, don't replace it.

4.	Place index-dev-sample.html in the argos-saleslogix folder. In your browser, open index-dev-sample.html from the file system, or...navigate to the path `/mobile/products/argos-saleslogix/index-dev-sample.html` on your web server, eg:

		http://localhost/mobile/products/argos-saleslogix/index-dev-sample.html

### Building A Release Version

#### Requirements
*	Windows

#### Steps
1.	Save this [gist](https://gist.github.com/815451) as `build-module.cmd` to the directory where you cloned [Argos SDK][argos-sdk] (The same folder where you created the Products folder).
2.	Open a command prompt and execute the following, changing paths as appropriate, eg:

        cd \projects\sage\mobile
        build-module sample

3.	The deployed module will be in a `deploy` folder in the directory where you cloned [argos-sample][argos-sample].

### Deploying

#### Steps
1.	Open the deploy folder for the product, eg:

		mobile\products\argos-sample\deploy
3.	Copy the entire contents of the module's deploy folder to the server folder where argos-saleslogix has been deployed (Likely a virtual directory named SlxMobile).
4.	Add references to this module to the index.html and index-nocache.html files, right before the application is created and initialized.

        // Add this line if you have custom CSS 
        // <link type="text/css" rel="stylesheet" href="content/css/argos-sample.css" /> 
        <script type="text/javascript" src="content/javascript/argos-sample.js"></script>
        <script type="text/javascript" src="configuration/sample/production.js"></script>

        <script type="text/javascript">
        Ext.onReady(function() {
            var application = new Mobile.SalesLogix.Application();
                    application.activate();
            application.init();
            application.run();
        });
        </script>
5. The argos-sample module will now be part of the SlxMobile client.

		


[argos-sdk]: https://github.com/SageScottsdalePlatform/argos-sdk "Argos SDK Source"
[argos-saleslogix]: https://github.com/SageScottsdalePlatform/argos-saleslogix "Argos SalesLogix Source"
[argos-sample]: https://github.com/SageScottsdalePlatform/argos-sample "Argos Sample"