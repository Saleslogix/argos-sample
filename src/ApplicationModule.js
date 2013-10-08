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
    'Mobile/Sample/Views/Activity/CompleteProcess',
    'Mobile/Sample/Views/Contact/CompleteProcess'
], function(
    declare,
    lang,
    string,
    query,
    domClass,
    format,
    ApplicationModule,
    ActivityCompleteProcess,
    ContactCompleteProcess
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
            this.registerView(new ContactCompleteProcess());
        },
        loadCustomizations: function() {
            this.inherited(arguments);
            this.registerListCustomizations();
            this.registerActivityCustomizations();
            this.registerContactCustomizations();
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
                    var view, processName;
                    view = App.getView('contact_completeprocess');
                    if (view) {
                        processName = evt.$source.innerText || evt.$source.text || '';
                        view.show({
                            key: this.entry.ContactId,
                            activityEntry: this.entry, 
                            processCode: processCodes[processName.trim()],
                            processName: processName.trim(),
                        });
                    }
                }
            });
            lang.extend(Mobile.SalesLogix.Views.Activity.Complete, {
                //setValues: function(values) {
                //    Mobile.SalesLogix.Views.Activity.Complete.superclass.setValues.apply(this, arguments);
                //}
            });
        },
        registerContactCustomizations: function() {
            this.registerCustomization('detail', 'contact_detail', {
                at: function(row) { return row.action === 'scheduleActivity'; },
                type: 'insert',
                where: 'before',
                value: {
                    value: '',
                    label: 'Schedule Process ',
                    action: 'scheduleProcess'
                }
            });

            lang.extend(Mobile.SalesLogix.Views.Contact.Detail, {
                scheduleProcess: function(evt) {
                    var view;
                    view = App.getView('activity_edit');
                    if (view) {
                        view.show({
                            insert: true,
                            entry: (this.options && this.options.entry) || null,
                            source: this.options && this.options.source,
                            activityType: 'atAppointment',
                            title: 'Sales Appointment',
                            returnTo: this.options && this.options.returnTo
                        }, {
                            returnTo: -1
                        });
                    }
                }
            });
        },
        registerListCustomizations: function() {
            lang.extend(Sage.Platform.Mobile.List, {
                setSearchTerm: function(value) {
                    if (this.searchWidget) {
                        var currentValue = this.searchWidget.getSearchExpression();
                        value =  this.getSearchValue(value, currentValue);
                        this.searchWidget.set('queryValue', value);
                    }
                },
                getSearchValue: function(value, currentValue) {
                    var index;
                    if ((value !== null) || (value !== '')) {
                       
                        if ((currentValue == null) || (currentValue === '')) {

                        } else {
                             if (currentValue.indexOf(value) > -1) {
                                value = currentValue.replace(value, "");
                            } else {
                                value = value + ' ' + currentValue;
                            }
                        }

                    }
                    return value;
                }
            });
        }

    });
});
