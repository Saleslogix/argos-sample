define('Mobile/Sample/Views/Picklist/Item', [
    'dojo/_base/declare',
    'dojo/string',
    'Mobile/SalesLogix/Validator',
    'Mobile/SalesLogix/Format',
    'Mobile/SalesLogix/Template',
    'Sage/Platform/Mobile/Edit'
], function (
    declare,
    string,
    validator,
    format,
    template,
    Edit
) {

    return declare('Mobile.Sample.Views.Picklist.Item', [Edit], {
        //Templates

        // Localization
        titleText: 'Current Values',
        nameText: 'text',
        codeText: 'code',
        orderText: 'order',
        isDefaultText: 'is default item',

        //View Properties
        entityName: 'Picklist',
        id: 'picklist_item',
        queryInclude: ['items'],
        querySelect: [
            'items/text',
            'items/code',
            'items/number'
        ],
        resourceKind: 'pickLists',
        contractName: 'system',
        expose: false,
        enableSearch: false,
        selectionOnly: true,
        allowSelection: true,
        autoClearSelection: false,
        inserting: false,

        init: function () {
            this.inherited(arguments);
        },
        createLayout: function () {
            return this.layout || (this.layout = [{
                label: this.nameText,
                name: 'items/text',
                property: 'text',
                type: 'text',
                validator: validator.notEmpty
            }, {
                label: this.orderText,
                name: 'items/number',
                property: 'number',
                type: 'text'
            }, {
                label: this.codeText,
                name: 'items/code',
                property: 'code',
                type: 'text'
            } /*, {
                label: this.isDefaultText,
                name: 'defaultValue',
                property: 'default',
                type: 'boolean'
            }*/]);
        } 
        /*createToolLayout: function () {
            return this.tools || (this.tools = {
                tbar: [{
                    id: 'save',
                    cls: 'fa fa-check fa-fw fa-lg',
                    fn: this.savePreferences,
                    scope: this
                }, {
                    id: 'cancel',
                    cls: 'fa fa-ban fa-fw fa-lg',
                    side: 'left',
                    fn: ReUI.back,
                    scope: ReUI
                }]
            });
        }
        savePreferences: function () {
            var visible, order, view;

            App.preferences.home = App.preferences.home || {};
            App.preferences.configure = App.preferences.configure || {};

            // clear existing
            visible = App.preferences.home.visible = [];
            order = App.preferences.configure.order = [];

            // since the selection model does not have ordering, use the DOM
            query('li', this.domNode).forEach(function (node) {
                var key = domAttr.get(node, 'data-key');
                if (key) {
                    order.push(key);

                    if (domClass.contains(node, 'list-item-selected')) {
                        visible.push(key);
                    }
                }
            });

            App.persistPreferences();

            ReUI.back();
            view = App.getView('left_drawer');
            if (view) {
                view.refresh();
            } 
        }
        

        update: function() {
            var values;
            values = this.getValues();
            if (values) {
                this.disable();
                this.onUpdate(values);

            } else {
                this.onUpdateCompleted(false);
            }
        },
        onUpdate: function(values) {
            var store, putOptions, entry;
            store = this.get('store');
            if (store) {
                putOptions = {
                        overwrite: true,
                        id: store.getIdentity(this.entry)
                };
                entry = this.createEntryForUpdate(values);

                this._applyStateToPutOptions(putOptions);

                Deferred.when(store.put(entry, putOptions),
                    lang.hitch(this, this.onPutComplete, entry),
                    lang.hitch(this, this.onPutError, putOptions)
                );
            }
        },
        insert: function() {
            var values;
            this.disable();

            values = this.getValues();
            if (values) {
                this.onInsert(values);
            } else {
                ReUI.back();
            }
        },
        onInsert: function(values) {
            var store, addOptions, entry, request;
            store = this.get('store');
            if (store) {
                addOptions = {
                        overwrite: false
                };
                entry = this.createEntryForInsert(values);

                this._applyStateToAddOptions(addOptions);

                Deferred.when(store.add(entry, addOptions),
                    lang.hitch(this, this.onAddComplete, entry),
                    lang.hitch(this, this.onAddError, addOptions)
                );
            }
        },
        getValues: function(all) {
            var payload = {},
                empty = true,
                field,
                value,
                target,
                include,
                exclude,
                name,
                prop;

            for (name in this.fields) {
                field = this.fields[name];
                value = field.getValue();

                include = this.expandExpression(field.include, value, field, this);
                exclude = this.expandExpression(field.exclude, value, field, this);

                if (include !== undefined && !include) {
                    continue;
                }
                if (exclude !== undefined && exclude) {
                    continue;
                }

                // for now, explicitly hidden fields (via. the field.hide() method) are not included
                if (all || ((field.alwaysUseValue || field.isDirty() || include) && !field.isHidden())) {
                    if (field.applyTo !== false) {
                        if (typeof field.applyTo === 'function') {
                            if (typeof value === 'object') {
                                // Copy the value properties into our payload object
                                for (prop in value) {
                                    payload[prop] = value[prop];
                                }
                            }

                            field.applyTo(payload, value);
                        } else if (typeof field.applyTo === 'string') {
                            target = utility.getValue(payload, field.applyTo);
                            lang.mixin(target, value);
                        }
                    } else {
                        utility.setValue(payload, field.property || name, value);
                    }

                    empty = false;
                }
            }
                        return empty ? false : payload;
        },
        
        */
    });
});
