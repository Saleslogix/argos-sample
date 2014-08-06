define('Mobile/Sample/Views/Picklist/Edit', [
	'dojo/_base/declare',
    'dojo/_base/array',
    'dojo/_base/lang',
	'dojo/query',
	'dojo/string',
    'dojo/dom-attr',
    'dojo/dom-class',
    'dojo/dom-construct',
    'Mobile/SalesLogix/Format',
    'dojo/store/Memory',
    'Sage/Platform/Mobile/List',
    'dojo/NodeList-traverse'
], function (
	declare,
	array,
    lang,
	query,
	string,
    domAttr,
    domClass,
    domConstruct,
    format,
    Memory,
	List,
    NodeList
) {
    return declare('Mobile.Sample.Views.Picklist.Edit', [List], {
        // Template
        widgetTemplate: new Simplate([
            '<div id="{%= $.id %}" title="{%= $.titleText %}" class="overthrow list {%= $.cls %}" {% if ($.resourceKind) { %}data-resource-kind="{%= $.resourceKind %}"{% } %}>',
                //'<div data-dojo-attach-point="searchNode"></div>',
                //'<h3 id="dragLabel">Drag Items to Change Order</h>',
                '<div class="overthrow scroller" ondrop="drop(event)" ondragover="allowDrop(event)" data-dojo-attach-point="scrollerNode">',
                    '{%! $.emptySelectionTemplate %}',
                    '<ul class="list-content" data-dojo-attach-point="contentNode"></ul>',
                    '{%! $.moreTemplate %}',
                    '{%! $.listActionTemplate %}',
                '</div>',
            '</div>'
        ]),
        itemTemplate: new Simplate([
			'<h3 draggable="false" ondragover="allowDrop(event)" data-key={%: $.key %}>',
            '<span ondragover="allowDrop(event)">{%: $.value %}</span>',
            '</h3>'
        ]),
        rowTemplate: new Simplate([
            '<li data-action="activateEntry" enableTouch="addTouchListeners" draggable="true" ondragstart="drag(event)" ondragover="allowDrop(event)" ondragleave="leaveDrop(event)" data-key="{%= $[$$.idProperty] %}" %} class="touchable">',
                '<button data-action="" class="list-item-selector button">',
                    '{% if ($$.selectIconClass) { %}',
                        '<span class="{%= $$.selectIconClass %}"></span>',
                    '{% } else if ($$.icon || $$.selectIcon) { %}',
                        '<img src="{%= $$.icon || $$.selectIcon %}" class="icon" />',
                    '{% } %}',
                '</button>',
                '<div class="list-item-content" data-snap-ignore="true">{%! $$.itemTemplate %}</div>',
                '<div id="list-item-content-related"></div>',
            '</li>'
        ]),

        // Localization
        viewPicklistText: '',

        // View Properties
        id: 'picklist_edit',
        itemView: 'picklist_item',
        expose: false,
        enableSearch: false,
        selectionOnly: true,
        allowSelection: true,
        autoClearSelection: false,
        offset: null,
        enableActions: true,
        selectIconClass: 'fa fa-circle-o',
        closestNode: null,
        previousNode: null,
        store: null,
        layout: null,
        refreshRequired: true,

        // Initialize the arguments from the Detail view
        init: function () {
            this.inherited(arguments);
        },
        // Gets rid of the more data requests
        hasMoreData: function () {
            return false;
        },
        // This associates the item values and enters them into the list to be used to display in the simplate
        createStore: function () {
            var list = [],
                items = this.options.entry.items.$resources,
                lookup = {},
                count = items.length,
                i;

            for (i = 0; i < count; i++) {
                list.push({
                    'value': items[i].text,
                    'key': items[i].$key,
                    'order': items[i].number
                });
            }
            //console.dir(this.options);
            return Memory({ data: list });
        },
        // This is the code associated to the save button, it will save the current order and any new list item added and revert the user back to the details screen
        savePreferences: function () {
            var visible, view,
            // Set variables for an array of the orders and the value that is the default item
            itemDefault = "",
            order = [];

            // since the selection model does not have ordering, use the DOM
            query('li', this.domNode).forEach(function (node) {
                // textContent contains the name of the picklist item
                var text = domAttr.get(node, 'textContent'),
                span = query('h3', node);
                if (span.length > 0) {
                    // The key for the item is stored in the header under data-key, use the first element (only element) in the array to get the key value
                    var key = domAttr.get(span[0], 'data-key');
                    if (text) {
                        order.push(text, key);

                        // This if statement will handle selecting which item value is the default for the picklist, as soon as that payload value is found
                        if (domClass.contains(node, 'isDefault')) {
                        }
                    }
                }
            });

            //App.persistPreferences(); 

            ReUI.back();
            view = App.getView('left_drawer');
            if (view) {
                view.refresh();
            }
        },
        refreshRequiredFor: function (options) {
            if (this.options) {
                if (options) {
                    return true;
                }
            } else {
                return this.inherited(arguments);
            }
        },
        refresh: function () {
            this.layout = null;
            this.store = null;
            this.requestData();
            // Add each list item to the array on the view called listItems
            this.index = 0;
            this.listItems = [];
            query('li.touchable', this.domNode).forEach(this.createArray);
            // Adds drag functionality for each li.touchable item
            this.addTouchListeners();
        },
        // Navigates to the view to insert a new picklist item (id = 'picklist_item')
        navigateToItemView: function () {
            var view = App.getView(this.itemView);
            if (view) {
                this.refreshRequired = true;

                view.show({
                    title: "New Item",
                    template: {},
                    entry: this.entry,
                    insert: true
                });
            }
        },
        // Creates the layout at the top of the screen, having the cancel button, add button, and save button attached
        createToolLayout: function () {
            var tbar = [{
                id: 'save',
                cls: 'fa fa-save fa-fw fa-lg',
                fn: this.savePreferences,
                scope: this
            }, {
                id: 'add',
                cls: 'fa fa-plus fa-fw fa-lg',
                side: 'right',
                action: 'navigateToItemView',
                security: App.getViewSecurity(this.itemView, 'insert')
            }];

            if (!App.isOnFirstView()) {
                tbar.push({
                    id: 'cancel',
                    cls: 'fa fa-ban fa-fw fa-lg',
                    side: 'left',
                    fn: ReUI.back,
                    scope: ReUI
                });
            }

            return this.tools || (this.tools = {
                'tbar': tbar
            });
        },
        createArray: function (node, index, array) {
            var view = App.getView('picklist_edit');
            if (!view.listItems) {
                view.listItems = [node];
            } else {
                view.listItems.push(node);
                view.index++;
            }
        },
        reorganizeArray: function() {
            // Need to create a function that will reorganize the array after items have been shifted
        },
        // Below is the code used to add listeners to the 'touchable' class to allow dragging
        addTouchListeners: function () {
            // Query for the values to attach the eventlisteners to
            //query('button.list-item-selector', this.domNode).forEach(function (node) {
            var node = this.domNode.children.item(0).children.item(1);
                // Event for the touch start
                node.addEventListener('touchstart', function (ev) {
                    console.log("Touch Begin");
                    console.dir(ev);
                    ev.preventDefault();

                    if (ev.touches.item(0).target.textContent === ev.targetTouches.item(0).target.textContent) {
                        var target = ev.changedTouches.item(0).target,
                        name = target.localName,
                        view = App.getView('picklist_edit');

                        // Iterate to the parent list item
                        if (name === 'span' || name === 'h3' || name === 'div' || name === 'button') {
                            while (name !== 'li') {
                                target = target.parentNode;
                                name = target.localName;
                            }
                        }

                        if (name === 'li') {
                            // Get the currently scrolledTop value before removing overthrow
                            var value = target.style.top,
                            results = "";
                            view.goTo = target.parentNode.parentNode.scrollTop;
                            overthrow.forget();
                            
                            for (var i = 0; i < value.length; i++) {
                                if (value.charAt(i) != 'p') {
                                    results += (value.charAt(i));
                                } else {
                                    break;
                                }
                            }

                            this.offset = ev.changedTouches.item(0).pageY - Number(results);
                            // Move the view to the previously scrolled to value.
                            ev.view.scrollTo(0, view.goTo);
                            view.lastNodeOffset = target.parentNode.lastChild.offsetTop;
                            target.style.zIndex = '5';
                            target.style.opacity = '0.4';

                            if (target.nextSibling) {
                                view.nextNode = target.nextSibling;
                            }
                        }
                    }
                }, false);

                // Event for the touch end
                node.addEventListener('touchend', function (ev) {
                    var source = ev.srcElement,
                    target = ev.target,
                    name = source.localName,
                    view = App.getView('picklist_edit');

                    console.log("Touch End");
                    console.dir(ev);
                    ev.preventDefault();
                    
                    // Iterate to the parent list item
                    if (name === 'span' || name === 'h3' || name === 'div' || name === 'button') {
                        while (name !== 'li') {
                            source = source.parentNode;
                            name = source.localName;
                        }
                    }

                    if (name === 'li') {
                        source.style.opacity = '1';
                        source.style.zIndex = '1';
                        overthrow.set();

                        if (source !== source.parentNode.lastChild) {
                            source.nextSibling.style.marginTop = '0px';
                        }

                        // On touch end ensure that the object is 'snapped' into position by giving it a top=0 value after moving its position in the list
                        if (view.directionY == 'down') {
                            view.listItems.every(function (node) {
                                // Ignores the case when the item selected is equal to the current node iterated through
                                if (source !== node) {
                                    var offsetY = node.offsetTop - 1;

                                    // Checks whether the item was dragged BELOW the last child of the list
                                    if (source.offsetTop >= view.lastNodeOffset) {
                                        node.parentNode.insertBefore(source);

                                        source.style.top = '0px';
                                        source.style.marginTop = '0px';
                                        return false;
                                    }

                                    // Find where the item was dragged in the list and compares it to the offset of each item in the list
                                    if (source.offsetTop <= offsetY) {
                                        node.parentNode.insertBefore(source, node);
                                        source.style.top = '0px';
                                        source.style.marginTop = '0px';
                                        return false;
                                    } else {
                                        return true;
                                    }
                                } else {
                                    // Checks the case when the last child is dragged downward
                                    if (source === node.parentNode.lastChild) {
                                        if (source.offsetTop >= source.previousSibling.offsetTop) {
                                            source.style.top = '0px';
                                            source.style.marginTop = '0px';
                                            return false;
                                        }
                                    }
                                }
                                return true;
                            });
                        } else if (view.directionY == 'up') {
                            view.listItems.reverse().every(function (node) {
                                // Ignores the case when the item selected is equal to the current node iterated through
                                if (source !== node) {
                                    var offsetY = (node.offsetTop - 1.5 * node.offsetHeight);

                                    // Find where the item was dragged in the list and compares it to the offset of each item in the list
                                    if (source.offsetTop >= offsetY) {
                                        node.parentNode.insertBefore(source, node);
                                        source.style.top = '0px';
                                        source.style.marginTop = '0px';
                                        return false;
                                    } else {
                                        return true;
                                    }
                                } else {
                                    // Checks the case when the first child is dragged upward
                                    if (source === node.parentNode.firstChild) {
                                        source.style.top = '0px';
                                        source.style.marginTop = '0px';
                                        return false;
                                    }
                                }
                                return true;
                            });
                        } else {
                            // For the situation when the direction is set to 'none', assumes case of down for a "best guess" situation
                            view.listItems.every(function (node) {
                                // Ignores the case when the item selected is equal to the current node iterated through
                                if (source !== node) {
                                    var offsetY = node.offsetTop + 0.5 * node.offsetHeight;

                                    // Checks whether the item was dragged BELOW the last child of the list
                                    if (source.offsetTop >= view.lastNodeOffset) {
                                        node.parentNode.insertBefore(source);
                                        source.style.top = '0px';
                                        source.style.marginTop = '0px';
                                        return false;
                                    }

                                    // Find where the item was dragged in the list and compares it to the offset of each item in the list
                                    if (source.offsetTop <= offsetY) {
                                        node.parentNode.insertBefore(source, node);
                                        source.style.top = '0px';
                                        source.style.marginTop = '0px';
                                        return false;
                                    } else {
                                        return true;
                                    }
                                } else {
                                    // Checks the case when the last child is dragged downward
                                    if (source === node.parentNode.lastChild) {
                                        source.style.top = '0px';
                                        source.style.marginTop = '0px';
                                        return false;
                                    }
                                }
                                return true;
                            });
                        }

                        if (source !== source.parentNode.lastChild) {
                            source.nextSibling.style.marginTop = '0px';
                        }

                        view.listItems.forEach(function (node) {
                            node.style.marginTop = '0px';
                        });
                    }
                    source.parentNode.parentNode.scrollTop = source.offsetTop - ev.changedTouches.item(0).clientY + 1.5 * source.offsetHeight + 10;
                }, false);

                // Event for when the touch moves
                node.addEventListener('touchmove', function (ev) {
                    ev.preventDefault();
                    var source = ev.srcElement,
                    target = ev.target,
                    name = source.localName,
                    scroll,
                    view = App.getView('picklist_edit');

                    // Sets a direction of the touch movement
                    if (view.previousPoint) {
                        var deltaY = ev.changedTouches.item(0).pageY - view.previousPoint;
                        if (deltaY > 0) {
                            view.directionY = 'down';
                        } else if (deltaY < 0) {
                            view.directionY = 'up';
                        } else {
                            //view.directionY = 'none';
                        }
                    }

                    // Iterate to the parent list item
                    if (name === 'span' || name === 'h3' || name === 'div' || name === 'button') {
                        while (name !== 'li') {
                            source = source.parentNode;
                            name = source.localName;
                        }
                    }

                    if (name === 'li') {
                        view.endDrop = ev.changedTouches.item(0).pageY - this.offset;

                        // Check if the touch is moved to the bottom 6% of the screen
                        if ((ev.changedTouches.item(0).clientY / ev.view.innerHeight) >= 0.85) {
                            // Scroll down
                            if (ev.changedTouches.item(0).pageY < (source.parentNode.lastChild.offsetTop + source.parentNode.lastChild.offsetHeight + 10)) {
                                scroll = ev.view.scrollBy(0, 25 * (ev.changedTouches.item(0).pageY / ev.view.innerHeight));
                                ev.view.scrolldelay = setTimeout(scroll, 1000 / (ev.changedTouches.item(0).pageY / ev.view.innerHeight) ^ 2);
                            }
                        } else if ((ev.changedTouches.item(0).clientY / ev.view.innerHeight) <= 0.2) {
                            // Scroll up
                            scroll = ev.view.scrollBy(0, -50 * (ev.changedTouches.item(0).pageY / ev.view.innerHeight));
                            ev.view.scrolldelay = setTimeout(scroll, 1000 / (ev.changedTouches.item(0).pageY / ev.view.innerHeight) ^ 2);
                        } else {
                            if (ev.view.scrolldelay) {
                                ev.view.clearTimeout(ev.view.scrolldelay);
                            }
                        }

                        /* Some necessary explanation here... first of all, by forgetting overthrow, the page becomes one giant web page without a scroll bar
                           This ruins some of the layout (which is why the toolbar was set to position: fixed to remain at the top of the screen). Also, by 
                           attempting to make it so that the list items move to be interactive as the user is dragging the item around there is a shift in the
                           table itself. This means that the source.style.top value needs to account for this shift (resultant from the addition of the -marginTop
                           for the source.nextSibling entity).
                        */
                        if (view.directionY === 'down') {
                            view.listItems.every(function (node) {
                                // Ignores the case when the item selected is equal to the current node iterated through
                                if (source !== node) {
                                    var offsetY = node.offsetTop + 0.5*node.offsetHeight;

                                    // Find where the item was dragged in the list and compares it to the offset of each item in the list
                                    if ((source.offsetTop + 0.5*source.offsetHeight) <= offsetY) {
                                        if (view.nextNode !== node) {
                                            view.currentNode = node;
                                            node.style.marginTop = source.offsetHeight + 'px';
                                            return false;
                                        } else {
                                            // Just want to get rid of the margin of the previous existing entity
                                            view.currentNode = node;
                                            node.style.marginTop = '0px';
                                            return false;
                                        }
                                    } else {
                                        if (view.nextNode !== node) {
                                            node.style.marginTop = '0px';
                                        } else {
                                            node.style.marginTop = '-' + source.offsetHeight + 'px';
                                        }
                                        return true;
                                    }
                                } else {
                                    // Checks the case when the last child is dragged downward
                                    if (source === node.parentNode.lastChild) {
                                        //source.previousSibling.style.marginBottom = ;
                                        return false;
                                    }
                                }
                                return true;
                            });
                        } else if (view.directionY === 'up') {
                            view.listItems.reverse().every(function (node) {
                                // Ignores the case when the item selected is equal to the current node iterated through
                                if (source !== node) {
                                    var offsetY = node.offsetTop - node.offsetHeight;

                                    if (node === source.parentNode.firstChild) {
                                        // Check the case when the source was dragged ABOVE the top node
                                        if (source.offsetTop <= (source.parentNode.firstChild.offsetTop + 0.5 * source.parentNode.firstChild.offsetHeight)) {
                                            view.currentNode = source.parentNode.firstChild;
                                            view.currentNode.style.marginTop = source.offsetHeight + 'px';
                                            return false;
                                        }
                                    }

                                    // Find where the item was dragged in the list and compares it to the offset of each item in the list
                                    if ((source.offsetTop + 0.5 * source.offsetHeight) >= offsetY) {
                                        if (view.nextNode !== node) {
                                            view.currentNode = node;
                                            node.style.marginTop = source.offsetHeight + 'px';
                                            return false;
                                        } else {
                                            // Just want to get rid of the margin of the previous existing entity
                                            view.currentNode = node;
                                            node.style.marginTop = '0px';
                                            return false;
                                        }
                                    } else {
                                        if (view.nextNode !== node) {
                                            node.style.marginTop = '0px';
                                        } else {
                                            if (source !== source.parentNode.firstChild) {
                                                if (source.offsetTop <= source.previousSibling.offsetTop) {
                                                    node.style.marginTop = '-' + source.offsetHeight + 'px';
                                                }
                                            } else {

                                            }
                                        }
                                        return true;
                                    }
                                } else {
                                    // Checks the case when the first child is dragged upward
                                    if (source === node.parentNode.firstChild) {
                                        view.currentNode = source.nextSibling;
                                        source.nextSibling.style.marginTop = '0px';
                                        return false;
                                    } else {
                                        // This is the case when the source was just barely moved upward
                                        if (source.offsetTop > source.previousSibling.offsetTop) {
                                            view.currentNode = source.nextSibling;
                                            return false;
                                        }
                                    }
                                }
                                return true;
                            });
                        } else {
                            // For the situation when the direction is set to 'none', assumes case of down for a "best guess" situation
                            view.listItems.every(function (node) {
                                // Ignores the case when the item selected is equal to the current node iterated through
                                if (source !== node) {
                                    var offsetY = node.offsetTop + 0.5*node.offsetHeight;
                                    // Find where the item was dragged in the list and compares it to the offset of each item in the list
                                    if ((source.offsetTop + 0.5*source.offsetHeight) <= offsetY) {
                                        if (view.nextNode !== node) {
                                            view.currentNode = node;
                                            node.style.marginTop = source.offsetHeight + 'px';
                                            return false;
                                        } else {
                                            // Gets rid of the margin of the previous existing entity
                                            view.currentNode = node;
                                            node.style.marginTop = '0px';
                                            return false;
                                        }
                                    } else {
                                        if (view.nextNode !== node) {
                                            node.style.marginTop = '0px';
                                        } else {
                                            node.style.marginTop = '-' + source.offsetHeight + 'px';
                                        }
                                        return true;
                                    }
                                }
                                return true;
                            });
                        }

                        /* For the times when the touch source is being dragged BELOW its previous location, it does NOT need to account for any shift in the
                           margins. When the touch source is being dragged ABOVE its previous location, there is a margin shift that needs to be accounted for.
                        */
                        if (source !== source.parentNode.firstChild) {
                            if (source.offsetTop > (source.previousSibling.offsetTop)) {
                                source.style.top = ev.changedTouches.item(0).pageY - this.offset - view.goTo + 'px';
                            } else {
                                source.style.top = ev.changedTouches.item(0).pageY - this.offset - view.goTo - source.offsetHeight + 'px';
                            }
                        } else {
                            source.style.top = ev.changedTouches.item(0).pageY - this.offset - view.goTo + 'px';
                        }
                        view.previousPoint = ev.changedTouches.item(0).pageY;
                    }
            //    }, false);
            });
        }
    });
});