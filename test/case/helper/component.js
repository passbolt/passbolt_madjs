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
import "passbolt-mad/test/bootstrap";
import Tree from "passbolt-mad/component/tree";

describe("mad.helper.Component", function(){

	beforeEach(function(){
	});

	afterEach(function(){
        $('#test-html').empty();
	});

    it("create() should initialize and insert a new Component", function() {
        // Use a helper to insert a component.
        var component = mad.helper.Component.create(
            $rootElement,
            'last',
            mad.component.Tree
        );
        expect(component instanceof mad.component.Tree).to.be.true;

        // The component has been well inserted.
        component.start();
        expect($('.mad_component_tree').length).to.be.equal(1);

        // Quick check that everything is working fine with the primitive of the component.
        var items = new mad.Model.List([{
            id: 'item_1',
            label: 'Item 1'
        }, {
            id: 'item_2',
            label: 'Item 2'
        }, {
            id: 'item_3',
            label: 'Item 3'
        }]);
        component.load(items);

        expect($rootElement.text()).to.contain('Item 1');
        expect($rootElement.text()).to.contain('Item 2');
        expect($rootElement.text()).to.contain('Item 3');
    });

});
