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
import CanList from 'can-list';
import Component from 'passbolt-mad/component/component';
import DomData from 'can-dom-data';
import getObject from 'can-util/js/get/get';
import GridColumn from 'passbolt-mad/model/grid_column';
import GridView from 'passbolt-mad/view/component/grid';

import columnHeaderTemplate from 'passbolt-mad/view/template/component/grid/gridColumnHeader.stache!';
import template from 'passbolt-mad/view/template/component/grid/grid.stache!';
import itemTemplate from 'passbolt-mad/view/template/component/grid/gridItem.stache!';
import cellTemplate from 'passbolt-mad/view/template/component/grid/gridCell.stache!';

import 'passbolt-mad/view/helper/stache/grid/grid_cell.js';

/**
 * @parent Mad.components_api
 * @inherits mad.Component
 * @group mad.component.Grid.view_events 0 View Events
 *
 * The Grid Component as for aim to display a data grid.
 * @todo TBD
 */
const Grid = Component.extend('mad.component.Grid', {

  defaults: {
    // Override the label option.
    label: 'Grid Component',
    // Override the cssClasses option.
    cssClasses: ['tableview'],
    // Override the tag option.
    tag: 'div',
    // Override the template option.
    template: template,
    // The component header column template.
    columnHeaderTemplate: columnHeaderTemplate,
    // The component item template.
    itemTemplate: itemTemplate,
    // The component cell template.
    cellTemplate: cellTemplate,
    // Override the viewClass option.
    viewClass: GridView,
    // Prefix the id of each row.
    prefixItemId: '',
    // The Model Class that defines the items displayed by the grud.
    itemClass: null,
    // The Map Class used to defined the column model.
    columnModelClass: GridColumn,
    // the grid column model
    columnModel: [],
    // The map used to transform the raw data into expected view format.
    map: null,
    // The callbacks the component offers to the dev to bind their code.
    callbacks: {
      // An item is left click selected.
      item_selected: null,
      // An item is hovered.
      item_hovered: null
    },
    // The items the grid works with.
    items: null,
    // Is the grid filtered.
    isFiltered: false,
    // Is the grid sorted.
    isSorted: false
  }

}, /** @prototype */ {

  /**
   * Constructor.
   * Instantiate a new Grid Component.
   * @param {HTMLElement|can.NodeList|CSSSelectorString} el The element the control will be created on
   * @param {Object} [options] option values for the component.  These get added to
   * this.options and merged with defaults static variable
   * @return {mad.component.Grid}
   */
  init: function(el, options) {
    options.items = new options.itemClass.List();
    this._super(el, options);

    /*
     * Keep a trace of the items after mapping.
     * This data will be used for post rendering treatments :
     * * sort ;
     */
    this.mappedItems = {};

    this.on();
  },

  /**
   * After start hook().
   */
  afterStart: function() {
    const columnModel = this.getColumnModel();

    /*
     * Associate columnModel definitions to corresponding DOM elements th column header.
     * It will be used by the view to retrieve associated column model definition.
     */
    for (const i in columnModel) {
      const $el = $(`th.js_grid_column_${columnModel[i].name}`, this.element);
      DomData.set($el[0], this.getColumnModelClass().constructor.shortName, columnModel[i]);
    }

    this._super();
  },

  /**
   * Before render.
   */
  beforeRender: function() {
    this.setViewData('columnModel', this.options.columnModel);
    this.setViewData('columnHeaderTemplate', this.options.columnHeaderTemplate);
    this.setViewData('items', []);
    this._super();
  },

  /**
   * Get a target column model of the grid.
   * If no target
   *
   * @param {string} name (optional) The name of the column model to retrieve, if not provided return all.
   * @return {mad.model.Model}
   */
  getColumnModel: function(name) {
    let returnValue = null;
    if (name != undefined) {
      for (const i in this.options.columnModel) {
        if (this.options.columnModel[i].name == name) {
          return this.options.columnModel[i];
        }
      }
    } else {
      returnValue = this.options.columnModel;
    }
    return returnValue;
  },

  /**
   * Get the itemClass which represents the items managed by the component.
   *
   * @return {mad.model.Model}
   */
  getItemClass: function() {
    return this.options.itemClass;
  },

  /**
   * Get the column model class.
   *
   * @return {can.Map}
   */
  getColumnModelClass: function() {
    return this.options.columnModelClass;
  },

  /**
   * Return true if the grid is filtered, else return false.
   *
   * @returns {boolean}
   */
  isFiltered: function() {
    return this.options.isFiltered;
  },

  /**
   * Set the itemClass which represents the items managed by the component.
   *
   * @param {DefineMap.prototype} itemClass The item class
   */
  setItemClass: function(itemClass) {
    this.options.itemClass = itemClass;
  },

  /**
   * Get the associated map, which will be used to map the model data to the
   * expected view format.
   *
   * @return {mad.object.Map}
   */
  getMap: function() {
    return this.options.map;
  },

  /**
   * Set the associated map, which will be used to map the model data to the
   * expected view format.
   *
   * @param {UtilMap} map The map
   */
  setMap: function(map) {
    this.options.map = map;
  },

  /**
   * Select an item.
   *
   * @param {DefineMap}
   */
  selectItem: function(item) {
    this.view.selectItem(item);
  },

  /**
   * Right select an item.
   *
   * @param {DefineMap}
   */
  rightSelectItem: function(item) {
    this.view.rightSelectItem(item);
  },

  /**
   * Unselect an item.
   * @param {DefineMap}
   * @todo unselectItem calls the unselectAll view function, check where this function is used and correct this logic problem.
   */
  // eslint-disable-next-line no-unused-vars
  unselectItem: function(item) {
    this.view.unselectAll();
  },

  /**
   * Hover an item.
   *
   * @param {DefineMap}
   */
  hoverItem: function(item) {
    this.view.hoverItem(item);
  },

  /**
   * Unselect all the previously selected items.
   */
  unselectAll: function() {
    this.view.unselectAll();
  },

  /**
   * Remove an item from the grid.
   *
   * @param {DefineMap} item The item to remove
   */
  removeItem: function(item) {
    // Remove the item from the list.
    let index = -1;
    this.options.items.forEach((_item, i) => {
      if (_item.id == item.id) { index = i; }
    });
    if (index != -1) {
      this.options.items.splice(index, 1);
    }
    // Remove the item to the view
    this.view.removeItem(item);
    // Free space, remove the relative mapped item
    delete this.mappedItems[item.id];
  },

  /**
   * Insert an item into the grid.
   *
   * @param {DefineMap} item The item to insert
   * @param {DefineMap} refItem (optional) The reference item to use to position the new item.
   * By default the item will be inserted as last element of the grid.
   * @param {string} position (optional) If the reference item has been defined. The position
   * of the item to insert, regarding the reference item.
   *
   * Available values : before, after, first, last.
   *
   * By default last.
   */
  insertItem: function(item, refItem, position) {
    const map = this.getMap();
    let mappedItem = null;
    const columnModels = this.getColumnModel();
    const itemClass = this.getItemClass();

    // An item should be given as parameter and valid.
    if (itemClass && !(item instanceof itemClass)) {
      throw mad.Exception.get(mad.error.WRONG_PARAMETER, 'item');
    }

    // A map should be defined and valid.
    if (map == null) {
      throw mad.Exception.get(mad.error.MISSING_OPTION, 'map');
    }

    // Add the item to the list of observed items
    this.options.items.push(item);

    // Map the item.
    mappedItem = this.getMap().mapObject(item);
    this.mappedItems[item.id] = mappedItem;

    // insert the item in the view
    this.view.insertItem(item, refItem, position);

    // Post rendering process.
    for (const j in columnModels) {
      const columnModel = columnModels[j];

      // Execute post cell rendered function if any.
      if (columnModel.afterRender) {
        const itemId = this.options.prefixItemId + mappedItem.id;
        const $cell = $(`#${itemId} .js_grid_column_${columnModel.name} div`);
        const cellValue = mappedItem[columnModel.name];
        columnModel.afterRender($cell, cellValue, mappedItem, item, columnModel);
      }
    }
  },

  /**
   * Refresh an item.
   *
   * @param {DefineMap} item The item to refresh
   */
  refreshItem: function(item) {
    this.view.refreshItem(item);

    let mappedItem = null;
    const columnModels = this.getColumnModel();

    // Map the item.
    mappedItem = this.getMap().mapObject(item);
    this.mappedItems[item.id] = mappedItem;

    // apply a widget to cells following the columns model
    for (const j in columnModels) {
      const columnModel = columnModels[j];

      // Execute post cell rendered function if any.
      if (columnModel.afterRender) {
        const itemId = this.options.prefixItemId + mappedItem.id;
        const $cell = $(`#${itemId} .js_grid_column_${columnModel.name} div`);
        const cellValue = mappedItem[columnModel.name];
        columnModel.afterRender($cell, cellValue, mappedItem, item, columnModel);
      }
    }
  },

  /**
   * Reset the grid.
   * Remove all the displayed (and hidden) items.
   */
  reset: function() {
    /*
     * reset the list of observed items
     * by removing an item from the items list stored in options, the grid will
     * update itself (check "{items} remove" listener)
     */
    this.options.items.splice(0, this.options.items.length);
    this.view.reset();
  },

  /**
   * Load items in the grid. If the grid contain items, reset it.
   *
   * @param {array<DefineMap>} items The array or list of items to insert in the grid
   */
  load: function(items) {
    this.reset();
    this.options.isFiltered = false;
    this.options.isSorted = false;
    this.view.markAsUnsorted();

    items.forEach(item => {
      this.insertItem(item);
    });

    return this;
  },

  /**
   * Does the item exist
   * @param {DefineMap} item The item to check if it existing
   * @return {boolean}
   */
  itemExists: function(item) {
    return this.view.getItemElement(item).length > 0 ? true : false;
  },

  /**
   * Reset the filtering
   */
  resetFilter: function() {
    this.options.isFiltered = false;
    const items = this.options.items;

    items.forEach(item => {
      this.view.showItem(item);
    });
  },

  /**
   * Filter items in the grid by keywords
   * @param {string} needle The string to search in the grid
   */
  filterByKeywords: function(needle, options) {
    options = options || {};

    // The fields to look into.
    let searchInFields = [];
    // The keywords to search.
    const keywords = needle.split(/\s+/);
    // Filtered resource.
    const filteredItems = new CanList();

    // The fields to look into have been given in options.
    if (typeof options.searchInFields != 'undefined') {
      searchInFields = options.searchInFields;
    } else {
      searchInFields = this.options.map.getModelTargetFieldsNames();
    }

    // Search the keywords in the list of items.
    const items = this.options.items;
    items.forEach(item => {
      // Foreach keywords.
      for (const j in keywords) {
        let found = false;
        let field = null;
        let i = 0;

        // Search in the item fields.
        while (!found && (field = searchInFields[i])) {
          /*
           * Is the field relative to a submodel with a multiple cardinality
           * Only search in first level.
           */
          if (/(\[\])+/.test(searchInFields[i])) {
            const crumbs = field.split('[].');
            const objects = getObject(item, crumbs[0]);
            objects.forEach(object => {
              if (!found) {
                const fieldValue = getObject(object, crumbs[1]);
                if (fieldValue) {
                  found = fieldValue.toLowerCase()
                    .indexOf(keywords[j].toLowerCase()) != -1;
                }
              }
            });
          } else {
            const object = getObject(item, field);
            if (object) {
              found = object.toLowerCase().indexOf(keywords[j].toLowerCase()) != -1;
            }
          }

          i++;
        }

        /*
         * If the keyword hasn't been found in any field.
         * Search in the next resource.
         */
        if (!found) {
          return;
        }
      }

      filteredItems.push(item);
    });

    // Filter the grid
    this.filter(filteredItems);
  },

  /**
   * Filter items in the grid
   * @param {can.List} items The list of items to filter
   */
  filter: function(filteredItems) {
    const self = this;
    this.options.isFiltered = true;
    const items = this.options.items;

    items.forEach(item => {
      if (filteredItems.indexOf(item) != -1) {
        self.view.showItem(item);
      } else {
        self.view.hideItem(item);
      }
    });
  },

  /**
   * Sort the grid functions of a given column.
   * @param columnModel The column the grid should be sort in functions of.
   * @param sortAsc Should the sort be ascending. True by default.
   */
  sort: function(columnModel, sortAsc) {
    this.options.isSorted = true;

    // Retrieve the mapped item attribute name.
    const columnId = columnModel.name;

    // Copy the mappedItems associativate array into array.
    const mappedItemsCopy = $.map(this.mappedItems, (value, index) => {
      value.id = index;
      return [value];
    });

    // Sort the mapped items
    mappedItemsCopy.sort((itemA, itemB) => {
      // ignore upper and lowercase
      const valueA = itemA[columnId] ? itemA[columnId].toUpperCase() : '';
      const valueB = itemB[columnId] ? itemB[columnId].toUpperCase() : '';

      if (valueA < valueB) {
        return sortAsc ? -1 : 1;
      } else if (valueA > valueB) {
        return sortAsc ? 1 : -1;
      }

      return 0;
    });

    // Move all the items following the sort result
    for (const i in mappedItemsCopy) {
      this.moveItem(mappedItemsCopy[i], i);
    }

    // Mark the column as sorted
    this.view.markColumnAsSorted(columnModel, sortAsc);
  },

  /**
   * Move an item to another position in the grid.
   * @param item The item to move
   * @param position The position to move the item to
   */
  moveItem: function(item, position) {
    this.view.moveItem(item, position);
  },

  /* ************************************************************** */
  /* LISTEN TO THE MODEL EVENTS */
  /* ************************************************************** */

  /**
   * Observe when items are removed from the list of observed items and
   * remove it from the grid
   * @param {mad.model.Model} model The model reference
   * @param {HTMLEvent} ev The event which occurred
   * @param {CanList} items The removed items
   */
  '{itemClass} destroyed': function(model, event, destroyedItem) {
    this.removeItem(destroyedItem);
  },

  /* ************************************************************** */
  /* LISTEN TO THE VIEW EVENTS */
  /* ************************************************************** */

  /**
   * @function mad.component.Grid.__column_sort_asc
   * @parent mad.component.Grid.view_events
   *
   * Observe when a sort is requested on a column.
   *
   * @param {HTMLElement} el The element the event occurred on
   * @param {HTMLEvent} ev The event that occurred
   */
  '{element} column_sort': function(el, ev) {
    const columnModel = ev.data.columnModel;
    const sortAsc = ev.data.sortAsc;
    this.sort(columnModel, sortAsc);
  },

  /**
   * @function mad.component.Grid.__item_selected
   * @parent mad.component.Grid.view_events
   *
   * Observe when an item is selected.
   *
   * @param {HTMLElement} el The element the event occurred on
   * @param {HTMLEvent} ev The event that occurred
   */
  '{element} item_selected': function(el, ev) {
    const item = ev.data.item;
    const srcEv = ev.data.srcEv;

    // override this function, call _super if you want the default behavior processed
    if (this.options.callbacks.itemSelected) {
      this.options.callbacks.itemSelected(el, ev, item, srcEv);
    }
  },

  /**
   * @function mad.component.Grid.__item_hovered
   * @parent mad.component.Grid.view_events
   *
   * Observe when an item has been hovered.
   *
   * @param {HTMLElement} el The element the event occurred on
   * @param {HTMLEvent} ev The event that occurred
   */
  '{element} item_hovered': function(el, ev) {
    const item = ev.data.item;
    const srcEv = ev.data.srcEv;

    // override this function, call _super if you want the default behavior processed
    if (this.options.callbacks.itemHovered) {
      this.options.callbacks.itemHovered(el, ev, item, srcEv);
    }
  }
});

export default Grid;
