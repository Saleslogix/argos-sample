
/**
 * Defines a simple toolbar to place buttons within.

 *
 * @alternateClassName FilterBar
 * @extends Toolbar
 */
define('Mobile/Sample/FilterBar', [
    'dojo/_base/array',
    'dojo/_base/declare',
    'dojo/dom-attr',
    'dojo/dom-class',
    'dojo/string',
    'argos/ActionBar',
    './FilterTab'
], function(
    array,
    declare,
    domAttr,
    domClass,
    string,
    ActionBar,
    FilterTab
) {

    return declare('Mobile.Sample.FilterBar', [ActionBar], {
        position: 'filter',
        itemType: FilterTab,
        _itemsByGroup: null,
        toggle: function(e, node) {
            var filter = this._itemsByName[domAttr.get(node, 'data-filter')],
                group = this._itemsByGroup[filter.get('group')];

            console.log('in toggle', filter, group);
            array.forEach(group, function(item) {
                console.log(item, this, item === this, item == this);
                if (item === this)
                    item.set('active', !item.get('active'));
                else
                    item.set('active', false);
            }, filter);

            //var view = this.get('context');
        },
        getActiveFilterQueries: function() {
            var queries = [];
            array.forEach(this._items, function(filter) {
                if (filter.get('active') === true)
                    queries.push(filter.query);
            });
            return queries.join(' and ');
        },
        _setItemsAttr: function(values, options) {
            if (typeof values == 'undefined') return;

            this.clear();

            var context = this.get('context'),
                key = options && options.key,
                itemsByName = {},
                itemsByGroup = {},
                items = array.map(values, function(value) {
                    var item = this._create(value, key);

                    this._update(item, context);
                    this._place(item);

                    itemsByName[item.get('name')] = item;

                    var group = item.get('group');
                    if (itemsByGroup[group])
                        itemsByGroup[group].push(item);
                    else
                        itemsByGroup[group] = [item];

                    return item;
                }, this);

            this._items = items;
            this._itemsByName = itemsByName;
            this._itemsByGroup = itemsByGroup;

            this._commandsByName = itemsByName;

            this.onContentChange();
        }
    });
});
