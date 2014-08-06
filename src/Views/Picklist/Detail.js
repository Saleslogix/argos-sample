define('Mobile/Sample/Views/Picklist/Detail', [
	'dojo/_base/declare',
    'dojo/_base/array',
    'Mobile/SalesLogix/Format',
    'Sage/Platform/Mobile/ErrorManager',
    'Mobile/SalesLogix/Template',
    'Sage/Platform/Mobile/Detail',
    'dojo/NodeList-manipulate'
], function (
	declare,
    array,
    format,
    ErrorManager,
    template,
    Detail,
    NodeList
) {
    return declare('Mobile.Sample.Views.Picklist.Detail', [Detail], {

        // Localization
        label: 'Current Picklist Values',
        valueLabel: 'Item ',

        // View Properties
        id: 'picklist_detail',
        editView: 'picklist_edit',
        listView: 'picklist_list',
        queryInclude: ['items'],
        querySelect: [
            'items/text',
            'items/number'
        ],
        resourceKind: 'pickLists',
        contractName: 'system',
        relationshipProperty: 'items',
        refreshRequired: true,
        store: null,
        layout: null,
        
        // Dynamically creates the layout for the picklist items.
        createLayout: function () {
            console.dir(this.entry);
            this.layout = null;
            var items,
            results = [],
            i = 1;

            array.forEach(this.entry.items.$resources, function (item) {
                items = {
                    name: item.text,
                    property: item.text,
                    label: this.valueLabel + i,
                    // Use renderer to evaluate the item.text value and place it into a header template
                    renderer: function (value) {
                        var template = '<h3> {%: $.value %} </h3>';
                        var result = new Simplate(template).apply({ value: item.text });
                        return result;
                    }
                };
                i++;
                results.push(items);
            }, this);

            return this.layout || (this.layout = [{
                title: this.label,
                children: results
            }]
            );
        },
        navigateToEditView: function () {
            var view = App.getView(this.editView);
            if (view) {
                this.refreshRequired = true;

                view.show({
                    title: this.title,
                    template: {},
                    entry: this.entry,
                    store: null,
                    refreshRequired: true
                });
            }
        }
    });
});