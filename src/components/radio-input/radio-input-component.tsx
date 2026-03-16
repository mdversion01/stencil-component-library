// src/components/radio-input/radio-input-component.tsx
import { Component, Prop, h, State, Event, EventEmitter } from '@stencil/core';

type RadioOption = {
  inputId: string;
  value: string;
  labelTxt: string;
  checked?: boolean;
  disabled?: boolean;
};

@Component({
  tag: 'radio-input-component',
  styleUrls: ['radio-input.scss', '../form-styles.scss'],
  shadow: false,
})
export class RadioComponent {
  @Prop() bsRadio = false;
  @Prop() bsRadioGroup = false;
  @Prop() basicRadio = false;
  @Prop() basicRadioGroup = false;

  @Prop() groupOptions: any = []; // JSON string or array
  @Prop() groupTitle = '';
  @Prop() groupTitleSize = '';
  @Prop() inline = false;
  @Prop() inputId = '';
  @Prop() name = '';
  @Prop() labelTxt = '';
  @Prop() required = false;
  @Prop() size = '';
  @Prop() disabled = false;
  @Prop() validation = false;
  @Prop() validationMsg = '';
  @Prop() value = '';

  /** Optional: external description element id (help text) */
  @Prop() ariaDescribedby?: string;

  @State() parsedOptions: Array<RadioOption> = [];
  @State() selectedValue = '';
  @State() singleChecked = false;

  @Event() groupChange: EventEmitter<string>;

  private safeId(prefix: string) {
    // stable IDs for SSR/testing: prefer name/inputId; fall back to prefix.
    const base = (this.name || this.inputId || '').trim();
    return base ? `${prefix}-${base}` : `${prefix}-radios`;
  }

  componentWillLoad() {
    if (Array.isArray(this.groupOptions)) {
      this.parsedOptions = this.groupOptions;
    } else if (typeof this.groupOptions === 'string') {
      try {
        this.parsedOptions = JSON.parse(this.groupOptions);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Invalid groupOptions JSON:', e);
        this.parsedOptions = [];
      }
    }

    const preSelected = this.parsedOptions.find(opt => opt.checked);
    if (preSelected) {
      this.selectedValue = preSelected.value;
    }
  }

  private handleGroupChange(event: Event, value: string) {
    const target = event.target as HTMLInputElement;

    if (target.checked) {
      this.selectedValue = value;

      const updated = this.parsedOptions.map(opt => ({
        ...opt,
        checked: opt.value === value,
      }));
      this.parsedOptions = updated;

      this.groupChange.emit(this.selectedValue);
    }
  }

  private handleSingleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.singleChecked = target.checked;
  }

  private joinIds(...ids: Array<string | undefined>) {
    const cleaned = ids
      .map(s => (s || '').trim())
      .filter(Boolean);
    return cleaned.length ? cleaned.join(' ') : undefined;
  }

  render() {
    const isGroup = this.bsRadioGroup || this.basicRadioGroup;

    // GROUP RENDER
    if (isGroup) {
      const wrapperClass = this.basicRadioGroup ? 'basic-control basic-radio' : 'form-check';
      const inputClass = this.basicRadioGroup ? 'basic-control-input' : 'form-check-input';
      const labelClass = this.basicRadioGroup ? 'basic-control-label' : 'form-check-label';

      const showValidation = this.validation && this.required && !this.selectedValue;

      const titleId = this.safeId('radio-group-title');
      const errorId = this.safeId('radio-group-error');

      const describedBy = this.joinIds(this.ariaDescribedby, showValidation && this.validationMsg ? errorId : undefined);

      return (
        <div class={`radios radio-group ${showValidation ? 'was-validated' : ''}`}>
          {/* Radiogroup wrapper for AT */}
          <div
            role="radiogroup"
            aria-labelledby={this.groupTitle ? titleId : undefined}
            aria-required={this.required ? 'true' : undefined}
            aria-invalid={showValidation ? 'true' : undefined}
            aria-describedby={describedBy}
          >
            {this.groupTitle ? (
              <div id={titleId} class={`group-title ${this.groupTitleSize}`}>
                {this.groupTitle}
                {this.required ? <span class="required">*</span> : ''}
              </div>
            ) : null}

            <div class={`form-group ${this.inline ? 'form-inline' : ''}`}>
              {this.parsedOptions.map(option => (
                <div class={wrapperClass}>
                  <input
                    class={inputClass}
                    type="radio"
                    name={this.name}
                    id={option.inputId}
                    value={option.value}
                    checked={!!option.checked}
                    disabled={!!option.disabled}
                    required={this.required}
                    // Native radios already expose checked/disabled; keep ARIA clean.
                    aria-invalid={showValidation ? 'true' : undefined}
                    aria-describedby={describedBy}
                    onChange={e => this.handleGroupChange(e, option.value)}
                  />
                  <label class={`${labelClass} ${this.size}`} htmlFor={option.inputId}>
                    {option.labelTxt}
                  </label>
                </div>
              ))}
            </div>

            {showValidation && this.validationMsg ? (
              <div
                id={errorId}
                class="invalid-feedback form-text"
                role="alert"
                aria-live="polite"
                style={{ display: showValidation ? 'block' : '' }}
              >
                {this.validationMsg}
              </div>
            ) : null}
          </div>
        </div>
      );
    }

    // SINGLE RENDER
    const singleWrapperClass = this.basicRadio ? 'basic-control basic-radio' : 'form-check';
    const singleInputClass = this.basicRadio ? 'basic-control-input' : 'form-check-input';
    const singleLabelClass = this.basicRadio ? 'basic-control-label' : 'form-check-label';

    const showSingleValidation = this.validation && this.required && !this.singleChecked;

    const labelId = this.safeId('radio-single-label');
    const errorId = this.safeId('radio-single-error');
    const describedBy = this.joinIds(this.ariaDescribedby, showSingleValidation && this.validationMsg ? errorId : undefined);

    return (
      <div class={`radios form-group ${showSingleValidation ? 'was-validated' : ''}`}>
        <div class={singleWrapperClass}>
          <input
            class={singleInputClass}
            id={this.inputId}
            type="radio"
            name={this.name}
            value={this.value}
            disabled={this.disabled}
            required={this.required}
            aria-labelledby={this.labelTxt ? labelId : undefined}
            aria-describedby={describedBy}
            aria-invalid={showSingleValidation ? 'true' : undefined}
            onChange={e => this.handleSingleChange(e)}
          />
          <label id={labelId} class={`${singleLabelClass} ${this.size}`} htmlFor={this.inputId}>
            {this.labelTxt}
            {this.required ? <span class="required">*</span> : ''}
          </label>
        </div>

        {showSingleValidation && this.validationMsg ? (
          <div
            id={errorId}
            class="invalid-feedback form-text"
            role="alert"
            aria-live="polite"
            style={{ display: showSingleValidation ? 'block' : '' }}
          >
            {this.validationMsg}
          </div>
        ) : null}
      </div>
    );
  }
}
