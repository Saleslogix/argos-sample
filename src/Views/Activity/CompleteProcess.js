/*
 * Copyright (c) 1997-2013, SalesLogix, NA., LLC. All rights reserved.
 */
define('Mobile/Sample/Views/Activity/CompleteProcess', [
    'dojo/_base/declare',
    'dojo/_base/array',
    'dojo/_base/connect',
    'dojo/string',
    'Sage/Platform/Mobile/Edit'
], function(
    declare,
    array,
    connect,
    string,
    Edit
) {

    return declare('Mobile.Sample.Views.Activity.CompleteProcess', [Edit], {
        titleText: 'Sales Process',
        id: 'activity_completeprocess'
    });
});

