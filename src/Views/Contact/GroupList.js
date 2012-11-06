define('Mobile/Sample/Views/Contact/GroupList', [
    'dojo/_base/declare',
    'dojo/string',
    'argos/List',
    'argos/_SDataList'
], function(
    declare,
    string,
    List,
    _SDataList
) {

    return declare('Mobile.Sample.Views.Contact.GroupList', [List, _SDataList], {
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
            this.set('title',(options && options.title || this.title));
            this.inherited(arguments);
        },
        //This is a special system endpoint, not part of the standard dynamic entity feeds.
        createRequest: function() {
            var request = Mobile.Sample.Views.Contact.GroupList.superclass.createRequest.call(this)
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
                return Mobile.Sample.Views.Contact.GroupList.superclass.refreshRequiredFor.call(this, options);
        }
    });
});