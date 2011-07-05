/* Copyright (c) 2010, Sage Software, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/// <reference path="../../../../../argos-sdk/libraries/ext/ext-core-debug.js"/>
/// <reference path="../../../../../argos-sdk/libraries/sdata/sdata-client-debug"/>
/// <reference path="../../../../../argos-sdk/libraries/Simplate.js"/>
/// <reference path="../../../../../argos-sdk/src/View.js"/>
/// <reference path="../../../../../argos-sdk/src/List.js"/>

Ext.namespace("Mobile.Sample.TicketActivity");

(function() {
    Mobile.Sample.TicketActivity.List = Ext.extend(Sage.Platform.Mobile.List, {
        //Templates
        contentTemplate: new Simplate([
            '<H3>',
                '{%: $$.formatDate($.AssignedDate) %}',
            '</H3>',
            '<div class="note-text-item">',
                '<div class="note-text-wrap">',
                    '{%: $.ActivityDescription %}',
                '</div>',
                '<div class="note-text-more"></div>',
            '</div>'
        ]),
 
        //Localization
        titleText: 'Ticket Activities',
        
        //View Properties
        id: 'ticketactivity_list',
        queryOrderBy: 'CreateDate desc',
        querySelect: [
            'ActivityDescription',
            'ShortDescription',
            'ActivityTypeCode',
            'AssignedDate',
            'CompletedDate',
            'CreateDate',
            'DateDue',
            'PublicAccessCode',
            'Rate',
            'TotalFee',
            'TotalLabor',
            'TotalParts',
            'Units'
        ],
        resourceKind: 'TicketActivities',
        formatDate: function(date) {
            var toDateFromString = Sage.Platform.Mobile.Convert.toDateFromString,
                formatDate = Mobile.SalesLogix.Format.date;

            if (toDateFromString(date).between(Date.today(), Date.today().add({hours:24})))
                return formatDate(date, "h:mm");

            return formatDate(date, "M/d/yy h:mm");
        },
        init: function() {
            Mobile.Sample.TicketActivity.List.superclass.init.apply(this, arguments);
            App.on('resize', this.onResize, this);
            // Empty the toolbar. This is a read-only view.
            this.tools.tbar = [];
        },
        formatSearchQuery: function(query) {
            return String.format('upper(ActivityDescription) like "%{0}%"', query.toUpperCase());
        },
        onResize: function() {
            this.el.select('.note-text-item').each(function(el) {
                if (el.getHeight(true) < el.child('.note-text-wrap').getHeight())
                    el.child('.note-text-more').show();
                else
                    el.child('.note-text-more').hide();
            });
        },
        processFeed: function(feed) {
            Mobile.Sample.TicketActivity.List.superclass.processFeed.call(this, feed);
            this.onResize();
        }
    });
})();
