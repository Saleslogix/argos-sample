
/**
 * Defines a basic toolbar button control
 * @alternateClassName FilterTab
 * @extends ToolbarButton
 */
define('Mobile/Sample/FilterTab', [
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/dom-class',
    'dojo/dom-attr',
    'argos/ToolbarButton'
], function(
    declare,
    lang,
    domClass,
    domAttr,
    ToolbarButton
) {
    return declare('Mobile.Sample.FilterTab', [ToolbarButton], {
        tag: 'button',
        attrs: {
            'data-action': 'toggle'
        },
        baseClass: 'button tool-tab',
        filter: null,
        active: false,
        group: null,

        _setGroupAttr: function(value) {
            this.group = value;
            domAttr.set(this.domNode, 'data-group', value);
        },
        _getGroupAttr: function() {
            return this.group;
        },
        _setActiveAttr: function(value) {
            this.active = value;
            domClass.toggle(this.domNode, 'is-active', value);
        },
        _getActiveAttr: function() {
            return this.active;
        },
        _setFilterAttr: function(value) {
            this.filter = value;

            domAttr.set(this.domNode, 'data-filter', value);
        },
        _getFilterAttr: function() {
            return this.filter;
        }
    });
});