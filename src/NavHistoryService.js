/*
 * Copyright (c) 1997-2013, SalesLogix, NA., LLC. All rights reserved.
 */
define('Mobile/Sample/NavHistoryService', [
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/Deferred',
    'dojo/_base/connect',
    'Sage/Platform/Mobile/Store/SData'
], function(
    declare,
    lang,
    Deferred,
    connect,
    SDataStore
) {
    return declare('Mobile.Sample.NavHistoryService', null, {
        enabled: true,
        _subscribes: null,
        store: null,
        constructor: function(options) {
            lang.mixin(this, options);
            this._subscribes = [];
            this._subscribes.push(connect.subscribe('/app/navhistory', this, this.onNav));
        },

        createStore: function() {
            var store = new SDataStore({
                service: App.services.crm,
                resourceKind: 'navHistories',
                scope: this
            });

            return store;
        },
        getStore: function() {
            return this.store || (this.store = this.createStore());
        },
        onNav: function(navContext) {
            try {
                if (this.enabled && (navContext.data.id !== 'login')) {
                    navEntry = {
                        Description: navContext.Description,
                        ViewId: navContext.data.id,
                        ResourceKind: navContext.data.resourceKind,
                        EntityType: navContext.EntityType,
                        EntityId: navContext.EntityId,
                        Area: navContext.Area,
                        Category: navContext.Category,
                        Subject: navContext.Subject,
                        Application:'SlxMobile'
                    }
                    this.insert(navEntry);
                }
            }
            catch (error) {
                console.log('Error recording nav context:' + error);
            }
        },
        insert: function(navEntry) {
            var store, addOptions;
            if (navEntry) {
                var store = this.getStore();
                addOptions = {
                    overwrite: false
                },
                Deferred.when(store.add(navEntry, addOptions),
                lang.hitch(this, this._onAddComplete, navEntry),
                lang.hitch(this, this._onAddError, addOptions)
            );
            }
        },
        _onAddComplete: function(navEntry, result) {
            console.log('Recoreded nav context:' + navEntry.ViewId);
        },
        _onAddError: function(addOptions, error) {
            console.log('Error recording nav context:' + error);
        }
    });
});
