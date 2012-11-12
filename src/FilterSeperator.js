
/**
 * Defines a basic toolbar button control
 * @alternateClassName FilterSeperator
 * @extends ToolbarButton
 */
define('Mobile/Sample/FilterSeperator', [
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
    return declare('Mobile.Sample.FilterSeperator', [ToolbarButton], {
        tag: 'div',
        baseClass: 'tool-tab filter-seperator'
    });
});