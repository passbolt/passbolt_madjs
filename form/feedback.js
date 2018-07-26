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

/**
 * @parent Mad.form_api
 * @inherits mad.Component
 * @group mad.form.Feedback.states_changes 0 State changes
 *
 * The Form Feedback component as for aim to manage forms element validation feedback.
 */
const Feedback = Component.extend('mad.form.Feedback', /* @static */ {

  defaults: {}

}, /** @prototype */ {

  /**
   * Display an error message.
   * @param {string} message
   */
  error: function(message) {
    $(this.element).text(message);
    $(this.element).addClass('error');
  },

  /**
   * Reset.
   */
  reset: function() {
    $(this.element).text('');
    $(this.element).removeClass('error');
  },

  /**
   * Display a success message.
   * @param {string} message
   */
  success: function(message) {
    $(this.element).text(message);
    $(this.element).removeClass('error');
  }

});

export default Feedback;
