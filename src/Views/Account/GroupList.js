define('Mobile/Sample/Views/Account/GroupList', [
    'dojo/_base/declare',
    'dojo/string',
    'argos/List',
    'argos/_SDataListMixin'
], function(
    declare,
    string,
    List,
    _SDataListMixin
) {

    return declare('Mobile.Sample.Views.Account.GroupList', [List, _SDataListMixin], {
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
        contractName: 'system',
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

        formatSearchQuery: function(searchQuery) {
            return string.substitute('ACCOUNT_UC like "${0}%"', [this.escapeSearchQuery(searchQuery.toUpperCase())]);
        },
        createToolLayout: function(){
            // Empty the toolbar. This is a read-only view.
            return this.tools || (this.tools = {
                'tbar': []
            });
        },
        _applyStateToQueryOptions: function(queryOptions) {
            this.inherited(arguments);

            queryOptions['queryArgs'] = {
                _groupId: this.options._groupId
            };
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
                return this.inherited(arguments);
        }
    });
});