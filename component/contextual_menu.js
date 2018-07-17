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
import ContextualMenuView from 'passbolt-mad/view/component/contextual_menu';
import DropdownMenuComponent from 'passbolt-mad/component/dropdown_menu';
import HtmlHelper from 'passbolt-mad/helper/html';

/**
 * @parent Mad.components_api
 * @inherits mad.Component
 *
 * The ContextualMenu is an implementation of a simple contextual menu that can
 * be displayed anywhere on the screen.
 * Usually it is displayed on the right click event at the mouse position.
 *
 * ## Example
 * @demo demo.html#contextual_menu/contextual_menu
 *
 * @constructor
 * Create a new ContextualMenu Component.
 * @signature `new mad.Component.ContextualMenu( element, options )`
 * @param {HTMLElement|can.NodeList|CSSSelectorString} el The element the control will be created on
 * @param {Object} [options] option values for the component.  These get added to
 * this.options and merged with defaults static variable
 *   * source : element which requests the contextual menu.
 *   * coordinates [ x, y ] : coordinates where you want to display the contextual menu.
 * @return {mad.component.ContextualMenu}
 */
const ContextualMenu = DropdownMenuComponent.extend('mad.component.ContextualMenu', {

  defaults: {
    viewClass: ContextualMenuView,
    cssClasses: ['contextual-menu'],
    // The element which requests the contextual menu.
    source: null,
    // The coordinates you want to display the contextual menu.
    coordinates: {
      x: null,
      y: null
    }
  },

  /**
   * Instantiate a contextual menu.
   * If a contextual menu is already instantiated, remove it.
   *
   * @signature `ContextualMenu.init( element, options )`
   * @param {HTMLElement|can.NodeList|CSSSelectorString} el The element the control will be created on
   * @param {Object} [options] option values for the component.  These get added to
   * this.options and merged with defaults static variable
   *   * source : element which requests the contextual menu.
   *   * coordinates [ x, y ] : coordinates where you want to display the contextual menu.
   * @return {mad.component.ContextualMenu}
   */
  instantiate: function(options) {
    if ($('#js_contextual_menu').length != 0) {
      $('#js_contextual_menu').remove();
    }

    HtmlHelper.create(
      'body',
      'first',
      '<ul id="js_contextual_menu" />'
    );

    return new this('#js_contextual_menu', options);
  },

  /**
   * Removes existing contextual menu from the dom.
   * Static function, can be called from anywhere.
   */
  remove: function() {
    $('#js_contextual_menu').remove();
  }

}, /** @prototype */ {

  /**
   * After start hook.
   * Position the contextual menu functions of the given position
   */
  afterStart: function() {
    this._super();
    this.view.position({
      coordinates: this.options.coordinates
    });
  },

  /**
   * Destructor.
   * Remove the contextual menu from the dom.
   */
  destroy: function() {
    this._super();
    ContextualMenu.remove();
  }
});

export default ContextualMenu;
