/**
 * Passbolt ~ Open source password manager for teams
 * Copyright (c) Passbolt SARL (https://www.passbolt.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Passbolt SARL (https://www.passbolt.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.passbolt.com Passbolt(tm)
 */
import Component from 'passbolt-mad/component/component';
import List from 'can-list';
import MadMap from 'passbolt-mad/util/map/map'
import MadDefineMap from 'passbolt-mad/model/map/map';
import TreeView from 'passbolt-mad/view/component/tree';

import itemTemplate from 'passbolt-mad/view/template/component/tree/treeItem.stache!';

/**
 * @parent Mad.components_api
 * @inherits mad.Component
 * @group mad.component.Tree.view_events 0 View Events
 *
 * The Tree Component as for aim to display a data tree.
 * @todo TBD
 */
var Tree = Component.extend('mad.component.Tree', {

    defaults: {
        // Override the label option.
        label: 'Tree Component',
        // Override the cssClasses option.
        cssClasses: ['tree'],
        // Override the tag option.
        tag: 'ul',
        // Override the viewClass option.
        viewClass: TreeView,

        // The template used to render the tree's items.
        itemTemplate: itemTemplate,
        // The Model Class that defines the items displayed by the tree.
        itemClass: MadDefineMap,
        // The list of objects displayed by the tree.
        items: null,
        // The map used to transform the raw data into expected view format.
        map: null,
        // Prefix the id of each row.
        prefixItemId: '',
        // The callbacks the component offers to the dev to bind their code.
        callbacks: {
            // An item is left click selected.
            item_selected: null,
            // An item is right click selected.
            item_right_selected: null,
            // An item is hovered.
            item_hovered: null
        }
    }

}, /** @prototype */ {

    /**
     * Constructor.
     *
     * @param {HTMLElement|can.NodeList|CSSSelectorString} el The element the control will be created on
     * @param {Object} options Option values merged with the class defaults and set as this.options.
     * @return {mad.component.Tree}
     *
     * @body
     * ## Options
     *
     * See the parent class to see the inherited options.
     *
     * ### itemTemplate {string}
     * The template used to render the tree's items. By default mad/view/template/component/tree/treeItem.stache.
     *
     * ### itemClass {mad.Model.constructor}
     * The Model Class that defines the items displayed by the tree.
     *
     * ### items {can.Model.List}
     * The list of objects displayed by the tree.
     *
     * ### map {mad.Map}
     * The map used to transform the raw data into expected view format.
     *
     * If no map given, the component will use the following default map :
     * ```
     * {
	 *   id : id,
	 *   label: label | title | name | id
	 * }
     * ```
     *
     * By default it will map the label on one of the following fields : label, title, name, id.
     * Following the order as priority.
     *
     * ### callbacks
     * The callbacks the component offers to the dev to bind their code.
     *
     * **item_selected**
     * An item is left click selected callback
     * ```
     * /**
     *  * My item left click selected callback
     *  * @param {HTMLElement} el The element the event occurred on
     *  * @param {HTMLEvent} ev The event that occurred
     *  * @param {mixed} item The target item
     *  * @param {HTMLEvent} srcEv The source event that occurred
     *  *|
     * function callback ( el, ev, item, srcEv ) { ... }
     * ```
     *
     * **item_right_selected**
     * An item is right click selected callback
     * ```
     * /**
     *  * My item right click selected callback
     *  * @param {HTMLElement} el The element the event occurred on
     *  * @param {HTMLEvent} ev The event that occurred
     *  * @param {mixed} item The target item
     *  * @param {HTMLEvent} srcEv The source event that occurred
     *  *|
     * function callback ( el, ev, item, srcEv ) { ... }
     * ```
     *
     * **item_hovered**
     * An item is hovered callback
     * ```
     * /**
     *  * My item hovered callback
     *  * @param {HTMLElement} el The element the event occurred on
     *  * @param {HTMLEvent} ev The event that occurred
     *  * @param {mixed} item The target item
     *  * @param {HTMLEvent} srcEv The source event that occurred
     *  *|
     * function callback ( el, ev, item, srcEv ) { ... }
     * ```
     */
    init: function (el, options) {
        // Initialize the list of items with the Model Class that defines the items the tree
        // will have to work with.
        options.items = new options.itemClass.List();

        // If no map given in the options, define the default one.
        if (options.map == null) {
            options.map = this._getDefaultMap();
        }

        this._super(el, options);
    },

    /**
     * Return the default map.
     *
     * @return {mad.Map}
     */
    _getDefaultMap: function () {
        return new MadMap({
            id: 'id',
            label: {
                key: 'id',
                func: function (value, map, rowObject) {
                    var fields = ['label', 'title', 'name', 'id'];
                    // Check if one of the possible label field is present.
                    for (var i in fields) {
                        if (typeof rowObject[fields[i]] != 'undefined') {
                            return rowObject[fields[i]];
                        }
                    }
                    return null;
                }
            },
            cssClasses: {
                key: 'cssClasses',
                func: function(value, map, rowObject) {
                    return value.join(' ');
                }
            },
            children: {
                key: 'children',
                func: MadMap.mapObjects
            }
        });
    },

    /**
     * Insert an item in the tree
     *
     * @param {mad.Model} item The item to insert.
     * @param {mad.Model} refItem (optional) The reference item to use to position the new item.
     * By default the item will be inserted as last element of the tree.
     * @param {string} position (optional) If the reference item has been defined. The position
     * of the item to insert, regarding the reference item.
     *
     * Available values : before, after, first, last.
     *
     * By default last.
     */
    insertItem: function (item, refItem, position) {
        var self = this;

        this.options.items.push(item);
        this.view.insertItem(item, refItem, position);

        // Insert children.
        // Check if there is a mapping instruction for the children field.
        if (typeof this.options.map.map.children != undefined && this.options.map.map.children != null) {
            // Check if the current item has children.
            var children = this.options.map._getObjFieldPointer(item, this.options.map.map.children.key);
            if (typeof children != undefined && children != null && children.length > 0) {
                children.each(function (childItem, i) {
                    self.insertItem(childItem, item, 'last');
                });
            }
        }
    },

    /**
     * Remove an item from the tree
     *
     * @param {mad.Model} item The item to remove
     */
    removeItem: function (item) {
        var position = this.options.items.indexOf(item);
        if (position != -1) {
            this.options.items.splice(position, 1);
            this.view.removeItem(item);
        }
    },

    /**
     * Refresh an item
     *
     * @param {mad.Model} item The item to refresh
     */
    refreshItem: function (item) {
        if (this.getItemClass() == null) {
            throw new mad.Exception('The associated itemClass can not be null');
        }
        if (!(item instanceof this.getItemClass())) {
            throw new mad.error.WrongParameter('item', this.getItemClass().fullName);
        }
        this.view.refreshItem(item);
    },

    /**
     * Reset the component by removing all the items.
     */
    reset: function () {
        // Remove all the items from the list.
        this.options.items.splice(0);
        // Reset the view
        this.view.reset();
    },

    /**
     * Load items into the tree.
     *
     * @param {mad.Model.List} items The list of items to load into the tree.
     *   Array are accepted.
     */
    load: function (items) {
        if (!items || !this.element) {
            return;
        }

        items.forEach(item => {
            this.insertItem(item);
        });
    },

    /**
     * Get the Model Class that defines the items displayed by the tree.
     *
     * @return {mad.Model.constructor}
     */
    getItemClass: function () {
        return this.options.itemClass;
    },

    /**
     * Set the Model Class that defines the items displayed by the tree.
     *
     * @param {mad.Model.constructor} itemClass
     */
    setItemClass: function (itemClass) {
        this.options.itemClass = itemClass;
    },

    /**
     * Get the map that is used to transform the raw data (items) into an expected view format.
     * expected view format
     *
     * @return {mad.Map}
     */
    getMap: function () {
        return this.options.map;
    },

    /**
     * Set the map that is used to transform the raw data (items) into an expected view format.
     *
     * @param {mad.Map} map The map
     */
    setMap: function (map) {
        this.options.map = map;
    },

    /**
     * Select an item.
     *
     * @param {mad.Model}
     */
    selectItem: function (item) {
        this.view.selectItem(item);
    },

    /**
     * Right select an item.
     *
     * @param {mad.Model}
     */
    rightSelectItem: function (item) {
        this.view.rightSelectItem(item);
    },

    /**
     * Unselect an item.
     * @param {mad.Model}
     * @todo unselectItem calls the unselectAll view function, check where this function is used and correct this logic problem.
     */
    unselectItem: function (item) {
        this.view.unselectAll();
    },

    /**
     * Hover an item.
     *
     * @param {mad.Model}
     */
    hoverItem: function (item) {
        this.view.hoverItem(item);
    },

    /**
     * Unselect all the previously selected items.
     */
    unselectAll: function () {
        this.view.unselectAll();
    },

    /* ************************************************************** */
    /* LISTEN TO THE VIEW EVENTS */
    /* ************************************************************** */

    /**
     * @function mad.component.Tree.item_selected
     * @parent mad.component.Tree.view_events
     *
     * An item has been selected
     *
     * @param {HTMLElement} el The element the event occurred on
     * @param {HTMLEvent} ev The event that occurred
     * @param {mixed} item The target item
     * @param {HTMLEvent} srcEv The source event that occurred
     */
    ' item_selected': function (el, ev, item, srcEv) {
        this.selectItem(item);
        // override this function, call _super if you want the default behavior processed
        if (this.options.callbacks.itemSelected) {
            this.options.callbacks.itemSelected(el, ev, item, srcEv);
        }
    },

    /**
     * @function mad.component.Tree.item_right_selected
     * @parent mad.component.Tree.view_events
     *
     * An item has been right selected
     *
     * @param {HTMLElement} el The element the event occurred on
     * @param {HTMLEvent} ev The event that occurred
     * @param {mixed} item The target item
     * @param {HTMLEvent} srcEv The source event that occurred
     */
    ' item_right_selected': function (el, ev, item, srcEv) {
        this.rightSelectItem(item);
        // override this function, call _super if you want the default behavior processed
        if (this.options.callbacks.itemRightSelected) {
            this.options.callbacks.itemRightSelected(el, ev, item, srcEv);
        }
    },

    /**
     * @function mad.component.Tree.item_hovered
     * @parent mad.component.Tree.view_events
     *
     * An item has been hovered
     *
     * @param {HTMLElement} el The element the event occurred on
     * @param {HTMLEvent} ev The event that occurred
     * @param {mixed} item The target item
     * @param {HTMLEvent} srcEv The source event that occurred
     */
    ' item_hovered': function (el, ev, item, srcEv) {
        this.hoverItem(item);
        // override this function, call _super if you want the default behavior processed
        if (this.options.callbacks.itemHovered) {
            this.options.callbacks.itemHovered(el, ev, item, srcEv);
        }
    }

});

export default Tree;