define('Mobile/Sample/Views/Reports', [
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/string',
    'dojo/dom-geometry',
    'Mobile/SalesLogix/Format',
    'Mobile/SalesLogix/Template',
    'Sage/Platform/Mobile/Detail'
], function(
    declare,
    lang,
    string,
    domGeom,
    format,
    template,
    Detail
) {

    return declare('Mobile.Sample.Views.Reports', [Detail], {
        //Localization
        titleText: 'Reports',
        activityTypeText: {
            'atToDo': 'To Do',
            'atPhoneCall': 'Phone Call',
            'atAppointment': 'Meeting',
            'atPersonal': 'Personal'
        },
        potentialText: 'Potential',
        activitiesCompletedText: 'Number of activities completed',
        leadsCreatedText: 'Leads Created',

        //View Properties
        id: 'report_detail',
        icon: 'content/images/icons/Schedule_ToDo_24x24.png',
        security: null,
        expose: true,

        requestData: function() {
            this.onRequestDataSuccess(true)
        },

        formatActivityLabel: function(label) {
            return this.activityTypeText[label];
        },
        onStateRevenueClick: function(evt) {
            var data = evt.run.data[evt.index];
            var view = App.getView('account_list');
            if (view)
                view.show({
                   where: string.substitute('Address.State eq "${0}"', [data.text])
                });
        },

        createLayout: function() {
            return this.layout || (this.layout = [{
                title: this.titleText,
                list: true,
                name: 'Reports',
                children: [{
                    name: 'ActivityCompleted',
                    icon: 'content/images/icons/To_Do_24x24.png',
                    label: 'Activities Completed',
                    view: 'chart_detail',
                    options: {
                        title: 'Reports',
                        negateHistory: true,
                        chart: {
                            type: 'pie',
                            chartOptions: {
                                title: 'Activities Completed'
                            },
                            resourceKind: 'history',
                            resourceProperty: '$queries',
                            resourceCommand: 'executeMetric',
                            where: {
                                _filterName: 'Type',
                                _metricName: 'CountHistory',
                                _groupName: 'My Completed Activities'
                            },
                            seriesLabelFormatter: this.formatActivityLabel.bindDelegate(this)
                        }
                    }
                },{
                    name: 'OpenOppSales',
                    icon: 'content/images/icons/opportunity_24.png',
                    label: 'Open Opp. By Sales Potential',
                    view: 'chart_detail',
                    options: {
                        title: 'Reports',
                        negateHistory: true,
                        chart: {
                            type: 'column',
                            resourceKind: 'opportunities',
                            resourceProperty: '$queries',
                            resourceCommand: 'executeMetric',
                            where: {
                                _filterName: 'Potential',
                                _metricName: 'SumSalesPotential',
                                _groupName: 'All Opportunities'
                            },
                            xAxis: {
                                title: this.potentialText,
                                titleOrientation: 'away',
                                minorTicks: false,
                                trailingSymbol: '...'
                            },
                            customLabels: true
                        }
                    }
                },{
                    name: 'LeadCreate',
                    icon: 'content/images/icons/Leads_24x24.png',
                    label: 'Recent Lead Creation',
                    view: 'chart_detail',
                    options: {
                        title: 'Reports',
                        negateHistory: true,
                        chart: {
                            type: 'line',
                            resourceKind: 'leads',
                            resourceProperty: '$queries',
                            resourceCommand: 'executeMetric',
                            where: {
                                _filterName: 'MonthlyCreate',
                                _metricName: 'CountLeads'
                            },
                            legend: false,
                            plotOptions: {
                                markers: true,
                                tension: false
                            },
                            xAxis: {
                                minorTicks: false,
                                trailingSymbol: '...'
                            },
                            yAxis: {
                                vertical: true,
                                min: -1,
                                title: this.leadsCreatedText
                            },
                            customLabels: true
                        }
                    }
                },{
                    name: 'activityTrend',
                    icon: 'content/images/icons/To_Do_24x24.png',
                    label: 'Activities Trend',
                    view: 'chart_detail',
                    options: {
                        title: 'Reports',
                        negateHistory: true,
                        chart: {
                            type: 'bar',
                            legend: false,
                            plotOptions: {
                                minorTicks: false
                            },
                            xAxis: {
                                titleOrientation: 'away',
                                title: this.activitiesCompletedText,
                                minorTicks: false
                            },
                            yAxis: {
                                vertical: true,
                                minorTicks: false
                            },
                            resourceKind: 'history',
                            resourceProperty: '$queries',
                            resourceCommand: 'executeMetric',
                            where: {
                                _filterName: 'CompleteToDate',
                                _metricName: 'CountHistory',
                                _groupName: 'Completed Activities'
                            },
                            valueAxis: 'y',
                            labelAxis: 'y',
                            customLabels: true
                        }
                    }
                },{
                    name: 'RevenueByState',
                    icon: 'content/images/icons/Map_24.png',
                    label: 'Revenue By State',
                    view: 'chart_detail',
                    options: {
                        title: 'Reports',
                        negateHistory: true,
                        chart: {
                            type: 'pie',
                            resourceKind: 'accounts',
                            resourceProperty: '$queries',
                            resourceCommand: 'executeMetric',
                            where: {
                                _filterName: 'State',
                                _metricName: 'TotalRevenue'
                            },
                            click: this.onStateRevenueClick
                        }
                    }
                }]
            }]);
        }
    });
});