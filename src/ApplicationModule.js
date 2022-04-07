/* Copyright (c) 2010, Sage Software, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
define('Mobile/Sample/ApplicationModule', [
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/string',
    'dojo/query',
    'dojo/dom-class',
    'crm/Format',
    'crm/Models/Account/SData',
    'argos/ApplicationModule',
    'Mobile/Sample/Views/GroupsList',
    'Mobile/Sample/Views/Account/GroupList',
    'Mobile/Sample/Views/Contact/GroupList',
    'Mobile/Sample/Views/GoogleMap',
    'crm/Application',
    'crm/DefaultMetrics',
    'argos/I18n'
], function(
    declare,
    lang,
    string,
    query,
    domClass,
    format,
    AccountSDataModel,
    ApplicationModule,
    GroupsList,
    AccountGroupList,
    ContactGroupList,
    GoogleMap,
    CRMApplication,
    DefaultMetrics,
    getResource
) {
    var resource = getResource('sampleApplicationModule');

    return declare('Mobile.Sample.ApplicationModule', ApplicationModule, {
        //localization strings
        regionText: resource.regionText,
        faxText: resource.faxText,
        helloWorldText: resource.helloWorldText,
        helloWorldValueText: resource.helloWorldValueText,
        parentText: resource.parentText,

        loadViews: function() {
            this.inherited(arguments);

           //Register views for group support
            this.registerView(new GroupsList());
            this.registerView(new AccountGroupList());
            this.registerView(new ContactGroupList());
           //Register custom Google Map view
            this.registerView(new GoogleMap());
        },
        loadCustomizations: function() {
            this.inherited(arguments);

            //We want to add the Groups list view to the default set of home screen views.
            //Save the original getDefaultviews() function.
            var originalDefViews = CRMApplication.prototype.getDefaultViews;
            lang.extend(CRMApplication, {
                getDefaultViews: function() {
                    //Get view array from original function, or default to empty array
                    var views = originalDefViews.apply(this, arguments) || [];
                    //Add custom view(s)
                    views.push('groups_list');
                    return views;
                }
            });

            this.registerActivityCustomizations();
            this.registerKPICustomizations();
            this.registerAccountCustomizations();
            this.registerContactCustomizations();
            this.registerOpportunityCustomizations();
            this.registerLeadCustomizations();
            this.registerErrorLogCustomizations();
        },
        registerActivityCustomizations: function() {
            this.registerCustomization('edit', 'activity_edit', {
                at: function(row) { return row.name === 'Account'; },
                type: 'modify',
                value: {
                    requireSelection: false
                }
            });

            this.registerCustomization('edit', 'activity_edit', {
                at: function(row) { return row.name === 'Contact'; },
                type: 'modify',
                value: {
                    requireSelection: false
                }
            });

        },
        registerKPICustomizations: function() {
            crm.DefaultMetrics.prototype.enableCustomizations = true; // bug in version < 4.3 of mobile
            this.registerCustomization('metrics/definitions', 'default_metrics', {
                at: function(row) {
                    return row && row.queryArgs && row.queryArgs._metricName === 'AverageTimeAsCustomer';
                },
                type: 'remove'
            });

            this.registerCustomization('metrics/definitions', 'default_metrics', {
                at: function(row) {
                    return row && row.resourceKind === 'history';
                },
                type: 'insert',
                value: {
                    resourceKind: 'customEntity',
                    children: [{
                        title: 'Metric Title',
                        queryName: 'executeMetric',
                        queryArgs: {
                        _filterName: 'FilterName',
                        _metricName: 'CountCustomEntity',
                        },
                        chartType: 'bar',
                        aggregate: 'sum',
                        formatter: 'bigNumber',
                        enabled: false,
                    }],
                }
            });
        },
        registerOpportunityCustomizations: function(){
            // Add the hash tag "g500k" to see all Opportunities worth more than $500k
            // Hash tags can be combined (uses AND logic) so try out:
            // #open #g500k
            // ... to see all Open Opportunities worth $500k or more
            this.registerCustomization('list/hashTagQueries', 'opportunity_list', {
                at: true, // insert anywhere (hash tag queries are not ordered)
                type: 'insert',
                value: {
                    tag: 'g500k',
                    query: 'SalesPotential gt "500000"'
                }
            });

            // When inserting values you may also pass an array to insert multiple items
            // This case its adding two hash tags: l500k and g1m for filtering
            // Opportunities worth less than $500,000 or greater than $1 million
            this.registerCustomization('list/hashTagQueries', 'opportunity_list', {
                at: true, // insert anywhere (hash tag queries are not ordered)
                type: 'insert',
                value: [
                    {
                        tag: 'l500k',
                        query: 'SalesPotential lt "500000"'
                    },{
                        tag: 'g1m',
                        query: 'SalesPotential gt "1000000"'
                    }]
            });

            // Remove the hash tag "won" from Opportunity List View Search
            // so if a user types #won it will perform a normal search for "#won"
            this.registerCustomization('list/hashTagQueries', 'opportunity_list', {
                // since we are looking for a particular key use at()
                // and test for the hash[key] existence
                at: function(row) { return row['key'] == 'won'; },
                type: 'remove'
            });

            // Modify the hash tag "lost" from Opportunity List View Search
            // to mean Type =  "Product"
            this.registerCustomization('list/hashTagQueries', 'opportunity_list', {
                // use at() to select our hash key
                at: function(row) { return row['key'] == 'lost'; },
                type: 'modify',
                value: {
                    query: 'Type eq "Product"'
                }
            });
        },
        registerAccountCustomizations: function() {

            // Register an error handler on account_list that will log to console.
            this.registerCustomization('list/errorHandlers', 'account_list', {
                at: true,
                type: 'insert',
                value: {
                    name: 'AccountListCustom',
                    test: function(error) {
                        return true;
                    },
                    handle: function(error, next) {
                        error.message = 'Error message handled from customization: ' + error.message;
                        console.error(error.message);
                        next();
                    }
                }
            });

            // Test the above error handler
            this.registerCustomization('list/actions', 'account_list', {
                at: true,
                type: 'insert',
                where: 'before',
                value: {
                    id: 'testErrorHandler',
                    label: 'Test Error Handler',
                    fn: function(action, selection) {
                        this.handleError(new Error('Testing the error handler'));
                    }
                }
            });

            // Add a quick action for navigating to a related view
            this.registerCustomization('list/actions', 'account_list', {
                at: function(action){ return action.id === 'callMain'; },
                type: 'insert',
                where: 'before',
                value: {
                    id: 'customAction1',
                    cls: 'fa fa-money fa-2x',
                    label: 'Opportunities',
                    fn: function(action, selection) {
                        // Get a reference to the navigateToRelatedView function in the base List
                        var nav = crm.Views.Account.List.prototype.navigateToRelatedView;
                        nav.call(this, action, selection, 'opportunity_related', 'Account.id eq "${0}"');
                    }
                }
            });

            // Add a custom list panel action to Account List that
            // shows a heart warming message
            this.registerCustomization('list/actions', 'account_list', {
                at: function(action){ return action.id === 'callMain'; },
                type: 'insert',
                where: 'before',
                value: {
                    id: 'customAction2',
                    cls: 'fa fa-globe fa-2x',
                    label: this.helloWorldText,
                    fn: function(action, selection) {
                        alert(selection.data['$descriptor']+' says "Hello!"');
                    }
                }
            });

            this.registerCustomization('list/group-templates', 'account_list', {
                at: function(i){
                    return i.name === 'Detail';
                },
                type: 'insert',
                where: 'before',
                value: {
                    name: 'Custom Summary',
                    displayName: 'Custom Summary',
                    type: 'Dynamic',
                    options: {
                      columns: [{
                        id: 'col1',
                        rows: 5,
                        clss: 'custom-css-cls-here',
                        hideLabels: true,
                      }],
                    },
                }
            });

            //Add a quick action to Account Detail
            this.registerCustomization('detail', 'account_detail', {
                at: function(row) { return row.action == 'addNote'; },
                type: 'insert',
                where: 'before',
                value: {
                    value: this.helloWorldValueText,
                    label: this.helloWorldText,
                    iconClass: 'fa fa-globe fa-lg',
                    action: 'showHelloWorld'
                }
            });

            //Add Region to the Account Detail view, right above the Type property
            this.registerCustomization('detail', 'account_detail', {
                at: function(row) { return row.name == 'Type'; },
                type: 'insert',
                where: 'before',
                value: {
                    name: 'Region',
                    label: this.regionText
                }
            });

            //Add a different default value when inserting a new Account
            this.registerCustomization('edit', 'account_edit', {
                at: function(row) {
                    return row.name == 'WebAddress';
                },
                type: 'modify',
                value: {
                    'default': 'www.default-example.com'
                }
            });

            //Add a different default value (complex) when inserting a new Account
            this.registerCustomization('edit', 'account_edit', {
                at: function(row) { return row.name == 'Address'; },
                type: 'modify',
                value: {
                    'default': {
                        'Description': 'Mailing',
                        'Country': 'Rigel VII'
                    }
                }
            });

            //Add Region to the Account edit view, and include a validation.
            this.registerCustomization('edit', 'account_edit', {
                at: function(row) { return row.name == 'Type'; },
                type: 'insert',
                where: 'before',
                value: {
                    name: 'Region',
                    label: this.regionText,
                    type: 'text',
                    //You can set the trigger to 'keyup' or 'blur'
                    validationTrigger: 'blur', //On field exit
                    validator: {
                        //Not using the view parameter, but wanted to show
                        //that it is available.
                        fn: function(value, field, view) {
                            //Don't let them change the value. [evil laugh]
                            return (value != field.originalValue);
                        },
                        //Three parameters available for your message:
                        //{0} = value
                        //{1} = Field.name
                        //{2} = Field.label
                        message: "'${0}' is an invalid value for field '${2}'."
                    }
                }
            });

            //Change label for fax on Account Detail view
            this.registerCustomization('detail', 'account_detail', {
                at: function(row) { return row.name == 'Fax'; },
                type: 'modify',
                value: {
                    label: this.faxText
                }
            });

            //Remove the Lead Source
            this.registerCustomization('detail', 'account_detail', {
                at: function(row) { return row.name == 'LeadSource.Description'; },
                type: 'remove'
            });

            //Add a quick action to Account detail to show custom map view
            this.registerCustomization('detail', 'account_detail', {
                at: function(row) { return row.action === 'addNote' },
                type: 'insert',
                value: {
                    value: 'Show Map',
                    label: 'location',
                    iconClass: 'fa fa-map-o fa-lg',
                    action: 'showMap'
                }
            });

            // Parent - related Account entity
            this.registerCustomization('detail', 'account_detail', {
                at: function(row) { return row.name == 'WebAddress'; },
                type: 'insert',
                where: 'before',
                value: {
                    name: 'ParentAccount',
                    label: this.parentText,
                    cls: 'content-loading',
                    value: 'loading...'
                }
            });

            //Parent Account lookup
            this.registerCustomization('edit', 'account_edit', {
                at: function(row) { return row.name == 'WebAddress'; },
                    type: 'insert',
                    where: 'before',
                    value: {
                        label: this.parentText,
                        name: 'ParentAccount',
                        type: 'lookup',
                        applyTo: '.',
                        emptyText: '',
                        valueKeyProperty: 'ParentId',
                        valueTextProperty: 'ParentAccount.AccountName',
                        view: 'account_related'
                    }
            });

            // Remove the Add Account/Contact option from the left drawer/global menu
            this.registerCustomization('left_drawer', 'left_drawer', {
                at: function(row) {
                    return row.name === 'AddAccountContactAction';
                },
                type: 'remove'
            });

            // Add a custom toolbar item to Account Detail that uses
            // the associated Edit Views "Update" security role
            this.registerCustomization('detail/tools', 'account_detail', {
                at: function(tool){ return tool.id === 'edit'; },
                type: 'insert',
                where: 'after',
                value: {
                    id: 'customButton',
                    cls: 'fa fa-globe fa-lg',
                    action: 'showHelloWorld',
                    // Calling App.getViewSecurity will initialize the view and call startup to process the layout.
                    // Ensure this is called last so customizations are loaded before the layout is processed.
                    security: App.getViewSecurity(crm.Views.Account.Detail.prototype.editView, 'update')
                }
            });

            lang.extend(crm.Views.Account.List, {
                // NOTICE: After 3.4, this is no longer the preferred method to customize the
                // querySelect. It will work for backwards compatibility for online only. See the
                // account detail customization section which shows how to customize the model
                // which will work for offline support.
                querySelect: crm.Views.Account.List.prototype.querySelect.concat([
                    'AccountManager/UserInfo/Email'
                ]),
                itemTemplate: new Simplate([
                    '<h3>{%: $.AccountName %}</h3>',
                    '<h4>{%: $.Industry %}</h4>',
                    '<h4>',
                        '{%: $$.joinFields(" | ", [$.Type, $.SubType]) %}',
                    '</h4>',
                    '<h4>{%: $.AccountManager && $.AccountManager.UserInfo ? $.AccountManager.UserInfo.UserName : "" %} | {%: $.Owner.OwnerDescription %}</h4>',
                    '<h4>{%: $.WebAddress %}</h4>',
                    '<h4>{%: $.AccountManager && $.AccountManager.UserInfo ? $.AccountManager.UserInfo.Email : "" %}</h4>',
                    '{% if ($.MainPhone) { %}',
                        '<h4>',
                            '{%: $$.phoneAbbreviationText + argos.Format.phone($.MainPhone) %}',
                        '</h4>',
                    '{% } %}',
                    '{% if ($.Fax) { %}',
                        '<h4>',
                            '{%: $$.faxAbbreviationText + argos.Format.phone($.Fax) %}',
                        '</h4>',
                    '{% } %}'
                ])
            });

            // NOTICE: This is the proper method of modifying query parameters for 3.4 and later.
            // querySelect customizations should now go into the model, not the view.
            this.registerCustomization('models/detail/querySelect', 'account_sdata_model', {
                at: function() { return true; },
                type: 'insert',
                where: 'after',
                value: 'Region'
            });

            this.registerCustomization('models/detail/querySelect', 'account_sdata_model', {
                at: function() { return true; },
                type: 'insert',
                where: 'after',
                value: 'ParentId'
            });

            // Other query properties on the model
            this.registerCustomization('models/queryModel', 'account_sdata_model', {
                at: function(queryModel) { return queryModel.name === 'list'; },
                type: 'modify',
                value: {
                    queryOrderBy: 'Industry desc'
                }
            })

            //Some customizations require extending the view class.
            lang.extend(crm.Views.Account.Detail, {
                //Localization String
                helloWorldAlertText: 'Hello World!',

                // NOTICE: After 3.4, this is no longer the preferred method to customize the
                // querySelect. It will work for backwards compatibility for online only. See the
                // account detail customization section which shows how to customize the model
                // which will work for offline support.
                //querySelect: crm.Views.Account.Detail.prototype.querySelect.concat([
                //    'Region', 'ParentId'
                //]),

                //Implement a minimal function for our custom action.
                showHelloWorld: function() {
                    alert(this.helloWorldAlertText);
                },

                requestParentAccount: function(parentId)
                {

                    var request = new Sage.SData.Client.SDataSingleResourceRequest(this.getService())
                        .setResourceKind('accounts')
                        .setResourceSelector(string.substitute("'${0}'", [parentId]))
                        .setQueryArg('select', 'AccountName');

                    request.allowCacheUse = true;
                    request.read({
                        success: this.processParentAccount,
                        failure: this.processParentAccountFailure,
                        scope: this
                    });

                },
                processParentAccountFailure: function(xhr, o) {
                    this.updateParentAccountDisplay();
                },
                processParentAccount: function(parentEntry) {
                    if (parentEntry)
                    {
                        this.entry['ParentAccount'] = parentEntry;
                        this.updateParentAccountDisplay();
                    }

                },
                updateParentAccountDisplay: function() {
                    var rowNode = query('[data-property="ParentAccount"]', this.domNode)[0],
                        contentNode = rowNode && query('span', rowNode)[0];

                    if (rowNode)
                        domClass.remove(rowNode, 'content-loading');

                    if (contentNode)
                        contentNode.innerHTML = (this.entry.ParentAccount && this.entry.ParentAccount.AccountName) || '';
                },
                processEntry: function(entry) {
                    crm.Views.Account.Detail.superclass.processEntry.apply(this, arguments);
                    if (entry && entry['ParentId'])
                    {
                        this.requestParentAccount(entry['ParentId']);
                    }
                    else
                    {
                        this.updateParentAccountDisplay();
                    }

                },
                //Add a supporting action for displaying the map view.
                showMap: function() {
                    var view = App.getView('googlemapview');
                    if (view)
                        view.show({
                            key: this.options.key,
                            entity: 'Account',
                            address: format.address(this.entry['Address'], true, ' '),
                            markerTitle: this.entry['AccountName'],
                            entry: this.entry
                        });
                }
            });

            lang.extend(crm.Views.Account.Edit, {
                // NOTICE: After 3.4, this is no longer the preferred method to customize the
                // querySelect. It will work for backwards compatibility for online only. See the
                // account detail customization section which shows how to customize the model
                // which will work for offline support.
                querySelect: crm.Views.Account.Edit.prototype.querySelect.concat([
                    'ParentId'
                ])
            });

            // Adds a #hash tag query to the Account List View Search
            // Shows you can pass a dynamic query to a hash tag
            // in this case it uses the current users ID/key
            this.registerCustomization('list/hashTagQueries', 'account_list', {
                at: true,
                type: 'insert',
                value: {
                    tag: 'mine',
                    query: function() {
                        return string.substitute('AccountManager.Id eq "${0}"', [App.context['user']['$key']]);
                    }
                }
            });
        },
        registerContactCustomizations: function() {
            //Override the list view row template in order to show phone #
            lang.extend(crm.Views.Contact.List, {
                // NOTICE: After 3.4, this is no longer the preferred method to customize the
                // querySelect. It will work for backwards compatibility for online only. See the
                // account detail customization section which shows how to customize the model
                // which will work for offline support.
                querySelect: crm.Views.Contact.List.prototype.querySelect.concat([
                    'WorkPhone'
                ]),
                itemTemplate: new Simplate([
                    '<h3>{%: $.NameLF %}</h3>',
                    '<h4>{%: $.AccountName %}</h4>',
                    '<h4>{%: crm.Format.phone($.WorkPhone, false) %}</h4>'
                ])
            });

            // Here we add a tool with its own custom security
            // Admin user can access everything, others have to match the security string
            // from the securedActions for user role returned via sdata after login
            // this one is shown on Contact List
            this.registerCustomization('list/tools', 'contact_list', {
                at: function(tool) { return tool.id === 'new' },
                type: 'insert',
                where: 'after',
                value: {
                    security: 'Entities/Contact/CustomAction',
                    id: 'custom-action',
                    cls: 'fa fa-user fa-2x',
                    fn: function() { alert('We have clearance to this Secured Action!'); }
                }
            });

            // Override the default alert error and show the validation
            // exception message from the server
            this.registerCustomization('edit/errorHandlers', 'contact_edit', {
                at: function(row) {
                  return row.name === 'AlertError';
                },
                type: 'modify',
                value: {
                    handle: function(error, next) {
                        // The original XHR is preserved on the error object.
                        // Unwrap the response from the server and parse the JSON.
                        var xhr = error.xhr;
                        var response = '';
                        if (xhr) {
                          response = JSON.parse(xhr.responseText);
                          if (response && response.length > 0) {
                            alert(response[0].message);
                          }
                        }
                        next();
                    }
                }
            });
        },
        registerLeadCustomizations: function() {

            //Change Notes on Lead Edit view to use Signature control
            var signatureText = 'signature';
            this.registerCustomization('edit', 'lead_edit', {
                at: function(row) { return row.name == 'Notes'; },
                type: 'modify',
                value: {
                    label: signatureText,
                    type: 'signature',
                    view: 'signature_edit'
                }
            });

            // Display Signature in place of Notes on Lead Detail view
            this.registerCustomization('detail', 'lead_detail', {
                at: function(row) { return row.name == 'Notes'; },
                type: 'modify',
                value: {
                    label: signatureText,
                    property: 'Notes',
                    renderer: format.imageFromVector.bindDelegate(
                        this,
                        {
                            penColor: 'blue',
                            lineWidth:     1,
                            width:       180,
                            height:       50
                        },
                        true // return HTML <img>
                    )
                }
            });
        },
        registerErrorLogCustomizations: function(){
            /*
                When a server error occurs the server response is parsed and saved to localStorage (and in current session memory)
                A user may then go to Settings -> View Error Logs and see the last 10 errors
                The Detail view of an error log contains either an email button (mobile devices) or copy to clipboard button (desktops).

                The following properties are exposed so that you may tailor as needed:
             */
            lang.mixin(argos.ErrorManager, {
                // number of error logs to keep on device, defaults to 10
                errorCacheSizeMax: 15
            });

            lang.extend(crm.Views.ErrorLog.Detail, {
                // for mobile devices this string will set as the To: field
                // defaults to empty
                defaultToAddress: 'techs@super-support.com',

                // for mobile devices this string will be set as the Subject: field
                emailSubjectText: 'SLXMobile Error Report',

                // for desktops the message to display when it is copied to clipboard
                copiedSuccessText: 'Error Report copied to clipboard'
            });
        }
    });
});
