// src/components/toggle-switch/toggle-switch-component.tsx
import { Component, Prop, State, Event, EventEmitter, h, Watch } from '@stencil/core';
import type { ToggleItem } from './toggle-switch-types';

@Component({
  tag: 'toggle-switch-component',
  styleUrls: ['../form-styles.scss', 'toggle-switch.scss'],
  shadow: false,
})
export class ToggleSwitchComponent {
  @Prop() inputId: string = '';
  @Prop() checked: boolean = false;
  @Prop() disabled: boolean = false;
  @Prop() required: boolean = false;
  @Prop() labelTxt: string = '';
  @Prop() size: string = '';
  @Prop() inline: boolean = false;
  @Prop() value: string = '';
  @Prop() toggleTxt: boolean = false;

  /**
   * Programmatic API (property): el.newToggleTxt = { on:'On', off:'Off' }
   * IMPORTANT: do not mutate this prop internally.
   */
  @Prop() newToggleTxt: { on: string; off: string } = { on: 'On', off: 'Off' };

  /**
   * Attribute API: <toggle-switch-component new-toggle-txt='{"on":"A","off":"B"}'>
   * This is a STRING prop because HTML attributes are strings.
   */
  @Prop({ attribute: 'new-toggle-txt' }) newToggleTxtAttr: string = '';

  @Prop() validation: boolean = false;
  @Prop() validationMessage: string = '';

  @Prop() switches: boolean = false;
  @Prop() switchesArray: ToggleItem[] = [];

  // choose custom vs bootstrap
  @Prop() customSwitch: boolean = false;

  @State() keyboardFocused: boolean = false;
  @State() isChecked: boolean = false;
  @State() internalSwitchesArray: ToggleItem[] = [];

  /**
   * ✅ Resolved toggle text used by render.
   * Priority:
   *  1) new-toggle-txt attribute (JSON string)
   *  2) newToggleTxt prop (object)
   *  3) default {On/Off}
   */
  @State() private resolvedToggleTxt: { on: string; off: string } = { on: 'On', off: 'Off' };

  @Event({ eventName: 'checkedChanged', bubbles: true, composed: true })
  checkedChanged: EventEmitter<{ id: string; checked: boolean }>;

  componentWillLoad() {
    this.isChecked = !!this.checked;
    this.internalSwitchesArray = Array.isArray(this.switchesArray) ? [...this.switchesArray] : [];
    this.resolveToggleTxt();
  }

  @Watch('switchesArray')
  syncSwitchesArray(newValue: ToggleItem[]) {
    this.internalSwitchesArray = Array.isArray(newValue) ? [...newValue] : [];
  }

  @Watch('checked')
  handleCheckedChange(newValue: boolean) {
    this.isChecked = !!newValue;
  }

  @Watch('newToggleTxt')
  onNewToggleTxtPropChange() {
    // If attribute is NOT set, prop changes should update resolved value
    if (!this.newToggleTxtAttr || !String(this.newToggleTxtAttr).trim()) {
      this.resolveToggleTxt();
    }
  }

  @Watch('newToggleTxtAttr')
  onNewToggleTxtAttrChange() {
    // Attribute always wins when present
    this.resolveToggleTxt();
  }

  private resolveToggleTxt() {
    // 1) attribute JSON wins if valid
    const raw = (this.newToggleTxtAttr || '').trim();
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        const on = typeof parsed?.on === 'string' ? parsed.on : undefined;
        const off = typeof parsed?.off === 'string' ? parsed.off : undefined;
        this.resolvedToggleTxt = {
          on: on ?? 'On',
          off: off ?? 'Off',
        };
        return;
      } catch (_e) {
        // fall through to prop
      }
    }

    // 2) prop object
    const on = typeof this.newToggleTxt?.on === 'string' ? this.newToggleTxt.on : 'On';
    const off = typeof this.newToggleTxt?.off === 'string' ? this.newToggleTxt.off : 'Off';
    this.resolvedToggleTxt = { on, off };
  }

  componentDidLoad() {
    document.addEventListener('keydown', this.trackKeyboard);
    document.addEventListener('mousedown', this.trackMouse);
    document.addEventListener('touchstart', this.trackMouse);
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this.trackKeyboard);
    document.removeEventListener('mousedown', this.trackMouse);
    document.removeEventListener('touchstart', this.trackMouse);
  }

  private trackKeyboard = (e: KeyboardEvent) => {
    if (e.key === 'Tab') this.keyboardFocused = true;
  };

  private trackMouse = () => {
    this.keyboardFocused = false;
  };

  private toggleSwitch(index: number) {
    const item = this.internalSwitchesArray[index];
    if (!item) return;
    if (this.disabled || item.disabled) return;

    const updated = [...this.internalSwitchesArray];
    updated[index] = { ...updated[index], checked: !updated[index].checked };
    this.internalSwitchesArray = updated;

    this.checkedChanged.emit({ id: updated[index].id, checked: !!updated[index].checked });
  }

  private toggleSingle = () => {
    if (this.disabled) return;
    this.isChecked = !this.isChecked;
    this.checkedChanged.emit({ id: this.inputId || 'toggle', checked: !!this.isChecked });
  };

  // ---------- RENDER HELPERS (MULTI) ----------
  private renderBootstrapSwitch(item: ToggleItem, parentId: string, index: number) {
    const switchId = `${parentId}_option_${item.id}`;
    const invalid = !!(item.required && item.validation && !item.checked);

    const showToggleTxt = (item.toggleTxt ?? this.toggleTxt) === true;
    const base = this.resolvedToggleTxt;
    const toggleText = item.checked ? item.newToggleTxt?.on || base.on : item.newToggleTxt?.off || base.off;

    const wrapperCls = [
      'form-check',
      'form-switch',
      this.inline ? 'form-check-inline' : '',
      (item.size || this.size) ? `ts-size-${item.size || this.size}` : '',
    ]
      .filter(Boolean)
      .join(' ');

    const onLabelClick = (e: MouseEvent) => {
      e.preventDefault();
      this.toggleSwitch(index);
    };

    return (
      <div class={wrapperCls}>
        <input
          id={switchId}
          class={`form-check-input ${invalid ? 'is-invalid' : ''}`}
          type="checkbox"
          role="switch"
          checked={!!item.checked}
          disabled={!!(this.disabled || item.disabled)}
          required={!!(this.required || item.required)}
          aria-checked={String(!!item.checked)}
          aria-disabled={String(!!(this.disabled || item.disabled))}
          onChange={() => this.toggleSwitch(index)}
          value={item.value}
        />
        <label class="form-check-label" htmlFor={switchId} onClick={onLabelClick}>
          {item.label}
          {showToggleTxt && <span class="toggleTxt-bold"> {toggleText}</span>}
          {item.required && <span class="required">*</span>}
        </label>
        {!this.inline && invalid && item.validationMessage && <div class="invalid-feedback">{item.validationMessage}</div>}
      </div>
    );
  }

  private renderCustomSwitch(item: ToggleItem, parentId: string, index: number) {
    const switchId = `${parentId}_option_${item.id}`;

    const base = this.resolvedToggleTxt;
    const toggleText = item.checked ? item.newToggleTxt?.on || base.on : item.newToggleTxt?.off || base.off;
    const showToggleTxt = (item.toggleTxt ?? this.toggleTxt) === true;
    const invalid = !!(item.required && item.validation && !item.checked);

    const sizeClass = item.size || this.size ? `custom-control-${item.size || this.size}` : '';
    const wrapperCls = ['custom-control', 'custom-switch', sizeClass, this.inline ? 'custom-control-inline' : ''].filter(Boolean).join(' ');

    const onLabelClick = (e: MouseEvent) => {
      e.preventDefault();
      this.toggleSwitch(index);
    };

    return (
      <div class={wrapperCls}>
        <input
          id={switchId}
          type="checkbox"
          class="custom-control-input"
          role="switch"
          checked={!!item.checked}
          disabled={!!(this.disabled || item.disabled)}
          required={!!(this.required || item.required)}
          aria-checked={String(!!item.checked)}
          aria-disabled={String(!!(this.disabled || item.disabled))}
          onChange={() => this.toggleSwitch(index)}
          value={item.value}
        />
        <label
          htmlFor={switchId}
          onClick={onLabelClick}
          class={`custom-control-label ${this.keyboardFocused ? 'keyboard-focused' : ''} ${invalid ? 'invalid' : ''}`}
        >
          {item.label}
          {showToggleTxt && <span class="toggleTxt-bold"> {toggleText}</span>}
          {item.required && <span class="required">*</span>}
        </label>
        {!this.inline && invalid && item.validationMessage && <div class="invalid-feedback">{item.validationMessage}</div>}
      </div>
    );
  }

  private renderSwitch(item: ToggleItem, parentId: string, index: number) {
    return this.customSwitch ? this.renderCustomSwitch(item, parentId, index) : this.renderBootstrapSwitch(item, parentId, index);
  }

  // ---------- RENDER (SINGLE) ----------
  private renderSingleBootstrap() {
    const switchId = this.inputId || `toggle-switch-${Math.random().toString(36).slice(2, 7)}`;
    const base = this.resolvedToggleTxt;
    const toggleText = this.isChecked ? base.on : base.off;
    const invalid = !!(this.required && this.validation && !this.isChecked);

    const wrapperCls = ['form-check', 'form-switch', this.inline ? 'form-check-inline' : '', this.size ? `ts-size-${this.size}` : '']
      .filter(Boolean)
      .join(' ');

    const onLabelClick = (e: MouseEvent) => {
      e.preventDefault();
      this.toggleSingle();
    };

    return (
      <div class="form-group toggle-switch">
        <div class={wrapperCls}>
          <input
            id={switchId}
            class={`form-check-input ${invalid ? 'is-invalid' : ''}`}
            type="checkbox"
            role="switch"
            checked={!!this.isChecked}
            disabled={!!this.disabled}
            required={!!this.required}
            aria-checked={String(!!this.isChecked)}
            aria-disabled={String(!!this.disabled)}
            onChange={this.toggleSingle}
            value={this.value}
          />
          <label class="form-check-label" htmlFor={switchId} onClick={onLabelClick}>
            {this.labelTxt}
            {this.toggleTxt && <span class="toggleTxt-bold"> {toggleText}</span>}
            {this.required && <span class="required">*</span>}
          </label>
          {invalid && this.validationMessage && <div class="invalid-feedback">{this.validationMessage}</div>}
        </div>
      </div>
    );
  }

  private renderSingleCustom() {
    const switchId = this.inputId || `toggle-switch-${Math.random().toString(36).slice(2, 7)}`;
    const base = this.resolvedToggleTxt;
    const toggleText = this.isChecked ? base.on : base.off;
    const invalid = !!(this.required && this.validation && !this.isChecked);

    const wrapperCls = ['custom-control', 'custom-switch', this.size ? `custom-control-${this.size}` : '', this.inline ? 'custom-control-inline' : '']
      .filter(Boolean)
      .join(' ');

    const onLabelClick = (e: MouseEvent) => {
      e.preventDefault();
      this.toggleSingle();
    };

    return (
      <div class="form-group toggle-switch">
        <div class={wrapperCls}>
          <input
            id={switchId}
            class="custom-control-input"
            type="checkbox"
            role="switch"
            checked={!!this.isChecked}
            disabled={!!this.disabled}
            required={!!this.required}
            aria-checked={String(!!this.isChecked)}
            aria-disabled={String(!!this.disabled)}
            onChange={this.toggleSingle}
            value={this.value}
          />
          <label
            htmlFor={switchId}
            onClick={onLabelClick}
            class={`custom-control-label ${this.keyboardFocused ? 'keyboard-focused' : ''} ${invalid ? 'invalid' : ''}`}
          >
            {this.labelTxt}
            {this.toggleTxt && <span class="toggleTxt-bold"> {toggleText}</span>}
            {this.required && <span class="required">*</span>}
          </label>
          {invalid && this.validationMessage && <div class="invalid-feedback">{this.validationMessage}</div>}
        </div>
      </div>
    );
  }

  render() {
    const parentId = this.inputId || 'toggle-group';

    if (this.switches) {
      const invalidItems = this.internalSwitchesArray.filter((i) => i.required && i.validation && !i.checked);
      const invalidMessages = invalidItems.map((i) => i.validationMessage?.trim()).filter(Boolean) as string[];
      const hasAnyInvalid = invalidMessages.length > 0;

      return (
        <div class="form-group ts-group">
          <div
            id={parentId}
            role="group"
            class={this.inline ? (this.customSwitch ? '' : 'form-toggle-inline') : ''}
            aria-invalid={hasAnyInvalid ? 'true' : undefined}
            aria-describedby={hasAnyInvalid ? `${parentId}-validation` : undefined}
          >
            {this.internalSwitchesArray.map((item, i) => this.renderSwitch(item, this.inputId || parentId, i))}
          </div>

          {this.inline && hasAnyInvalid && (
            <div id={`${parentId}-validation`} class="ts-inline invalid-feedback">
              {invalidMessages.map((msg, idx) => (
                <div key={idx}>{msg}</div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return this.customSwitch ? this.renderSingleCustom() : this.renderSingleBootstrap();
  }
}
