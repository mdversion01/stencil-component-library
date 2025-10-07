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
  @Prop() newToggleTxt: { on: string; off: string } = { on: 'On', off: 'Off' };
  @Prop() validation: boolean = false;
  @Prop() validationMessage: string = '';

  @Prop() switches: boolean = false;
  @Prop() switchesArray: ToggleItem[] = [];

  // NEW: choose custom vs bootstrap
  @Prop() customSwitch: boolean = false;

  @State() keyboardFocused: boolean = false;
  @State() isChecked: boolean = false;
  @State() internalSwitchesArray: ToggleItem[] = [];

  @Event({ eventName: 'checkedChanged', bubbles: true, composed: true })
  checkedChanged: EventEmitter<{ id: string; checked: boolean }>;

  componentWillLoad() {
    this.isChecked = this.checked;
    this.internalSwitchesArray = [...this.switchesArray];
  }

  @Watch('switchesArray')
  syncSwitchesArray(newValue: ToggleItem[]) {
    this.internalSwitchesArray = [...newValue];
  }

  @Watch('checked')
  handleCheckedChange(newValue: boolean) {
    this.isChecked = newValue;
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
    if (this.disabled || item.disabled) return;

    const updated = [...this.internalSwitchesArray];
    updated[index].checked = !updated[index].checked;
    this.internalSwitchesArray = updated;
    this.checkedChanged.emit({ id: updated[index].id, checked: updated[index].checked });
  }

  private toggleSingle = () => {
    if (this.disabled) return;
    this.isChecked = !this.isChecked;
    this.checkedChanged.emit({ id: this.inputId, checked: this.isChecked });
  };

  // ---------- RENDER HELPERS (MULTI) ----------
  private renderBootstrapSwitch(item: ToggleItem, parentId: string, index: number) {
    const switchId = `${parentId}_option_${item.id}`;
    const invalid = item.required && item.validation && !item.checked;
    const showToggleTxt = (item.toggleTxt ?? this.toggleTxt) === true;
    const toggleText = item.checked ? (item.newToggleTxt?.on || this.newToggleTxt.on) : (item.newToggleTxt?.off || this.newToggleTxt.off);

    // size: bootstrap doesn't have size variants for switches by default; keep your size hook as modifier classes if you style them
    const wrapperCls = [
      'form-check',
      'form-switch',
      this.inline ? 'form-check-inline' : '',
      this.size ? `ts-size-${item.size || this.size}` : '', // optional hook for custom sizing
    ].filter(Boolean).join(' ');

    return (
      <div class={wrapperCls}>
        <input
          id={switchId}
          class={`form-check-input ${invalid ? 'is-invalid' : ''}`}
          type="checkbox"
          role="switch"
          checked={item.checked}
          disabled={this.disabled || item.disabled}
          required={this.required || item.required}
          aria-checked={String(item.checked)}
          aria-disabled={String(this.disabled || item.disabled)}
          onChange={() => this.toggleSwitch(index)}
          value={item.value}
        />
        <label
          class="form-check-label"
          htmlFor={switchId}
          onMouseDown={e => e.preventDefault()}
        >
          {item.label}
          {showToggleTxt && <span class="toggleTxt-bold"> {toggleText}</span>}
          {item.required && <span class="required">*</span>}
        </label>

        {!this.inline && invalid && item.validationMessage && (
          <div class="invalid-feedback">{item.validationMessage}</div>
        )}
      </div>
    );
  }

  private renderCustomSwitch(item: ToggleItem, parentId: string, index: number) {
    const switchId = `${parentId}_option_${item.id}`;
    const toggleText = item.checked ? item.newToggleTxt?.on || this.newToggleTxt.on : item.newToggleTxt?.off || this.newToggleTxt.off;
    const showToggleTxt = item.toggleTxt ?? this.toggleTxt;
    const invalid = item.required && item.validation && !item.checked;

    if (this.inline) {
      return (
        <div class={`custom-control custom-switch ${item.size || this.size ? `custom-control-${item.size || this.size}` : ''} custom-control-inline`}>
          <div>
            <input
              id={switchId}
              type="checkbox"
              class="custom-control-input"
              role="switch"
              checked={item.checked}
              disabled={this.disabled || item.disabled}
              required={this.required || item.required}
              aria-checked={String(item.checked)}
              aria-disabled={String(this.disabled || item.disabled)}
              onChange={() => this.toggleSwitch(index)}
              value={item.value}
            />
            <label
              htmlFor={switchId}
              onMouseDown={e => e.preventDefault()}
              class={`custom-control-label ${this.keyboardFocused ? 'keyboard-focused' : ''} ${invalid ? 'invalid' : ''}`}
            >
              {item.label}
              {showToggleTxt && <span class="toggleTxt-bold"> {toggleText}</span>}
              {item.required && <span class="required">*</span>}
            </label>
          </div>
        </div>
      );
    }

    return (
      <div class={`custom-control custom-switch ${item.size || this.size ? `custom-control-${item.size || this.size}` : ''}`}>
        <input
          id={switchId}
          type="checkbox"
          class="custom-control-input"
          role="switch"
          checked={item.checked}
          disabled={this.disabled || item.disabled}
          required={this.required || item.required}
          aria-checked={String(item.checked)}
          aria-disabled={String(this.disabled || item.disabled)}
          onChange={() => this.toggleSwitch(index)}
          value={item.value}
        />
        <label
          htmlFor={switchId}
          onMouseDown={e => e.preventDefault()}
          class={`custom-control-label ${this.keyboardFocused ? 'keyboard-focused' : ''} ${invalid ? 'invalid' : ''}`}
        >
          {item.label}
          {showToggleTxt && <span class="toggleTxt-bold"> {toggleText}</span>}
          {item.required && <span class="required">*</span>}
        </label>

        {invalid && item.validationMessage && <div class="invalid-feedback">{item.validationMessage}</div>}
      </div>
    );
  }

  private renderSwitch(item: ToggleItem, parentId: string, index: number) {
    return this.customSwitch
      ? this.renderCustomSwitch(item, parentId, index)
      : this.renderBootstrapSwitch(item, parentId, index);
  }

  // ---------- RENDER (SINGLE) ----------
  private renderSingleBootstrap() {
    const switchId = this.inputId || 'toggle-switch-' + Math.random().toString(36).substr(2, 5);
    const toggleText = this.isChecked ? this.newToggleTxt.on : this.newToggleTxt.off;
    const invalid = this.required && this.validation && !this.isChecked;

    const wrapperCls = [
      'form-check',
      'form-switch',
      this.inline ? 'form-check-inline' : '',
      this.size ? `ts-size-${this.size}` : '',
    ].filter(Boolean).join(' ');

    return (
      <div class="form-group toggle-switch">
        <div class={wrapperCls}>
          <input
            id={switchId}
            class={`form-check-input ${invalid ? 'is-invalid' : ''}`}
            type="checkbox"
            role="switch"
            checked={this.isChecked}
            disabled={this.disabled}
            required={this.required}
            aria-checked={String(this.isChecked)}
            aria-disabled={String(this.disabled)}
            onChange={this.toggleSingle}
            value={this.value}
          />
          <label
            class="form-check-label"
            htmlFor={switchId}
            onMouseDown={e => e.preventDefault()}
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

  private renderSingleCustom() {
    const switchId = this.inputId || 'toggle-switch-' + Math.random().toString(36).substr(2, 5);
    const toggleText = this.isChecked ? this.newToggleTxt.on : this.newToggleTxt.off;
    const invalid = this.required && this.validation && !this.isChecked;

    return (
      <div class="form-group toggle-switch">
        <div class={`custom-control custom-switch ${this.size ? `custom-control-${this.size}` : ''} ${this.inline ? 'custom-control-inline' : ''}`}>
          <input
            id={switchId}
            class="custom-control-input"
            type="checkbox"
            role="switch"
            checked={this.isChecked}
            disabled={this.disabled}
            required={this.required}
            aria-checked={String(this.isChecked)}
            aria-disabled={String(this.disabled)}
            onChange={this.toggleSingle}
            value={this.value}
          />
          <label
            htmlFor={switchId}
            onMouseDown={e => e.preventDefault()}
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
      const invalidItems = this.internalSwitchesArray.filter(i => i.required && i.validation && !i.checked);
      const invalidMessages = invalidItems.map(i => i.validationMessage?.trim()).filter(Boolean) as string[];
      const hasAnyInvalid = invalidMessages.length > 0;

      return (
        <div class="form-group ts-group">
          <div
            id={parentId}
            role="group"
            class={this.inline ? (this.customSwitch ? '' : 'form-toggle-inline') : ''} // keep your class hook if needed
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

    // single
    return this.customSwitch ? this.renderSingleCustom() : this.renderSingleBootstrap();
  }
}
