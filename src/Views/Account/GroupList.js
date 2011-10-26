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

define('Mobile/Sample/Views/Account/GroupList', ['Sage/Platform/Mobile/List'], function() {

    return dojo.declare('Mobile.Sample.Views.Account.GroupList', [Sage.Platform.Mobile.List], {
        //Templates
        //No $key or $descriptor with groups endpoint.
        itemTemplate: new Simplate([
            '<h3>{%: $.ACCOUNT %}</h3>',
            '<h4>{%: $.ACCOUNTMANAGERIDNAME %}</h4>'
        ]),
        //OOB itemTemplate assumes $key and $descriptor, but that's not the case with the groups endpoint.
        rowTemplate: new Simplate([
            '<li data-action="activateEntry" data-key="{%= $.ACCOUNTID %}" data-descriptor="{%: $.ACCOUNT %}">',
            '<div data-action="selectEntry" class="list-item-selector"></div>',
            '{%! $$.itemTemplate %}',
            '</li>'
        ]),

        //Localization
        titleText: 'Accounts',

        //View Properties
        detailView: 'account_detail',
        expose: false,
        icon: 'content/images/icons/Company_24.png',
        id: 'account_grouplist',
        insertView: 'account_edit',
        queryOrderBy: 'ACCOUNT_UC',
        querySelect: [
            'ACCOUNTID',
            'ACCOUNT',
            'ACCOUNTMANAGERIDNAME',
            'ACCOUNT_UC'
        ],
        //Note the custom resourceKind to get to the group.
        resourceKind: 'groups/$queries/execute',

        formatSearchQuery: function(query) {
            return dojo.string.substitute('ACCOUNT_UC like "${0}%"', [this.escapeSearchQuery(query.toUpperCase())]);
        },
        init: function() {
            this.inherited(arguments);
        },
        createToolLayout: function(){
            // Empty the toolbar. This is a read-only view.
            return this.tools || (this.tools = {
                'tbar': []
            });
        },
        show: function(options) {
            this.set('title', options && options.title || this.title);

            this.inherited(arguments);
        },
        //This is a special system endpoint, not part of the standard dynamic entity feeds.
        createRequest: function() {
            var request = Mobile.Sample.Views.Account.GroupList.superclass.createRequest.call(this)
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
                return Mobile.Sample.Views.Account.GroupList.superclass.refreshRequiredFor.call(this, options);
        }
    });
});