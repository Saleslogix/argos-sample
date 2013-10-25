/*
 * Copyright (c) 1997-2013, SalesLogix, NA., LLC. All rights reserved.
 */
define('Mobile/Sample/Views/NavHistory/NavDashboard', [
    'dojo/_base/declare',
    'dojo/string',
    'dojo/_base/connect',
    'dojo/_base/array',
    'dojo/dom-construct',
    'dojo/dom-attr',
    'dojo/dom-class',
    'dojo/has',
    'dojo/dom',
    'dojo/when',
    'dojo/_base/lang',
    'Mobile/SalesLogix/Format',
    'Sage/Platform/Mobile/Store/SData',
    'Mobile/SalesLogix/Views/Charts/GenericBar'
], function(
    declare,
    string,
    connect,
    array,
    domConstruct,
    domAttr,
    domClass,
    has,
    dom,
    when,
    lang,
    format,
    SDataStore,
    BarChart
) {

    return declare('Mobile.Sample.Views.NavHistory.NavDashboard', [BarChart], {
        //Localization
        titleText:'Nav History Dashbaord',
        //View Properties
        id: 'navhistory_dashboard',
        resourceKind: 'navHistories',
        queryName: "executeMetric",
        queryArgs: {
            _filterName: "EntityType",
            _metricName: "NavCount"
        },
        metricDisplayName: "Visted",
        filterDisplayName: "Visted",
        aggregate: "sum",
        formatter: format.bigNumber,
        _data: null,
        show: function(options) {
            this.inherited(arguments);
            this.loadDashboard();
        },
        loadDashboard: function() {
            this._getData();
        },
        _onQuerySuccess:function(queryResult){
            this.createChart(queryResult);
        },
        _getData: function() {
            var store, queryOptions, queryResults;
            this.queryArgs._activeFilter = "CreateUser eq '" + App.context.user.$key + "' and Category eq 'Detail'";
            store = this.get('store');
            this._data = [];
            queryResults = store.query(null, queryOptions);

            when(queryResults, lang.hitch(this, this._onQuerySuccess, queryResults), lang.hitch(this, this._onQueryError));
        },
        _onQuerySuccess: function(queryResults, items) {
            queryResults.forEach(lang.hitch(this, this._processItem));
            this.createChart(this._data);
        },
        _processItem: function(item) {
            this._data.push(item);
        },
        _onQueryError: function(queryOptions, error) {
        },
        createStore: function() {
            var store = new SDataStore({
                service: App.services.crm,
                resourceKind: this.resourceKind,
                queryName: this.queryName,
                queryArgs: this.queryArgs,
                scope: this
            });

            return store;
        },
        _getStoreAttr: function() {
            return this.store || (this.store = this.createStore());
        },
        getSearchExpression: function() {
            return "";
        },
    });
});

