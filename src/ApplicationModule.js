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
(function() {

define('Mobile/Sample/ApplicationModule', ['Mobile/SalesLogix/ApplicationModule'], function() {

    return dojo.declare('Mobile.Sample.ApplicationModule', [Sage.Platform.Mobile.ApplicationModule], {
       //localization strings
        regionText: 'region',
        faxText: 'fax num',
        helloWorldText: 'Say Hello.',
        helloWorldValueText: 'Click to show alert.',
        parentText: 'parent',

        loadViews: function() {
            this.inherited(arguments);

           //Register views for group support
            /*
            this.registerView(new Mobile.Sample.Views.GroupsList());
            this.registerView(new Mobile.Sample.Views.Account.GroupList());
            this.registerView(new Mobile.Sample.Views.Contact.GroupList());
           //Register custom Google Map view
            this.registerView(new Mobile.Sample.Views.GoogleMap());
            */
        },
        loadCustomizations: function() {
            this.inherited(arguments);

            //We want to add the Groups list view to the default set of home screen views.
            //Save the original getDefaultviews() function.
            var originalDefViews = Mobile.SalesLogix.Application.prototype.getDefaultViews;
            dojo.extend(Mobile.SalesLogix.Application, {
                getDefaultViews: function() {
                    //Get view array from original function, or default to empty array
                    var views = originalDefViews.apply(this, arguments) || [];
                    //Add custom view(s)
                    views = views.concat(['groups_list']);
                    return views;
                }
            });

            this.registerAccountCustomizations();
            this.registerContactCustomizations();
            this.registerTicketCustomizations();
        },
        registerAccountCustomizations: function() {

            //Add a quick action to Account Detail
            this.registerCustomization('detail', 'account_detail', {
                at: function(row) { return row.action == 'addNote'; },
                type: 'insert',
                where: 'before',
                value: {
                    value: this.helloWorldValueText,
                    label: this.helloWorldText,
                    icon: 'content/images/icons/Hello_World_24.png',
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
                        message: "'{0}' is an invalid value for field '{2}'."
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

            //Hide the Lead Source
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
                    icon: 'content/images/icons/Map_24.png',
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

            //Some customizations require extending the view class.
            dojo.extend(Mobile.SalesLogix.Views.Account.Detail, {
                //Localization String
                helloWorldAlertText: 'Hello World!',

                //Add Region property to the SData query for the Account Detail view
                querySelect: Mobile.SalesLogix.Views.Account.Detail.prototype.querySelect.concat([
                    'Region', 'ParentId'
                ]),
                //Implement a minimal function for our custom action.
                showHelloWorld: function() {
                    alert(this.helloWorldAlertText);
                },

                //Add a custom toolbar button to the Account Detail view.
                /* todo: change to new tbar customize
                init: function() {
                    this.inherit(arguments);
                    this.tools.tbar.push({
                        id: 'customButton',
                        icon: 'content/images/icons/Hello_World_24.png',
                        action: 'showHelloWorld'
                    });
                },
                */


                requestParentAccount: function(parentId)
                {

                    var request = new Sage.SData.Client.SDataSingleResourceRequest(this.getService())
                        .setResourceKind('accounts')
                        .setResourceSelector(dojo.string.substiture("'${0}'", [parentId]))
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
                    var rowEl = this.el.child('[data-property="ParentAccount"]'),
                        contentEl = rowEl && rowEl.child('span');

                    if (rowEl)
                        rowEl.removeClass('content-loading');

                    if (contentEl)
                        contentEl.update((this.entry.ParentAccount && this.entry.ParentAccount.AccountName) || '');
                },
                processEntry: function(entry) {
                    this.inherited(arguments);

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
                            address: Mobile.SalesLogix.Format.address(this.entry['Address'], true, ' '),
                            markerTitle: this.entry['AccountName'],
                            entry: this.entry
                        });
                }
            });

            dojo.extend(Mobile.SalesLogix.Views.Account.Edit, {
                // Add properties to the SData query for Account Edit mode
                querySelect: Mobile.SalesLogix.Views.Account.Edit.prototype.querySelect.concat([
                    'ParentId'
                ])
            });

            dojo.extend(Mobile.SalesLogix.Views.Account.List, {
                hashTagQueries: dojo.mixin(Mobile.SalesLogix.Views.Opportunity.List.prototype.hashTagQueries || {}, {
                    'mine': function() {
                        return dojo.string.substitute('AccountManager.Id eq "${0}"', [App.context['user']['$key']]);
                    }
                })
            });
        },
        registerContactCustomizations: function() {
            //Override the list view row template in order to show phone #
            dojo.extend(Mobile.SalesLogix.Views.Contact.List, {
                //First, make sure WorkPhone is included in the SData query.
                querySelect: Mobile.SalesLogix.Views.Contact.List.prototype.querySelect.concat([
                    'WorkPhone'
                ]),
                itemTemplate: new Simplate([
                    '<h3>{%: $.NameLF %}</h3>',
                    '<h4>{%: $.AccountName %}</h4>',
                    '<h4>{%: Mobile.SalesLogix.Format.phone($.WorkPhone, false) %}</h4>'
                ])
            });
        },
        registerTicketCustomizations: function() {
            //Add a related view for TicketActivities.
            this.registerCustomization('detail', 'ticket_detail', {
                at: function(row) { return row.view === 'activity_related' },
                type: 'insert',
                value: {
                    label: 'Ticket Activities',
                    icon: 'content/images/icons/Ticket_Activities_24x24.png',
                    view: 'ticketActivity_related',
                    //This shows how to access the current SData Feed Entry
                    where: function(entry) {
                        return dojo.string.substitute('Ticket.id eq "${0}"', [entry['$key']])
                    }
                }
            });
        }
    });
});
})();