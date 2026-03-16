// src/components/checkbox-component/checkbox-component.tsx
import { Component, Prop, h, State, Event, EventEmitter, Element, Watch } from '@stencil/core';

@Component({
  tag: 'checkbox-component',
  styleUrls: ['./checkbox.scss', '../form-styles.scss', '../custom-form-inputs.scss'],
  shadow: false,
})
export class CheckboxComponent {
  @Element() host!: HTMLElement;

  @Prop() checkboxGroup = false;
  @Prop() customCheckbox = false;
  @Prop() customCheckboxGroup = false;

  @Prop() groupOptions: any = []; // JSON string or array
  @Prop() groupTitle = '';
  @Prop() groupTitleSize = '';
  @Prop() inline = false;
  @Prop() inputId = '';
  @Prop() name = '';
  @Prop() noPadding = false;
  @Prop() labelTxt = '';
  @Prop() required = false;
  @Prop() size = '';
  @Prop() checked: boolean = false;
  @Prop() disabled: boolean = false;
  @Prop() validation = false;
  @Prop() validationMsg = '';
  @Prop() value = '';

  @State() parsedOptions: Array<any> = [];
  @State() checkedValues: string[] = [];
  @State() singleChecked = false;

  @Event() groupChange: EventEmitter<string[]>;
  @Event() toggle: EventEmitter<{ checked: boolean; value: string; inputId: string }>;

  // ---------- Unique IDs (prevents collisions) ----------
  private static _seq = 0;
  private _baseId = '';

  private resolveBaseId() {
    if (this._baseId) return;

    const raw = (this.inputId || this.name || this.groupTitle || this.labelTxt || '').trim();
    let base = raw
      ? raw
          .replace(/\s+/g, '-')
          .replace(/[^A-Za-z0-9\-_:.]/g, '')
          .toLowerCase()
      : '';

    if (!base) {
      CheckboxComponent._seq += 1;
      const rnd = Math.random().toString(36).slice(2, 6);
      base = `chk-${CheckboxComponent._seq}-${rnd}`;
    }

    // If id already exists elsewhere, suffix it
    const existing = document.getElementById(base);
    if (existing && !this.host.contains(existing)) {
      CheckboxComponent._seq += 1;
      const rnd = Math.random().toString(36).slice(2, 6);
      base = `${base}-${CheckboxComponent._seq}-${rnd}`;
    }

    this._baseId = base;
  }

  private get ids(): string {
    this.resolveBaseId();
    return this._baseId;
  }

  private get groupLegendId(): string {
    return `${this.ids}-legend`;
  }

  private get validationId(): string {
    return `${this.ids}-validation`;
  }

  private normalizeOptions(input: any): any[] {
    if (Array.isArray(input)) return input;
    if (typeof input === 'string') {
      try {
        const parsed = JSON.parse(input);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  }

  private optionId(option: any, idx: number): string {
    // Prefer provided id, else generate stable-per-index id
    const raw = String(option?.inputId || '').trim();
    if (raw) return raw;
    return `${this.ids}-opt-${idx}`;
  }

  @Watch('checked')
  onCheckedPropChange(next: boolean) {
    this.singleChecked = !!next;
  }

  componentWillLoad() {
    this.parsedOptions = this.normalizeOptions(this.groupOptions);

    this.singleChecked = !!this.checked;

    this.checkedValues = this.parsedOptions.filter(opt => !!opt?.checked).map(opt => String(opt.value));
  }

  private handleGroupChange(event: Event, value: string) {
    const target = event.target as HTMLInputElement;
    let updated = [...this.checkedValues];

    if (target.checked) {
      if (!updated.includes(value)) updated.push(value);
    } else {
      updated = updated.filter(v => v !== value);
    }

    this.checkedValues = updated;
    this.groupChange.emit(this.checkedValues);
  }

  private handleSingleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.singleChecked = target.checked;

    this.toggle.emit({ checked: this.singleChecked, value: this.value, inputId: this.inputId });

    this.host.dispatchEvent(
      new CustomEvent('change', {
        detail: { checked: this.singleChecked },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    this.resolveBaseId();

    // GROUP RENDER
    if (this.checkboxGroup || this.customCheckboxGroup) {
      const wrapperClass = this.customCheckboxGroup ? 'custom-control custom-checkbox' : 'form-check';
      const inputClass = this.customCheckboxGroup ? 'custom-control-input' : 'form-check-input';
      const labelClass = this.customCheckboxGroup ? 'custom-control-label' : 'form-check-label';

      const invalid = this.validation && this.required && this.checkedValues.length === 0;
      const showValidation = invalid && !!this.validationMsg;

      return (
        <div class={`check-box ${this.noPadding ? '' : ''}`}>
          {/* Best practice: fieldset/legend for checkbox group labeling */}
          <fieldset
            class={`checkbox-group ${invalid ? 'was-validated' : ''}`}
            aria-describedby={showValidation ? this.validationId : undefined}
            aria-invalid={invalid ? 'true' : undefined}
          >
            {/* legend is the programmatic group label */}
            <legend id={this.groupLegendId} class={`group-title ${this.groupTitleSize}`}>
              {this.groupTitle}
              {this.required ? <span class="required" aria-hidden="true">*</span> : ''}
            </legend>

            <div class={`form-group ${this.inline ? 'form-inline' : ''} no-pad`}>
              {this.parsedOptions.map((option, idx) => {
                const id = this.optionId(option, idx);
                const value = String(option?.value ?? '');
                const disabled = !!option?.disabled;

                return (
                  <div class={wrapperClass}>
                    <input
                      class={`${inputClass} ${this.size}`}
                      type="checkbox"
                      name={this.name}
                      id={id}
                      value={value}
                      checked={this.checkedValues.includes(value)}
                      disabled={disabled}
                      required={this.required}
                      aria-describedby={showValidation ? this.validationId : undefined}
                      aria-invalid={invalid ? 'true' : undefined}
                      onChange={e => this.handleGroupChange(e, value)}
                    />
                    <label class={`${labelClass} ${this.size}`} htmlFor={id}>
                      {option?.labelTxt}
                    </label>
                  </div>
                );
              })}
            </div>

            {showValidation ? (
              <div id={this.validationId} class="invalid-feedback form-text" aria-live="polite">
                {this.validationMsg}
              </div>
            ) : null}
          </fieldset>
        </div>
      );
    }

    // SINGLE RENDER
    const singleWrapperClass = this.customCheckbox ? 'custom-control custom-checkbox' : 'form-check';
    const singleInputClass = this.customCheckbox ? 'custom-control-input' : 'form-check-input';
    const singleLabelClass = this.customCheckbox ? 'custom-control-label' : 'form-check-label';

    const invalid = this.validation && this.required && !this.singleChecked;
    const showValidation = invalid && !!this.validationMsg;

    // Ensure we always have a usable id for label wiring
    const id = (this.inputId || '').trim() || `${this.ids}-single`;

    return (
      <div class={`form-group check-box no-pad ${invalid ? 'was-validated' : ''}`}>
        <div class={singleWrapperClass}>
          <input
            class={`${singleInputClass} ${this.size}`}
            id={id}
            type="checkbox"
            name={this.name}
            value={this.value}
            checked={this.singleChecked}
            disabled={this.disabled}
            required={this.required}
            aria-describedby={showValidation ? this.validationId : undefined}
            aria-invalid={invalid ? 'true' : undefined}
            onChange={e => this.handleSingleChange(e)}
          />
          <label class={`${singleLabelClass} ${this.size}`} htmlFor={id}>
            {this.labelTxt}
            {this.required ? <span class="required" aria-hidden="true">*</span> : ''}
          </label>

          {showValidation ? (
            <div id={this.validationId} class="invalid-feedback form-text" aria-live="polite">
              {this.validationMsg}
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
