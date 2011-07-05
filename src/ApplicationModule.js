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

Ext.namespace('Mobile.Sample');

Mobile.Sample.ApplicationModule = Ext.extend(Sage.Platform.Mobile.ApplicationModule, {
    //localization strings
    regionText: 'region',
    faxText: 'fax num',
    helloWorldText: 'Say Hello.',
    helloWorldValueText: 'Click to show alert.',

    loadViews: function() {
        Mobile.Sample.ApplicationModule.superclass.loadViews.apply(this, arguments);

       //Register custom Google Map view
        this.registerView(new Mobile.Sample.GoogleMap());
	   //Register TicketActivity list view, but don't show on home page.
        this.registerView(new Mobile.Sample.TicketActivity.List({
            id: 'ticketActivity_related',
            expose: false
        }));        
    },
    loadCustomizations: function() {
        Mobile.Sample.ApplicationModule.superclass.loadCustomizations.apply(this, arguments);

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

        //Add the supporting action method to the account detail
        Ext.override(Mobile.SalesLogix.Account.Detail, {
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

        //Some customizations require extending the view class.
        Ext.override(Mobile.SalesLogix.Account.Detail, {
            //Localization String
            helloWorldAlertText: 'Hello World!',
            
            //Add Region property to the SData query for the Account Detail view
            querySelect: Mobile.SalesLogix.Account.Detail.prototype.querySelect.concat([
                'Region'
            ]),
            //Implement a minimal function for our custom action.
            showHelloWorld: function() {
                alert(this.helloWorldAlertText);
            },
            //Add a custom toolbar button to the Account Detail view.
            init: function() {
                Mobile.SalesLogix.Account.Detail.superclass.init.apply(this, arguments);
                this.tools.tbar.push({
                    id: 'customButton',
                    icon: 'content/images/icons/Hello_World_24.png',
                    action: 'showHelloWorld'
                });
            }
        });
    },
    registerContactCustomizations: function() {
        //Override the list view row template in order to show phone #
        Ext.override(Mobile.SalesLogix.Contact.List, {
            //First, make sure WorkPhone is included in the SData query.
            querySelect: Mobile.SalesLogix.Contact.List.prototype.querySelect.concat([
                'WorkPhone'
            ]),            
            contentTemplate: new Simplate([
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
                    return String.format('Ticket.id eq "{0}"', entry['$key'])
                }
            }
        });
    }
        
});
