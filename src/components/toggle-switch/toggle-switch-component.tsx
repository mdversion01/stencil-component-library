// src/components/toggle-switch/toggle-switch-component.tsx
import { Component, Prop, State, Event, EventEmitter, h, Watch, Element } from '@stencil/core';
import type { ToggleItem } from './toggle-switch-types';

/**
 * Accessibility / 508 notes (high level):
 * - Single switch:
 *   - native <input type="checkbox"> with role="switch"
 *   - label is associated via htmlFor/id
 *   - invalid state uses aria-invalid + aria-describedby -> validation message id
 *   - when label text is empty, provide an aria-label fallback
 *
 * - Switch group (multiple switches):
 *   - group wrapper uses role="group"
 *   - group invalid state uses aria-invalid + aria-describedby -> group validation id (inline mode)
 *   - each invalid item input also uses aria-invalid + aria-describedby -> its own validation message id
 *   - all ids are derived from inputId/item.id (no random ids needed for wiring)
 */
@Component({
  tag: 'toggle-switch-component',
  styleUrls: ['../form-styles.scss', 'toggle-switch.scss'],
  shadow: false,
})
export class ToggleSwitchComponent {
  @Element() host!: HTMLElement;

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

  /**
   * A11y fallback name for single-switch usage when labelTxt is empty.
   * (If labelTxt exists, label association is preferred.)
   */
  @Prop() ariaLabel: string = 'Toggle';

  /**
   * Optional: label the group wrapper (multiple switches) when you have a visible label elsewhere.
   * Example: ariaLabelledby="someLabelId"
   */
  @Prop({ attribute: 'aria-labelledby' }) ariaLabelledby: string = '';

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

  private getGroupId(): string {
    // Prefer deterministic id derived from inputId. If missing, derive from host (still stable in DOM).
    const base = (this.inputId || '').trim();
    if (base) return base;
    // deterministic-ish fallback (not random): use tag + incremental index if needed.
    // If a consumer doesn't pass inputId, the input itself will still be correctly labelled,
    // but group id is best-effort.
    return this.host.id?.trim() || 'toggle-group';
  }

  // ---------- RENDER HELPERS (MULTI) ----------
  private renderBootstrapSwitch(item: ToggleItem, parentId: string, index: number) {
    const switchId = `${parentId}_option_${item.id}`;
    const invalid = !!(item.required && item.validation && !item.checked);
    const msgId = `${switchId}-validation`;

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
          aria-required={item.required || this.required ? 'true' : undefined}
          aria-invalid={invalid ? 'true' : undefined}
          aria-describedby={invalid && item.validationMessage ? msgId : undefined}
          onChange={() => this.toggleSwitch(index)}
          value={item.value}
        />

        <label class="form-check-label" htmlFor={switchId} onClick={onLabelClick}>
          {item.label}
          {showToggleTxt && <span class="toggleTxt-bold"> {toggleText}</span>}
          {(item.required || this.required) && <span class="required">*</span>}
        </label>

        {/* Per-item message (non-inline OR inline—this message is for the input itself) */}
        {invalid && item.validationMessage && (
          <div id={msgId} class="invalid-feedback" role="alert" aria-live="polite">
            {item.validationMessage}
          </div>
        )}
      </div>
    );
  }

  private renderCustomSwitch(item: ToggleItem, parentId: string, index: number) {
    const switchId = `${parentId}_option_${item.id}`;
    const msgId = `${switchId}-validation`;

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
          class={`custom-control-input ${invalid ? 'is-invalid' : ''}`}
          role="switch"
          checked={!!item.checked}
          disabled={!!(this.disabled || item.disabled)}
          required={!!(this.required || item.required)}
          aria-checked={String(!!item.checked)}
          aria-disabled={String(!!(this.disabled || item.disabled))}
          aria-required={item.required || this.required ? 'true' : undefined}
          aria-invalid={invalid ? 'true' : undefined}
          aria-describedby={invalid && item.validationMessage ? msgId : undefined}
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
          {(item.required || this.required) && <span class="required">*</span>}
        </label>

        {invalid && item.validationMessage && (
          <div id={msgId} class="invalid-feedback" role="alert" aria-live="polite">
            {item.validationMessage}
          </div>
        )}
      </div>
    );
  }

  private renderSwitch(item: ToggleItem, parentId: string, index: number) {
    return this.customSwitch ? this.renderCustomSwitch(item, parentId, index) : this.renderBootstrapSwitch(item, parentId, index);
  }

  // ---------- RENDER (SINGLE) ----------
  private renderSingleBootstrap() {
    const switchId = (this.inputId || '').trim() || `toggle-switch`;
    const msgId = `${switchId}-validation`;

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

    const hasLabel = !!String(this.labelTxt || '').trim();
    const ariaLabel = hasLabel ? undefined : (this.ariaLabel || 'Toggle');

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
            aria-label={ariaLabel}
            aria-checked={String(!!this.isChecked)}
            aria-disabled={String(!!this.disabled)}
            aria-required={this.required ? 'true' : undefined}
            aria-invalid={invalid ? 'true' : undefined}
            aria-describedby={invalid && this.validationMessage ? msgId : undefined}
            onChange={this.toggleSingle}
            value={this.value}
          />

          <label class="form-check-label" htmlFor={switchId} onClick={onLabelClick}>
            {this.labelTxt}
            {this.toggleTxt && <span class="toggleTxt-bold"> {toggleText}</span>}
            {this.required && <span class="required">*</span>}
          </label>

          {invalid && this.validationMessage && (
            <div id={msgId} class="invalid-feedback" role="alert" aria-live="polite">
              {this.validationMessage}
            </div>
          )}
        </div>
      </div>
    );
  }

  private renderSingleCustom() {
    const switchId = (this.inputId || '').trim() || `toggle-switch`;
    const msgId = `${switchId}-validation`;

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

    const hasLabel = !!String(this.labelTxt || '').trim();
    const ariaLabel = hasLabel ? undefined : (this.ariaLabel || 'Toggle');

    return (
      <div class="form-group toggle-switch">
        <div class={wrapperCls}>
          <input
            id={switchId}
            class={`custom-control-input ${invalid ? 'is-invalid' : ''}`}
            type="checkbox"
            role="switch"
            checked={!!this.isChecked}
            disabled={!!this.disabled}
            required={!!this.required}
            aria-label={ariaLabel}
            aria-checked={String(!!this.isChecked)}
            aria-disabled={String(!!this.disabled)}
            aria-required={this.required ? 'true' : undefined}
            aria-invalid={invalid ? 'true' : undefined}
            aria-describedby={invalid && this.validationMessage ? msgId : undefined}
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

          {invalid && this.validationMessage && (
            <div id={msgId} class="invalid-feedback" role="alert" aria-live="polite">
              {this.validationMessage}
            </div>
          )}
        </div>
      </div>
    );
  }

  render() {
    const parentId = this.getGroupId();

    if (this.switches) {
      const invalidItems = this.internalSwitchesArray.filter((i) => i.required && i.validation && !i.checked);
      const invalidMessages = invalidItems.map((i) => i.validationMessage?.trim()).filter(Boolean) as string[];
      const hasAnyInvalid = invalidMessages.length > 0;

      // Only render group-level message in inline mode (existing behavior),
      // but keep group aria-invalid correct in all cases.
      const groupMsgId = `${parentId}-validation`;
      const groupLabelledby = this.normalizeIdList(this.ariaLabelledby);

      return (
        <div class="form-group ts-group">
          <div
            id={parentId}
            role="group"
            class={this.inline ? (this.customSwitch ? '' : 'form-toggle-inline') : ''}
            aria-labelledby={groupLabelledby || undefined}
            aria-invalid={hasAnyInvalid ? 'true' : undefined}
            aria-describedby={this.inline && hasAnyInvalid ? groupMsgId : undefined}
          >
            {this.internalSwitchesArray.map((item, i) => this.renderSwitch(item, this.inputId || parentId, i))}
          </div>

          {this.inline && hasAnyInvalid && (
            <div id={groupMsgId} class="ts-inline invalid-feedback" role="alert" aria-live="polite">
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

  // tiny helper to normalize id lists
  private normalizeIdList(value?: string): string | undefined {
    const trimmed = (value ?? '').trim();
    if (!trimmed) return undefined;
    const tokens = trimmed.split(/\s+/).filter(Boolean);
    return tokens.length ? tokens.join(' ') : undefined;
  }
}
