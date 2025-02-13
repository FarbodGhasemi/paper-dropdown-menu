/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-a11y-keys-behavior/iron-a11y-keys-behavior.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/paper-menu-button/paper-menu-button.js';
import '@polymer/paper-styles/default-theme.js';
import './paper-dropdown-menu-icons.js';
import './paper-dropdown-menu-shared-styles.js';

import {IronButtonState} from '@polymer/iron-behaviors/iron-button-state.js';
import {IronControlState} from '@polymer/iron-behaviors/iron-control-state.js';
import {IronFormElementBehavior} from '@polymer/iron-form-element-behavior/iron-form-element-behavior.js';
import {IronResizableBehavior} from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import {IronValidatableBehavior} from '@polymer/iron-validatable-behavior/iron-validatable-behavior.js';
import {PaperRippleBehavior} from '@polymer/paper-behaviors/paper-ripple-behavior.js';
import {Polymer} from '@polymer/polymer/lib/legacy/polymer-fn.js';
import {dom} from '@polymer/polymer/lib/legacy/polymer.dom.js';
import * as gestures from '@polymer/polymer/lib/utils/gestures.js';
import {html} from '@polymer/polymer/lib/utils/html-tag.js';

/**
Material design: [Dropdown
menus](https://www.google.com/design/spec/components/buttons.html#buttons-dropdown-buttons)

This is a faster, lighter version of `paper-dropdown-menu`, that does not
use a `<paper-input>` internally. Use this element if you're concerned about
the performance of this element, i.e., if you plan on using many dropdowns on
the same page. Note that this element has a slightly different styling API
than `paper-dropdown-menu`.

`paper-dropdown-menu-light` is similar to a native browser select element.
`paper-dropdown-menu-light` works with selectable content. The currently
selected item is displayed in the control. If no item is selected, the `label`
is displayed instead.

Example:

    <paper-dropdown-menu-light label="Your favourite pastry">
      <paper-listbox slot="dropdown-content">
        <paper-item>Croissant</paper-item>
        <paper-item>Donut</paper-item>
        <paper-item>Financier</paper-item>
        <paper-item>Madeleine</paper-item>
      </paper-listbox>
    </paper-dropdown-menu-light>

This example renders a dropdown menu with 4 options.

The child element with the slot `dropdown-content` is used as the dropdown
menu. This can be a [`paper-listbox`](paper-listbox), or any other or
element that acts like an [`iron-selector`](iron-selector).

Specifically, the menu child must fire an
[`iron-select`](iron-selector#event-iron-select) event when one of its
children is selected, and an
[`iron-deselect`](iron-selector#event-iron-deselect) event when a child is
deselected. The selected or deselected item must be passed as the event's
`detail.item` property.

Applications can listen for the `iron-select` and `iron-deselect` events
to react when options are selected and deselected.

### Styling

The following custom properties and mixins are also available for styling:

Custom property | Description | Default
----------------|-------------|----------
`--paper-dropdown-menu` | A mixin that is applied to the element host | `{}`
`--paper-dropdown-menu-disabled` | A mixin that is applied to the element host when disabled | `{}`
`--paper-dropdown-menu-ripple` | A mixin that is applied to the internal ripple | `{}`
`--paper-dropdown-menu-button` | A mixin that is applied to the internal menu button | `{}`
`--paper-dropdown-menu-icon` | A mixin that is applied to the internal icon | `{}`
`--paper-dropdown-menu-disabled-opacity` | The opacity of the dropdown when disabled  | `0.33`
`--paper-dropdown-menu-color` | The color of the input/label/underline when the dropdown is unfocused | `--primary-text-color`
`--paper-dropdown-menu-focus-color` | The color of the label/underline when the dropdown is focused  | `--primary-color`
`--paper-dropdown-error-color` | The color of the label/underline when the dropdown is invalid  | `--error-color`
`--paper-dropdown-menu-label` | Mixin applied to the label | `{}`
`--paper-dropdown-menu-input` | Mixin appled to the input | `{}`

Note that in this element, the underline is just the bottom border of the
"input". To style it:

    <style is=custom-style>
      paper-dropdown-menu-light.custom {
        --paper-dropdown-menu-input: {
          border-bottom: 2px dashed lavender;
        };
    </style>

@element paper-dropdown-menu-light
@demo demo/index.html
*/
Polymer({
  /** @override */
  _template: html`
    <style include="paper-dropdown-menu-shared-styles">
      :host(:focus) {
        outline: none;
      }

      :host {
        width: 200px;  /* Default size of an <input> */
      }

      /**
       * All of these styles below are for styling the fake-input display
       */
      [slot="dropdown-trigger"] {
        box-sizing: border-box;
        position: relative;
        width: 100%;
        padding: 16px 0 8px 0;
      }

      :host([disabled]) [slot="dropdown-trigger"] {
        pointer-events: none;
        opacity: var(--paper-dropdown-menu-disabled-opacity, 0.33);
      }

      :host([no-label-float]) [slot="dropdown-trigger"] {
        padding-top: 8px;   /* If there's no label, we need less space up top. */
      }

      #input {
        @apply --paper-font-subhead;
        @apply --paper-font-common-nowrap;
        line-height: 1.5;
        border-bottom: 1px solid var(--paper-dropdown-menu-color, var(--secondary-text-color));
        color: var(--paper-dropdown-menu-color, var(--primary-text-color));
        width: 100%;
        box-sizing: border-box;
        padding: 12px 20px 0 0;   /* Right padding so that text doesn't overlap the icon */
        outline: none;
        @apply --paper-dropdown-menu-input;
      }

      #input:dir(rtl) {
        padding-right: 0px;
        padding-left: 20px;
      }

      :host([disabled]) #input {
        border-bottom: 1px dashed var(--paper-dropdown-menu-color, var(--secondary-text-color));
      }

      :host([invalid]) #input {
        border-bottom: 2px solid var(--paper-dropdown-error-color, var(--error-color));
      }

      :host([no-label-float]) #input {
        padding-top: 0;   /* If there's no label, we need less space up top. */
      }

      label {
        @apply --paper-font-subhead;
        @apply --paper-font-common-nowrap;
        display: block;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        /**
         * The container has a 16px top padding, and there's 12px of padding
         * between the input and the label (from the input's padding-top)
         */
        top: 28px;
        box-sizing: border-box;
        width: 100%;
        padding-right: 20px;    /* Right padding so that text doesn't overlap the icon */
        text-align: left;
        transition-duration: .2s;
        transition-timing-function: cubic-bezier(.4,0,.2,1);
        color: var(--paper-dropdown-menu-color, var(--secondary-text-color));
        @apply --paper-dropdown-menu-label;
      }

      label:dir(rtl) {
        padding-right: 0px;
        padding-left: 20px;
      }

      :host([no-label-float]) label {
        top: 8px;
        /* Since the label doesn't need to float, remove the animation duration
        which slows down visibility changes (i.e. when a selection is made) */
        transition-duration: 0s;
      }

      label.label-is-floating {
        font-size: 12px;
        top: 8px;
      }

      label.label-is-hidden {
        visibility: hidden;
      }

      :host([focused]) label.label-is-floating {
        color: var(--paper-dropdown-menu-focus-color, var(--primary-color));
      }

      :host([invalid]) label.label-is-floating {
        color: var(--paper-dropdown-error-color, var(--error-color));
      }

      /**
       * Sets up the focused underline. It's initially hidden, and becomes
       * visible when it's focused.
       */
      label:after {
        background-color: var(--paper-dropdown-menu-focus-color, var(--primary-color));
        bottom: 7px;    /* The container has an 8px bottom padding */
        content: '';
        height: 2px;
        left: 45%;
        position: absolute;
        transition-duration: .2s;
        transition-timing-function: cubic-bezier(.4,0,.2,1);
        visibility: hidden;
        width: 8px;
        z-index: 10;
      }

      :host([invalid]) label:after {
        background-color: var(--paper-dropdown-error-color, var(--error-color));
      }

      :host([no-label-float]) label:after {
        bottom: 7px;    /* The container has a 8px bottom padding */
      }

      :host([focused]:not([disabled])) label:after {
        left: 0;
        visibility: visible;
        width: 100%;
      }

      iron-icon {
        position: absolute;
        right: 0px;
        bottom: 8px;    /* The container has an 8px bottom padding */
        @apply --paper-font-subhead;
        color: var(--disabled-text-color);
        @apply --paper-dropdown-menu-icon;
      }

      iron-icon:dir(rtl) {
        left: 0;
        right: auto;
      }

      :host([no-label-float]) iron-icon {
        margin-top: 0px;
      }

      .error {
        display: inline-block;
        visibility: hidden;
        color: var(--paper-dropdown-error-color, var(--error-color));
        @apply --paper-font-caption;
        position: absolute;
        left:0;
        right:0;
        bottom: -12px;
      }

      :host([invalid]) .error {
        visibility: visible;
      }
    </style>

    <!-- this div fulfills an a11y requirement for combobox, do not remove -->
    <span role="button"></span>
    <paper-menu-button id="menuButton" vertical-align="[[verticalAlign]]" horizontal-align="[[horizontalAlign]]" vertical-offset="[[_computeMenuVerticalOffset(noLabelFloat, verticalOffset)]]" disabled="[[disabled]]" no-animations="[[noAnimations]]" on-iron-select="_onIronSelect" on-iron-deselect="_onIronDeselect" opened="{{opened}}" close-on-activate allow-outside-scroll="[[allowOutsideScroll]]">
      <!-- support hybrid mode: user might be using paper-menu-button 1.x which distributes via <content> -->
      <div class="dropdown-trigger" slot="dropdown-trigger">
        <label class\$="[[_computeLabelClass(noLabelFloat,alwaysFloatLabel,hasContent)]]">
          [[label]]
        </label>
        <div id="input" tabindex="-1">&nbsp;</div>
        <iron-icon icon="paper-dropdown-menu:arrow-drop-down"></iron-icon>
        <span class="error">[[errorMessage]]</span>
      </div>
      <slot id="content" name="dropdown-content" slot="dropdown-content"></slot>
    </paper-menu-button>
`,

  is: 'paper-dropdown-menu-light',

  behaviors: [
    IronButtonState,
    IronControlState,
    PaperRippleBehavior,
    IronFormElementBehavior,
    IronValidatableBehavior,
    IronResizableBehavior
  ],

  properties: {
    /**
     * The derived "label" of the currently selected item. This value
     * is the `label` property on the selected item if set, or else the
     * trimmed text content of the selected item.
     */
    selectedItemLabel: {type: String, notify: true, readOnly: true},

    /**
     * The last selected item. An item is selected if the dropdown menu has
     * a child with class `dropdown-content`, and that child triggers an
     * `iron-select` event with the selected `item` in the `detail`.
     *
     * @type {?Object}
     */
    selectedItem: {type: Object, notify: true, readOnly: true},

    /**
     * The value for this element that will be used when submitting in
     * a form. It reflects the value of `selectedItemLabel`. If set directly,
     * it will not update the `selectedItemLabel` value.
     */
    value: {
      type: String,
      notify: true,
      observer: '_valueChanged',
    },

    /**
     * The label for the dropdown.
     */
    label: {type: String},

    /**
     * The placeholder for the dropdown.
     */
    placeholder: {type: String},

    /**
     * True if the dropdown is open. Otherwise, false.
     */
    opened:
        {type: Boolean, notify: true, value: false, observer: '_openedChanged'},

    /**
     * By default, the dropdown will constrain scrolling on the page
     * to itself when opened.
     * Set to true in order to prevent scroll from being constrained
     * to the dropdown when it opens.
     */
    allowOutsideScroll: {type: Boolean, value: false},

    /**
     * Set to true to disable the floating label. Bind this to the
     * `<paper-input-container>`'s `noLabelFloat` property.
     */
    noLabelFloat: {type: Boolean, value: false, reflectToAttribute: true},

    /**
     * Set to true to always float the label. Bind this to the
     * `<paper-input-container>`'s `alwaysFloatLabel` property.
     */
    alwaysFloatLabel: {type: Boolean, value: false},

    /**
     * Set to true to disable animations when opening and closing the
     * dropdown.
     */
    noAnimations: {type: Boolean, value: false},

    /**
     * The orientation against which to align the menu dropdown
     * horizontally relative to the dropdown trigger.
     */
    horizontalAlign: {type: String, value: 'right'},

    /**
     * The orientation against which to align the menu dropdown
     * vertically relative to the dropdown trigger.
     */
    verticalAlign: {type: String, value: 'top'},

    /**
     * Overrides the vertical offset computed in
     * _computeMenuVerticalOffset.
     */
    verticalOffset: Number,

    hasContent: {type: Boolean, readOnly: true},

    /**
     * Whether the dropdown should be the same size az the selectbox.
     */
    fullWidthDropdown: {type: Boolean, value: false}
  },

  listeners: {'tap': '_onTap'},

  /**
   * @type {!Object}
   */
  keyBindings: {'up down': 'open', 'esc': 'close'},

  hostAttributes: {
    tabindex: 0,
    role: 'combobox',
    'aria-autocomplete': 'none',
    'aria-haspopup': 'true'
  },

  observers: ['_selectedItemChanged(selectedItem)'],

  /** @override */
  attached: function() {
    // NOTE(cdata): Due to timing, a preselected value in a `IronSelectable`
    // child will cause an `iron-select` event to fire while the element is
    // still in a `DocumentFragment`. This has the effect of causing
    // handlers not to fire. So, we double check this value on attached:
    var contentElement = this.contentElement;
    if (contentElement && contentElement.selectedItem) {
      this._setSelectedItem(contentElement.selectedItem);
    }
  },

  /**
   * When the element is ready
   */
  ready() {
    if (this.fullWidthDropdown) {
      var ironDropdown = this.$.menuButton.root.querySelector('iron-dropdown');
      this.addEventListener('iron-resize', () => {
        setTimeout(
            () => {ironDropdown.style.width =
                       this.root.host.offsetWidth + 'px'},
            10);
      }, this);
    }
  },

  /**
   * The content element that is contained by the dropdown menu, if any.
   */
  get contentElement() {
    // Polymer 2.x returns slot.assignedNodes which can contain text nodes.
    var nodes = dom(this.$.content).getDistributedNodes();
    for (var i = 0, l = nodes.length; i < l; i++) {
      if (nodes[i].nodeType === Node.ELEMENT_NODE) {
        return nodes[i];
      }
    }
  },

  /**
   * Show the dropdown content.
   */
  open: function() {
    this.$.menuButton.open();
  },

  /**
   * Hide the dropdown content.
   */
  close: function() {
    this.$.menuButton.close();
  },

  /**
   * A handler that is called when `iron-select` is fired.
   *
   * @param {CustomEvent} event An `iron-select` event.
   */
  _onIronSelect: function(event) {
    this._setSelectedItem(event.detail.item);
  },

  /**
   * A handler that is called when `iron-deselect` is fired.
   *
   * @param {CustomEvent} event An `iron-deselect` event.
   */
  _onIronDeselect: function(event) {
    this._setSelectedItem(null);
  },

  /**
   * A handler that is called when the dropdown is tapped.
   *
   * @param {CustomEvent} event A tap event.
   */
  _onTap: function(event) {
    if (gestures.findOriginalTarget(event) === this) {
      this.open();
    }
  },

  /**
   * Compute the label for the dropdown given a selected item.
   *
   * @param {Element} selectedItem A selected Element item, with an
   * optional `label` property.
   */
  _selectedItemChanged: function(selectedItem) {
    var value = '';
    if (!selectedItem) {
      value = '';
    } else {
      value = selectedItem.label || selectedItem.getAttribute('label') ||
          selectedItem.textContent.trim();
    }

    this.value = value;
    this._setSelectedItemLabel(value);
  },

  /**
   * Compute the vertical offset of the menu based on the value of
   * `noLabelFloat`.
   *
   * @param {boolean} noLabelFloat True if the label should not float
   * @param {number=} opt_verticalOffset Optional offset from the user
   * above the input, otherwise false.
   */
  _computeMenuVerticalOffset: function(noLabelFloat, opt_verticalOffset) {
    // Override offset if it's passed from the user.
    if (opt_verticalOffset) {
      return opt_verticalOffset;
    }

    // NOTE(cdata): These numbers are somewhat magical because they are
    // derived from the metrics of elements internal to `paper-input`'s
    // template. The metrics will change depending on whether or not the
    // input has a floating label.
    return noLabelFloat ? -4 : 8;
  },

  /**
   * Returns false if the element is required and does not have a selection,
   * and true otherwise.
   * @param {*=} _value Ignored.
   * @return {boolean} true if `required` is false, or if `required` is true
   * and the element has a valid selection.
   */
  _getValidity: function(_value) {
    return this.disabled || !this.required || (this.required && !!this.value);
  },

  _openedChanged: function() {
    var openState = this.opened ? 'true' : 'false';
    var e = this.contentElement;
    if (e) {
      e.setAttribute('aria-expanded', openState);
    }
  },

  _computeLabelClass: function(noLabelFloat, alwaysFloatLabel, hasContent) {
    var cls = '';
    if (noLabelFloat === true) {
      return hasContent ? 'label-is-hidden' : '';
    }

    if (hasContent || alwaysFloatLabel === true) {
      cls += ' label-is-floating';
    }
    return cls;
  },

  _valueChanged: function() {
    // Only update if it's actually different.
    if (this.$.input && this.$.input.textContent !== this.value) {
      this.$.input.textContent = this.value;
    }
    this._setHasContent(!!this.value);
  }
});
