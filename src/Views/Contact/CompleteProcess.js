/*
 * Copyright (c) 1997-2013, SalesLogix, NA., LLC. All rights reserved.
 */
define('Mobile/Sample/Views/Contact/CompleteProcess', [
    'dojo/_base/declare',
    'dojo/_base/array',
    'dojo/_base/connect',
    'dojo/string',
     'Mobile/SalesLogix/Validator',
     'Mobile/SalesLogix/Format',
     'Mobile/SalesLogix/Environment',
    'Sage/Platform/Mobile/Edit'
], function(
    declare,
    array,
    connect,
    string,
    validator,
    format,
    environment,
    Edit
) {

    return declare('Mobile.Sample.Views.Contact.CompleteProcess', [Edit], {
        titleText: 'Sales Process',
        yesText: 'Yes',
        noText:'No',
        rowcls:'question',
        propertyTemplate: new Simplate([

            '<a name="{%= $.name || $.property %}"></a>',
             '<div class="row row-edit {%= $.cls %} {%= $$.rowcls %} {% if ($.readonly) { %}row-readonly{% } %}" data-field="{%= $.name || $.property %}" data-field-type="{%= $.type %}">',
           //     '<span>{%= $.label2 %}</span>',
             '</div>'

        ]),
        id: 'contact_completeprocess',
        querySelect: [
            'NameLF',
            'Categories',
            'UserField1',
            'UserField2',
            'UserField3',
            'UserField4',
            'UserField5',
            'UserField6',
            'UserField7',
            'UserField8',
            'UserField9',
            'UserField10'
        ],
        resourceKind: 'contacts',
        fieldsForSale: ['UserField1', 'UserField2', 'UserField3', 'UserField4'],
        fieldsForNoSale: ['UserField5', 'UserField6', 'UserField7'],
        fieldsForNoShow: ['UserField8', 'UserField9', 'UserField10'],
        recurringActivityIdSeparator: ';',
        completeView: 'activity_complete',
        show: function(options){
            this.titleText = options.processName;
            this.inherited(arguments);
        },
        beforeTransitionTo: function() {
            this.inherited(arguments);

            if (this.options.processCode === 'SALE') {
                this.showFieldsSale();
            }
            if (this.options.processCode === 'NOSALE') {
                this.showFieldsNoSale();
            }
            if (this.options.processCode === 'NOSHOW') {
                this.showFieldsNoShow();
            }

        },
        showFieldsSale: function() {
            this.titleText = "Sale";
            array.forEach(this.fieldsForSale, function(item) {
                    if (this.fields[item]) {
                        this.fields[item].show();
                    }
                }, this);
            array.forEach(this.fieldsForNoSale, function(item) {
                    if (this.fields[item]) {
                        this.fields[item].hide();
                    }
                }, this);
             array.forEach(this.fieldsForNoShow, function(item) {
                    if (this.fields[item]) {
                        this.fields[item].hide();
                    }
                }, this);
            
            
        },
        showFieldsNoSale: function() {
            this.titleText = "No Sale";
            array.forEach(this.fieldsForNoSale, function(item) {
                if (this.fields[item]) {
                    this.fields[item].show();
                }
            }, this);
            array.forEach(this.fieldsForSale, function(item) {
                if (this.fields[item]) {
                    this.fields[item].hide();
                }
            }, this);
            array.forEach(this.fieldsForNoShow, function(item) {
                if (this.fields[item]) {
                    this.fields[item].hide();
                }
            }, this);

        },
        showFieldsNoShow: function() {
            this.titleText = "No Show";
            array.forEach(this.fieldsForNoShow, function(item) {
                if (this.fields[item]) {
                    this.fields[item].show();
                }
            }, this);
            array.forEach(this.fieldsForSale, function(item) {
                if (this.fields[item]) {
                    this.fields[item].hide();
                }
            }, this);
            array.forEach(this.fieldsForNoSale, function(item) {
                if (this.fields[item]) {
                    this.fields[item].hide();
                }
            }, this);

        },
        setValues: function(values) {
            this.inherited(arguments);
           // this.fields['Categories'].setValue(this.options.processCode);
        },
        getValues: function() {
            var values = this.inherited(arguments);
            values['Categories'] = this.options.processCode;
            return values;
        },
        onUpdateCompleted: function(entry) {
            this.completeActivity();
        },
        navigateToCompleteView: function(completionTitle, isSeries) {
            var view, options;

            view = App.getView(this.completeView);

            if (view) {
                environment.refreshActivityLists();
                options = {
                    title: "complete process",
                    template: {}
                };

               // if (isSeries) {
               //     this.recurrence.Leader = this.entry.Leader;
               //     options.entry = this.recurrence;
               // } else {
                this.options.activityEntry['LongNotes'] = this.options.processName;
                this.options.activityEntry['Description'] = this.options.activityEntry['Description']  + "-" + this.options.processName;
                options.entry = this.options.activityEntry;
                //}

                view.show(options, {
                    returnTo: -2
                });
            }
        },
        completeActivity: function() {
            this.navigateToCompleteView(this.completeActivityText);
        },
        completeOccurrence: function() {
            var request, key, entry = this.options.activityEntry;
            key = entry['$key'];

            // Check to ensure we have a composite key (meaning we have the occurance, not the master)
            if (this.isActivityRecurring(entry) && key.split(this.recurringActivityIdSeparator).length !== 2) {
                // Fetch the occurance, and continue on to the complete screen
                request = new Sage.SData.Client.SDataResourceCollectionRequest(this.getService())
                    .setResourceKind('activities')
                    .setContractName('system')
                    .setQueryArg('where', "id eq '" + key + "'")
                    .setCount(1);

                request.read({
                    success: this.processOccurance,
                    scope: this
                });
            } else {
                this.navigateToCompleteView(this.completeOccurrenceText);
            }
        },
        isActivityRecurring: function(entry) {
            return entry && (entry['Recurring'] || entry['RecurrenceState'] == 'rstOccurrence');
        },
        processOccurance: function(feed) {
            if (feed && feed.$resources && feed.$resources.length > 0) {
                this.options.activityEntry = feed.$resources[0];
                this.navigateToCompleteView(this.completeOccurrenceText);
            }
        },
        completeSeries: function() {
            this.navigateToCompleteView(this.completeSeriesText, true);
        },
        createLayout: function() {
            return this.layout || (this.layout = [{
                name: 'UserField1',
                property: 'UserField1',
                label: 'How Many?',
                type: 'text',
                tag: 'SALE',
                maxTextLength: 32,
                validator: [validator.exceedsMaxTextLength, validator.notEmpty]
            },
            {
                name: 'UserField2',
                property: 'UserField2',
                label: 'Cost Quoted',
                type: 'text',
                tag: 'SALE',
                maxTextLength: 32,
                validator: [validator.exceedsMaxTextLength, validator.notEmpty]
            },
            {
                name: 'UserField3',
                property: 'UserField3',
                noteProperty: false,
                label: 'Custom',
                title: 'Custom',
                type: 'note',
                view: 'text_edit',
                tag: 'NOSHOW'
            },
            {
                name: 'UserField4',
                property: 'UserField4',
                noteProperty: false,
                label: 'Comments',
                title: 'Comments',
                type: 'note',
                view: 'text_edit',
                tag: 'NOSHOW'
            },
            {
                name: 'UserField5',
                property: 'UserField5',
                label: 'Manager called?',
                type: 'boolean',
                onText: this.yesText,
                offText: this.noText,
                tag: 'SALE'
            },
            {
                name: 'UserField6',
                property: 'UserField6',
                label: 'Where you on time?',
                type: 'boolean',
                onText: this.yesText,
                offText: this.noText,
                tag: 'NOSALE'
            },
            {
                name: 'UserField7',
                property: 'UserField7',
                noteProperty: false,
                label: 'Reason',
                title: 'Reason',
                type: 'note',
                view: 'text_edit',
                tag: 'NOSALE'
            },
            {
                name: 'UserField8',
                property: 'UserField8',
                label: 'How long did you wait?',
                type: 'text',
                tag: 'NOSALE',
                maxTextLength: 64,
                validator: [validator.exceedsMaxTextLength, validator.notEmpty]
            },
            {
                name: 'UserField9',
                property: 'UserField9',
                label: 'Did you call?',
                type: 'boolean',
                onText: this.yesText,
                offText: this.noText,
                tag: 'NOSHOW'
            },
            {
                name: 'UserField10',
                property: 'UserField10',
                noteProperty: false,
                label: 'Comments',
                title:'Comments',
                type: 'note',
                view: 'text_edit',
                tag: 'NOSHOW'  
            }
            ]);
        }
    });
});

