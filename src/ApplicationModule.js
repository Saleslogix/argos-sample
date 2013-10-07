/*
 * Copyright (c) 1997-2013, SalesLogix, NA., LLC. All rights reserved.
 */
define('Mobile/Sample/ApplicationModule', [
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/string',
    'dojo/query',
    'dojo/dom-class',
    'Mobile/SalesLogix/Format',
    'Sage/Platform/Mobile/ApplicationModule',
    'Mobile/Sample/Views/Activity/CompleteProcess'
], function(
    declare,
    lang,
    string,
    query,
    domClass,
    format,
    ApplicationModule,
    ActivityCompleteProcess
) {

    return declare('Mobile.Sample.ApplicationModule', ApplicationModule, {
        //localization strings
        noShowText: 'No Show',
        noSaleText: 'No Sale',
        saleText: 'Sale',

        loadViews: function() {
            this.inherited(arguments);

           //Register views for group support
            this.registerView(new ActivityCompleteProcess());
        },
        loadCustomizations: function() {
            this.inherited(arguments);
            this.registerActivityCustomizations();
        },
        registerActivityCustomizations: function() {
            this.registerCustomization('detail', 'activity_detail', {
                at: function(row) { return row.action === 'completeActivity' || row.action === 'completeSeries'; },
                type: 'insert',
                where: 'before',
                value: {
                    value: '',
                    label: this.noShowText,
                    action: 'navigateToProcess'
                }
            });

            this.registerCustomization('detail', 'activity_detail', {
                at: function(row) { return row.action === 'completeActivity' || row.action === 'completeSeries'; },
                type: 'insert',
                where: 'before',
                value: {
                    value: '', 
                    label: this.noSaleText,
                    action: 'navigateToProcess'
                }
            });

            this.registerCustomization('detail', 'activity_detail', {
                at: function(row) { return row.action === 'completeActivity' || row.action === 'completeSeries'; },
                type: 'insert',
                where: 'before',
                value: {
                    value: '',
                    label: this.saleText,
                    action: 'navigateToProcess'
                }
            });

            var processCodes = {};
            processCodes[this.noShowText] = 'NOSHOW';
            processCodes[this.noSaleText] = 'NOSALE';
            processCodes[this.saleText] = 'SALE';

            lang.extend(Mobile.SalesLogix.Views.Activity.Detail, {
                navigateToProcess: function(evt) {
                    var view;

                    view = App.getView('activity_completeprocess');
                    if (view) {
                        view.show({
                            processCode: processCodes[evt.$source.innerText.trim()]
                        });
                    }
                }
            });
        }
    });
});
