/**
 * Created by JetBrains WebStorm.
 * User: jhershauer
 * Date: 7/11/11
 * Time: 9:03 PM
 * To change this template use File | Settings | File Templates.
 */
/// <reference path="../../../../../argos-sdk/libraries/ext/ext-core-debug.js"/>
/// <reference path="../../../../../argos-sdk/libraries/sdata/sdata-client-debug"/>
/// <reference path="../../../../../argos-sdk/libraries/Simplate.js"/>
/// <reference path="../../../../../argos-sdk/src/View.js"/>
/// <reference path="../../../../../argos-sdk/src/List.js"/>

Ext.namespace("Mobile.Sample.Contact");

(function() {
    Mobile.Sample.Contact.GroupList = Ext.extend(Sage.Platform.Mobile.List, {
        //Templates
        contentTemplate: new Simplate([
            '<h3>{%: $.NAMELF %}</h3>',
            '<h4>{%: $.ACCOUNT %}</h4>'
        ]),
        //OOTB itemTemplate assumes $key and $descriptor, but that's not the case with the groups endpoint.
        itemTemplate: new Simplate([
            '<li data-action="activateEntry" data-key="{%= $.CONTACTID %}" data-descriptor="{%: $.$descriptor %}">',
            '<div data-action="selectEntry" class="list-item-selector"></div>',
            '{%! $$.contentTemplate %}',
            '</li>'
        ]),

        //Localization
        titleText: 'Contacts',

        //View Properties
        detailView: 'contact_detail',
        expose: false,
        icon: 'content/images/icons/Contacts_24x24.png',
        id: 'contact_grouplist',
        insertView: 'contact_edit',
        queryOrderBy: 'NAMELF',
        querySelect: [
            'CONTACTID',
            'NAMELF',
            'ACCOUNT'
        ],
        //Note the custom resourceKind to get to the group.
        resourceKind: 'groups/$queries/execute',

        formatSearchQuery: function(query) {
            return String.format('NAMELF like "{0}%"', this.escapeSearchQuery(query.toUpperCase()));
        },
        init: function() {
            Mobile.Sample.Contact.GroupList.superclass.init.apply(this, arguments);
            // Empty the toolbar. This is a read-only view.
            this.tools.tbar = [];
        },
        show: function(options) {
            this.setTitle(options && options.title || this.title);

            Mobile.Sample.Contact.GroupList.superclass.show.apply(this, arguments);
        },
        //This is a special system endpoint, not part of the standard dynamic entity feeds.
        createRequest: function() {
            var request = Mobile.Sample.Contact.GroupList.superclass.createRequest.call(this)
                .setContractName('system');
            request.setQueryArg('_groupId', this.options._groupId);
            return request;
        },
        activateEntry: function(params) {
            var view = App.getView(this.detailView);
            if (view)
                view.show({
                    descriptor: params.descriptor,
                    key: params.key
                });
        },
        //See if we need to refresh the view (only if we're showing a different group than the last time)
        refreshRequiredFor: function(options) {
            if (this.options)
            {
                if (options)
                {
                    if (this.expandExpression(this.options._groupId) != this.expandExpression(options._groupId)) return true;
                }

                return false;
            }
            else
                return Mobile.Sample.Contact.GroupList.superclass.refreshRequiredFor.call(this, options);
        }
    });
})();