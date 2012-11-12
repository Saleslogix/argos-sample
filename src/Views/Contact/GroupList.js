define('Mobile/Sample/Views/Contact/GroupList', [
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

    return declare('Mobile.Sample.Views.Contact.GroupList', [List, _SDataListMixin], {
        //Templates
        itemTemplate: new Simplate([
            '<h3>{%: $.NAMELF %}</h3>',
            '<h4>{%: $.ACCOUNT %}</h4>'
        ]),
        //OOTB itemTemplate assumes $key and $descriptor, but that's not the case with the groups endpoint.
        rowTemplate: new Simplate([
            '<li data-action="activateEntry" data-key="{%= $.CONTACTID %}" data-descriptor="{%: $.$descriptor %}">',
            '<div data-action="selectEntry" class="list-item-selector"></div>',
            '{%! $$.itemTemplate %}',
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
        contractName: 'system',
        queryOrderBy: 'NAMELF',
        querySelect: [
            'CONTACTID',
            'NAMELF',
            'ACCOUNT'
        ],
        //Note the custom resourceKind to get to the group.
        resourceKind: 'groups/$queries/execute',

        formatSearchQuery: function(searchQuery) {
            return string.substitute('NAMELF like "${0}%"', [this.escapeSearchQuery(searchQuery.toUpperCase())]);
        },
        createToolLayout: function(){
            // Empty the toolbar. This is a read-only view.
            return this.tools || (this.tools = {
                'tbar': []
            });
        },
        //This is a special system endpoint, not part of the standard dynamic entity feeds.
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