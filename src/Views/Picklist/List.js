define('Mobile/Sample/Views/Picklist/List', [
	'dojo/_base/declare',
	'dojo/_base/array',
	'dojo/query',
	'dojo/string',
    'Mobile/SalesLogix/Format',
	'Sage/Platform/Mobile/List'
], function (
	declare,
	array,
	query,
	string,
    format,
	List
) {
    return declare('Mobile.Sample.Views.Picklist.List', [List], {
        // Template
        itemTemplate: new Simplate([
			'<h3> {%: $.name %} </h3>'
        ]),

        // Localization
        titleText: 'All Picklists',
        viewPicklistText: '',

        // View Properties
        id: 'picklist_list',
        queryOrderBy: 'name',
        querySelect: [
            'name',
            'key',
        ],
        resourceKind: 'pickLists',
        contractName: 'system',
        detailView: 'picklist_detail',
        allowSelection: true,

        navigateToDetailsView: function() {
            var view = App.getView(this.detailView);
            if (view) {
                this.refreshRequired = true;

                view.show({
                    template: {},
                    entry: this.entry,
                    insert: true
                });
            }
        },
        createToolLayout: function () {
            return this.tools || (this.tools = {
            });
        },
        // Formats the search query to look for picklist names similar to the value searched
        formatSearchQuery: function (searchQuery) {
            return string.substitute('name like "%${0}%"', [this.escapeSearchQuery(searchQuery.toUpperCase())]);
        }
    });
});