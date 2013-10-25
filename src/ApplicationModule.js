/*
 * Copyright (c) 1997-2013, SalesLogix, NA., LLC. All rights reserved.
 */
define('Mobile/Sample/ApplicationModule', [
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/string',
    'dojo/query',
    'dojo/dom-class',
    'dojo/_base/array',
    'Mobile/SalesLogix/Format',
    'Sage/Platform/Mobile/ApplicationModule',
    'Sage/Platform/Mobile/RelatedViewWidget'
   // 'dojo/_base/connect',
   //'Mobile/Sample/NavHistoryService',
   //'Mobile/Sample/Views/NavHistory/NavDashboard'


], function(
    declare,
    lang,
    string,
    query,
    domClass,
    array,
    format,
    ApplicationModule
   // RelatedViewWidget,
   // connect,
   // NavHistoryService,
   // NavHistoryDashboard
) {

    return declare('Mobile.Sample.ApplicationModule', ApplicationModule, {
          
        _navHistoryService:null, //nav history service customization
          
        loadViews: function() {
            this.inherited(arguments);

           //Register views 
            //this.registerView(new NavHistoryDashboard());
  
        },
        loadCustomizations: function() {
            this.inherited(arguments);
           // this.registerActivityCustomizations();
           // this.registerContactCustomizations();
           // this.registerNavHistoryServiceCustomizations();
           // this.registerNavHistoryMetricCustomizations();
        },
        

        //////////////////////////////////////////////////////
        //Hash tag and Order by Customizations
        //////////////////////////////////////////////////////

        registerActivityCustomizations: function(){
            lang.extend(Mobile.SalesLogix.Views.Activity.List, {
                _orginalOrderBy: null,
                _osetSearchTerm: Mobile.SalesLogix.Views.Activity.List.prototype.setSearchTerm,
                setSearchTerm: function(value) {
                    this._setSortOrder(value);
                    this._osetSearchTerm(value);
                },
                _setSortOrder: function(value) {

                    if (!this._orginalOrderBy) {
                        this._orginalOrderBy =  this.queryOrderBy;
                    }

                    if (value === '#today') {

                        if (this.resourceKind === 'userActivities') {
                            this.queryOrderBy = 'Activity.StartDate asc';
                        } else {
                            this.queryOrderBy = 'StartDate asc';
                        }
                    }
                    else {
                        this.queryOrderBy = this._orginalOrderBy;
                    }
                }

            });

        },

        //////////////////////////////////////////////////////
        //Hash tag and Order by Customizations End
        //////////////////////////////////////////////////////

        //////////////////////////////////////////////////////
        // Related View Customizations
        //////////////////////////////////////////////////////

        registerContactCustomizations: function() {
            lang.extend(Mobile.SalesLogix.Views.Account.List, {
                querySelect: Mobile.SalesLogix.Views.Account.List.prototype.querySelect.concat(
                    'Contacts/NameLF',
                    'Contacts/Email',
                    'Contacts/WorkPhone'
            ),

            });
            this.registerCustomization('list/relatedViews', 'account_list', {
                at: true,
                type: 'insert',
                where: 'before',
                value: {
                    widgetType: RelatedViewWidget,
                    id: 'account_relatedContacts',
                    icon: 'content/images/icons/journal_24.png',
                    title: 'Contacts',
                    detailViewId: 'contact_detail',
                    listViewId: 'contact_related',
                    parentCollection: true,
                    parentCollectionProperty: "Contacts",
                    autoLoad: true,
                    enabled: true,
                    enableActions: false,
                    relatedItemDetailTemplate: new Simplate([
                         '<div>',
                            '<h3>{%: $.NameLF %}</h3>',
                            '<h4>{%: Sage.Platform.Mobile.Format.phone($.WorkPhone) %}</h4>',
                            '<h4></h4>',
                         '</div>'
                    ]),
                    realtedData: function(entry) { return [entry] }
                }
            });
        },

        //////////////////////////////////////////////////////
        // Related View Customizations End
        //////////////////////////////////////////////////////


        //////////////////////////////////////////////////////
        // Nav History Service Customizations
        //////////////////////////////////////////////////////
        registerNavHistoryServiceCustomizations: function(){

            this._navHistoryService = new NavHistoryService();

            lang.extend(Mobile.SalesLogix.Views.Account.List, {
                _oshow: Mobile.SalesLogix.Views.Account.List.prototype.show,
                show: function(options, transitionOptions) {
                    var data, navContext;
                    this._oshow(options, transitionOptions);
                    data = this.getContext();
                    navContext = {
                        Area:"View",
                        Category: "List",
                        Subject: "Account",
                        EntityType: "Account",
                        EntityId: "",
                        Description: "Account List",
                        ViewName: "Account List",
                        data: data
                    };
                    connect.publish('/app/navhistory', [navContext]);
                }
            });
            lang.extend(Mobile.SalesLogix.Views.Account.Detail, {
                _oshow: Mobile.SalesLogix.Views.Account.Detail.prototype.show,
                show: function(options, transitionOptions) {
                    var data, navContext;
                    this._oshow(options, transitionOptions);

                    data = this.getContext();
                    navContext = {
                        Area: "View",
                        Category: "Detail",
                        Subject: "Account",
                        EntityType: "Account",
                        EntityId: data.key,
                        Description: data.descriptor,
                        ViewName: "Account Detail",
                        data: data
                    };
                    connect.publish('/app/navhistory', [navContext]);
                }
            });
            /*
            lang.extend(Mobile.SalesLogix.Views.Contact.List, {
                _oshow: Mobile.SalesLogix.Views.Contact.List.prototype.show,
                show: function(options, transitionOptions) {
                    var data, navContext;
                    this._oshow(options, transitionOptions);
                    data = this.getContext();
                    var navContext = {
                        Area: "View",
                        Category: "List",
                        Subject: "Contact",
                        EntityType: "Contact",
                        EntityId: "",
                        Description: "Contact List",
                        ViewName: "Contact List",
                        data: data
                    };
                    connect.publish('/app/navhistory', [navContext]);
                }
            });

            lang.extend(Mobile.SalesLogix.Views.Contact.Detail, {
                _oshow: Mobile.SalesLogix.Views.Contact.Detail.prototype.show,
                show: function(options, transitionOptions) {
                    var data, navContext;
                    this._oshow(options, transitionOptions);

                    data = this.getContext();
                    navContext = {
                        Area: "View",
                        Category: "Detail",
                        Subject: "Contact",
                        EntityType: "Contact",
                        EntityId: data.key,
                        Description: data.descriptor,
                        ViewName: "Contact Detail",
                        data: data
                    };
                    connect.publish('/app/navhistory', [navContext]);
                }
            });
            */
            /*
            lang.extend(Mobile.SalesLogix.Views.Lead.List, {
                _oshow: Mobile.SalesLogix.Views.Lead.List.prototype.show,
                show: function(options, transitionOptions) {
                    this._oshow(options, transitionOptions);
                    var navContext = {
                        Area: "View",
                        Category: "List",
                        Subject: "Lead",
                        EntityType: "Lead",
                        EntityId: "",
                        Description: "Lead List",
                        ViewName: "Lead List",
                        data: data
                    };
                    connect.publish('/app/navhistory', [navContext]);
                }
            });
            lang.extend(Mobile.SalesLogix.Views.Lead.Detail, {
                _oshow: Mobile.SalesLogix.Views.Lead.Detail.prototype.show,
                show: function(options, transitionOptions) {
                    var data, navContext;
                    this._oshow(options, transitionOptions);

                    data = this.getContext();
                    navContext = {
                        Area: "View",
                        Category: "Detail",
                        Subject: "Lead",
                        EntityType: "Lead",
                        EntityId: data.key,
                        Description: data.descriptor,
                        ViewName: "Lead Detail",
                        data: data
                    };
                    connect.publish('/app/navhistory', [navContext]);
                }
            });
            */
            /*
            lang.extend(Mobile.SalesLogix.Views.Opportunity.List, {
                _oshow: Mobile.SalesLogix.Views.Opportunity.List.prototype.show,
                show: function(options, transitionOptions) {
                    var data, navContext;
                    this._oshow(options, transitionOptions);

                    data = this.getContext();
                    navContext = {
                        Area: "View",
                        Category: "List",
                        Subject: "Opportunity",
                        EntityType: "Opprtunity",
                        EntityId: data.key,
                        Description: "Opportunity List",
                        ViewName: "Opportunity List",
                        data: data
                    };
                    connect.publish('/app/navhistory', [navContext]);
                }
            });
           
            lang.extend(Mobile.SalesLogix.Views.Opportunity.Detail, {
                _oshow: Mobile.SalesLogix.Views.Opportunity.Detail.prototype.show,
                show: function(options, transitionOptions) {
                    var data, navContext;
                    this._oshow(options, transitionOptions);

                    data = this.getContext();
                    navContext = {
                        Area: "View",
                        Category: "Detail",
                        Subject: "Opportunity",
                        EntityType: "Opprtunity",
                        EntityId: data.key,
                        Description: data.descriptor,
                        ViewName: "Opportunity Detail",
                        data: data
                    };
                    connect.publish('/app/navhistory', [navContext]);
                }
            });
            */
            /*
            lang.extend(Mobile.SalesLogix.Views.Ticket.List, {
                _oshow: Mobile.SalesLogix.Views.Ticket.List.prototype.show,
                show: function(options, transitionOptions) {
                    var data, navContext;
                    this._oshow(options, transitionOptions);

                    data = this.getContext();
                    navContext = {
                        Area: "View",
                        Category: "List",
                        Subject: "Ticket",
                        EntityType: "Ticket",
                        EntityId: data.key,
                        Description: "Ticket List",
                        ViewName: "Ticket List",
                        data: data
                    };
                    connect.publish('/app/navhistory', [navContext]);
                }
            });
          
            lang.extend(Mobile.SalesLogix.Views.Ticket.Detail, {
                _oshow: Mobile.SalesLogix.Views.Ticket.Detail.prototype.show,
                show: function(options, transitionOptions) {
                    var data, navContext;
                    this._oshow(options, transitionOptions);

                    data = this.getContext();
                    navContext = {
                        Area: "View",
                        Category: "Detail",
                        Subject: "Ticket",
                        EntityType: "Ticket",
                        EntityId: data.key,
                        Description: data.descriptor,
                        ViewName: "Tickit Detail",
                        data: data
                    };
                    connect.publish('/app/navhistory', [navContext]);
                }
            });
            */
            /*
            lang.extend(Mobile.SalesLogix.Views.History.List, {
                _oshow: Mobile.SalesLogix.Views.History.List.prototype.show,
                show: function(options, transitionOptions) {
                    var data, navContext;
                    this._oshow(options, transitionOptions);

                    data = this.getContext();
                    navContext = {
                        Area: "View",
                        Category: "List",
                        Subject: "History",
                        EntityType: "History",
                        EntityId: data.key,
                        Description: "History List",
                        ViewName: "History List",
                        data: data
                    };
                    connect.publish('/app/navhistory', [navContext]);
                }
            });

            lang.extend(Mobile.SalesLogix.Views.History.Detail, {
                _oshow: Mobile.SalesLogix.Views.History.Detail.prototype.show,
                show: function(options, transitionOptions) {
                    var data, navContext;
                    this._oshow(options, transitionOptions);

                    data = this.getContext();
                    navContext = {
                        Area: "View",
                        Category: "Detail",
                        Subject: "History",
                        EntityType: "History",
                        EntityId: data.key,
                        Description: data.descriptor,
                        ViewName: "History Detail",
                        data: data
                    };
                    connect.publish('/app/navhistory', [navContext]);
                }
            });
            */
        },
        
        //////////////////////////////////////////////////////
        // Nav History Service Customizations End
        //////////////////////////////////////////////////////

        //////////////////////////////////////////////////////
        // Nav History Metric Customizations
        //////////////////////////////////////////////////////
        
        registerNavHistoryMetricCustomizations: function() {

            lang.extend(Mobile.SalesLogix.Application, {

                _ogetDefaultViews: Mobile.SalesLogix.Application.prototype.getDefaultViews,
                getDefaultViews: function(){
                    var defaultViews = this._ogetDefaultViews();
                    defaultViews.push('navhistory_dashboard');
                    return defaultViews;
                },

                _osetDefaultMetricPreferences: Mobile.SalesLogix.Application.prototype.setDefaultMetricPreferences,
                setDefaultMetricPreferences: function() {
                    var visitedMetric;
                    this._osetDefaultMetricPreferences();
                    visitedMetric = {
                            metricId: "NavHistoryVisited",
                            title: "Visited",
                            resourceKind: "navHistories",
                            entityName: "NavHostory",
                            currentSearchExpression:'',
                            queryName:"executeMetric",
                            queryArgs:{
                                _filterName:"Description",
                                _metricName:"NavCount"
                            },
                            metricDisplayName:"Visted",
                            filterDisplayName:"Visted",
                            chartType:"bar",
                            aggregate:"sum",
                            formatter:"bigNumber",
                            enabled:false
                     }

                    this._addMetric("accounts", visitedMetric);
                    this._addMetric("contacts", visitedMetric);
                    this._addMetric("leads", visitedMetric);
                    this._addMetric("opportunities", visitedMetric);
                    this._addMetric("history", visitedMetric);
                    this._addMetric("tickets", visitedMetric);


                },
                _addMetric:function(kind, metric){
                    if (this.preferences.metrics[kind]) {
                        var found = false;
                        array.forEach(this.preferences.metrics[kind], function(currentMetric) {
                            if (currentMetric && currentMetric.metricId === metric.metricId) {
                                found = true;
                            }
                        }, this);
                        if (!found) {
                            this.preferences.metrics[kind].push(metric);
                            this.persistPreferences();
                        }
                    } else {
                        this.preferences.metrics[kind] = [metric];
                    }
                }

            });

             lang.extend(Mobile.SalesLogix.Views.MetricWidget, {
                postCreate: function(options) {
                    if (this.metricId === 'NavHistoryVisited') {
                        //this.queryArgs._activeFilter = "CreateUser eq '" + App.context.user.$key + "' and  ViewId eq   '" + this.returnToId + "'";
                        this.queryArgs._activeFilter = "CreateUser eq '" + App.context.user.$key + "' and  Category eq 'Detail' and ResourceKind eq   '" + this.parentResourceKind + "'";
                    }
                }
            });

            
            
        }
        
        //////////////////////////////////////////////////////
        // Nav History Metric Customizations End
        //////////////////////////////////////////////////////






    });
});
