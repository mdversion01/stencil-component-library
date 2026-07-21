// src/components/checkbox-component/checkbox-component.tsx
import { Component, Prop, h, State, Event, EventEmitter, Element, Watch } from '@stencil/core';

type CheckboxOption = {
  inputId?: string;
  value?: string;
  labelTxt?: string;
  checked?: boolean;
  disabled?: boolean;
};

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

  @Prop() groupOptions: CheckboxOption[] | string = [];
  @Prop() groupTitle = '';
  @Prop() groupTitleSize = '';
  @Prop() inline = false;
  @Prop() inputId = '';
  @Prop() name = '';
  @Prop() noPadding = false;
  @Prop() labelTxt = '';
  @Prop() required = false;
  @Prop() size = '';
  @Prop() checked = false;
  @Prop() disabled = false;
  @Prop() validation = false;
  @Prop() validationMsg = '';
  @Prop() value = '';

  @State() parsedOptions: CheckboxOption[] = [];
  @State() checkedValues: string[] = [];
  @State() singleChecked = false;

  @Event() groupChange: EventEmitter<string[]>;
  @Event() toggle: EventEmitter<{ checked: boolean; value: string; inputId: string }>;

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

  private get groupTitleId(): string {
    return `${this.ids}-title`;
  }

  private get validationId(): string {
    return `${this.ids}-validation`;
  }

  private normalizeOptions(input: CheckboxOption[] | string): CheckboxOption[] {
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

  private optionId(option: CheckboxOption, idx: number): string {
    const raw = String(option?.inputId || '').trim();
    if (raw) return raw;
    return `${this.ids}-opt-${idx}`;
  }

  private isGroupMode(): boolean {
    return this.checkboxGroup || this.customCheckboxGroup;
  }

  private isGroupInvalid(): boolean {
    return !this.disabled && this.validation && this.required && this.checkedValues.length === 0;
  }

  private showGroupValidation(): boolean {
    return this.isGroupInvalid() && !!this.validationMsg;
  }

  private isSingleInvalid(): boolean {
    return !this.disabled && this.validation && this.required && !this.singleChecked;
  }

  private showSingleValidation(): boolean {
    return this.isSingleInvalid() && !!this.validationMsg;
  }

  private isOptionDisabled(option: CheckboxOption): boolean {
    return !!(this.disabled || option?.disabled);
  }

  @Watch('checked')
  onCheckedPropChange(next: boolean) {
    this.singleChecked = !!next;
  }

  @Watch('groupOptions')
  onGroupOptionsChange(next: CheckboxOption[] | string) {
    this.parsedOptions = this.normalizeOptions(next);
    this.checkedValues = this.parsedOptions.filter(opt => !!opt?.checked).map(opt => String(opt.value ?? ''));
  }

  componentWillLoad() {
    this.parsedOptions = this.normalizeOptions(this.groupOptions);
    this.singleChecked = !!this.checked;
    this.checkedValues = this.parsedOptions.filter(opt => !!opt?.checked).map(opt => String(opt.value ?? ''));
  }

  private handleGroupChange(event: Event, value: string) {
    if (this.disabled) return;

    const target = event.target as HTMLInputElement;
    if (target.disabled) return;

    let updated = [...this.checkedValues];

    if (target.checked) {
      if (!updated.includes(value)) updated.push(value);
    } else {
      updated = updated.filter(v => v !== value);
    }

    this.checkedValues = updated;

    this.parsedOptions = this.parsedOptions.map(opt => ({
      ...opt,
      checked: updated.includes(String(opt?.value ?? '')),
    }));

    this.groupChange.emit(this.checkedValues);
  }

  private handleSingleChange(event: Event) {
    if (this.disabled) return;

    const target = event.target as HTMLInputElement;
    this.singleChecked = target.checked;

    this.toggle.emit({
      checked: this.singleChecked,
      value: this.value,
      inputId: this.inputId,
    });

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

    if (this.isGroupMode()) {
      const wrapperClass = this.customCheckboxGroup ? 'custom-control custom-checkbox' : 'form-check';
      const inputClass = this.customCheckboxGroup ? 'custom-control-input' : 'form-check-input';
      const labelClass = this.customCheckboxGroup ? 'custom-control-label' : 'form-check-label';

      const invalid = this.isGroupInvalid();
      const showValidation = this.showGroupValidation();
      const hasGroupTitle = !!String(this.groupTitle || '').trim();

      return (
        <div class={`check-box ${this.noPadding ? '' : ''}`}>
          <div class={`checkbox-group ${invalid ? 'was-validated' : ''}`}>
            <div
              role="group"
              aria-labelledby={hasGroupTitle ? this.groupTitleId : undefined}
              aria-required={!this.disabled && this.required ? 'true' : undefined}
              aria-invalid={invalid ? 'true' : undefined}
              aria-describedby={showValidation ? this.validationId : undefined}
            >
              {hasGroupTitle ? (
                <div id={this.groupTitleId} class={`group-title ${this.groupTitleSize}`}>
                  {this.groupTitle}
                  {!this.disabled && this.required ? <span class="required" aria-hidden="true">*</span> : ''}
                </div>
              ) : null}

              <div class={`form-group ${this.inline ? 'form-inline' : ''} no-pad`}>
                {this.parsedOptions.map((option, idx) => {
                  const id = this.optionId(option, idx);
                  const optionValue = String(option?.value ?? '');
                  const optionDisabled = this.isOptionDisabled(option);

                  return (
                    <div class={wrapperClass}>
                      <input
                        class={`${inputClass} ${this.size}`}
                        type="checkbox"
                        name={this.name}
                        id={id}
                        value={optionValue}
                        checked={this.checkedValues.includes(optionValue)}
                        disabled={optionDisabled}
                        required={!this.disabled && this.required}
                        aria-describedby={showValidation ? this.validationId : undefined}
                        aria-invalid={invalid ? 'true' : undefined}
                        onChange={e => this.handleGroupChange(e, optionValue)}
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
            </div>
          </div>
        </div>
      );
    }

    const singleWrapperClass = this.customCheckbox ? 'custom-control custom-checkbox' : 'form-check';
    const singleInputClass = this.customCheckbox ? 'custom-control-input' : 'form-check-input';
    const singleLabelClass = this.customCheckbox ? 'custom-control-label' : 'form-check-label';

    const invalid = this.isSingleInvalid();
    const showValidation = this.showSingleValidation();
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
            required={!this.disabled && this.required}
            aria-describedby={showValidation ? this.validationId : undefined}
            aria-invalid={invalid ? 'true' : undefined}
            onChange={e => this.handleSingleChange(e)}
          />
          <label class={`${singleLabelClass} ${this.size}`} htmlFor={id}>
            {this.labelTxt}
            {!this.disabled && this.required ? <span class="required" aria-hidden="true">*</span> : ''}
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
