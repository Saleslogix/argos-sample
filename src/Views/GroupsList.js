define('Mobile/Sample/Views/GroupsList', [
    'dojo/_base/declare',
    'dojo/dom-attr',
    'dojo/string',
    'argos/List',
    'argos/_SDataListMixin',
    'argos!scene'
], function(
    declare,
    domAttr,
    string,
    List,
    _SDataListMixin,
    scene
) {

    return declare('Mobile.Sample.Views.GroupsList', [List, _SDataListMixin], {
        //Templates
        //
        //Basic content template to show group name and family
        itemTemplate: new Simplate([
            '<h3>{%: $.name %}</h3>',
            '<h4>{%: $.family %}</h4>'
        ]),
        //Wrap the content template and provide the appropriate data properties for context.
        rowTemplate: new Simplate([
            '<li data-action="activateEntry" data-key="{%= $.$key %}" data-family="{%=$.family %}" data-descriptor="{%: $.$descriptor %}">',
            '<div data-action="selectEntry" class="list-item-selector"></div>',
            '{%! $$.itemTemplate %}',
            '</li>'
        ]),
        //View Properties
        id: 'groups_list',
        titleText: 'Groups',
        icon: 'content/images/icons/filter_24.png',
        resourceKind: 'groups',
        contractName: 'system',
        queryOrderBy: 'name',
        queryWhere: this.filterByUser,
        hashTagQueries: {
            'account': 'upper(family) eq "ACCOUNT"',
            'contact': 'upper(family) eq "CONTACT"'
            },

        formatSearchQuery: function(searchQuery) {
            return string.substitute('upper(name) like "${0}%"', [this.escapeSearchQuery(searchQuery.toUpperCase())]);
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
        filterByUser: function() {
            var where = [];

            //If logged in as a user, filter out the groups owned by admin, or we'll see duplicates.
            if (App.context.user.$key.toUpperCase() !== "ADMIN")
                where.push('userId ne "ADMIN"');

            //Just show Account and Contact groups for now.
            //upper() doesn't work with in clause.
            where.push('family in ("Account", "ACCOUNT", "Contact", "CONTACT")');

            return where.join(' and ');
        },
        //On selection, show the appropriate group list view based on the family of the selected group.
        activateEntry: function(e, node) {
            var view,
                key = domAttr.get(node, 'data-key'),
                family = domAttr.get(node, 'data-family'),
                descriptor = domAttr.get(node, 'data-descriptor');
            if (key) {
                if (family) {
                    if (family.toUpperCase() == 'ACCOUNT') {
                        view = 'account_grouplist';
                    }
                    else if (family.toUpperCase() == 'CONTACT') {
                        view = 'contact_grouplist';
                    }
                }
                if (view)
                    scene().showView(view,{_groupId: key, title: descriptor});
            }
        }
    });
});