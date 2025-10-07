import { Component, Prop, h, State, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'radio-input-component',
  // styleUrls: ['../checkbox/checkbox.scss', './radio-input.scss', '../form-styles.scss'],
  shadow: false,
})
export class RadioComponent {
  @Prop() radio = false;
  @Prop() radioGroup = false;
  @Prop() customRadio = false;
  @Prop() customRadioGroup = false;

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

  @State() parsedOptions: Array<any> = [];
  @State() selectedValue = '';
  @State() singleChecked = false;

  @Event() groupChange: EventEmitter<string>;

  componentWillLoad() {
    if (Array.isArray(this.groupOptions)) {
      this.parsedOptions = this.groupOptions;
    } else if (typeof this.groupOptions === 'string') {
      try {
        this.parsedOptions = JSON.parse(this.groupOptions);
      } catch (e) {
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

  render() {
    // GROUP RENDER
    if (this.radioGroup || this.customRadioGroup) {
      const wrapperClass = this.customRadioGroup ? 'custom-control custom-radio' : 'form-check';
      const inputClass = this.customRadioGroup ? 'custom-control-input' : 'form-check-input';
      const labelClass = this.customRadioGroup ? 'custom-control-label' : 'form-check-label';

      const showValidation = this.validation && this.required && !this.selectedValue;

      return (
        <div class={`radio-group ${showValidation ? 'was-validated' : ''}`}>
          <div class={`group-title ${this.groupTitleSize}`}>
            {this.groupTitle}
            {this.required ? <span class="required">*</span> : ''}
          </div>
          <div class={`form-group ${this.inline ? 'form-inline' : ''}`}>
            {this.parsedOptions.map(option => (
              <div class={wrapperClass}>
                <input
                  class={inputClass}
                  type="radio"
                  name={this.name}
                  id={option.inputId}
                  value={option.value}
                  checked={option.checked}
                  disabled={option.disabled}
                  required={this.required}
                  aria-checked={option.checked ? 'true' : 'false'}
                  aria-disabled={option.disabled ? 'true' : 'false'}
                  onChange={e => this.handleGroupChange(e, option.value)}
                />
                <label class={`${labelClass} ${this.size}`} htmlFor={option.inputId}>
                  {option.labelTxt}
                </label>
              </div>
            ))}
          </div>
          {showValidation && this.validationMsg ? (
            <div class="invalid-feedback form-text" style={{ display: showValidation ? 'block' : '' }}>{this.validationMsg}</div>
          ) : null}
        </div>
      );
    }

    // SINGLE RENDER
    const singleWrapperClass = this.customRadio ? 'custom-control custom-radio' : 'form-check';
    const singleInputClass = this.customRadio ? 'custom-control-input' : 'form-check-input';
    const singleLabelClass = this.customRadio ? 'custom-control-label' : 'form-check-label';

    const showSingleValidation = this.validation && this.required && !this.singleChecked;

    return (
      <div class={`form-group ${showSingleValidation ? 'was-validated' : ''}`}>
        <div class={singleWrapperClass}>
          <input
            class={singleInputClass}
            id={this.inputId}
            type="radio"
            name={this.name}
            value={this.value}
            disabled={this.disabled}
            required={this.required}
            aria-checked={this.singleChecked ? 'true' : 'false'}
            aria-disabled={this.disabled ? 'true' : 'false'}
            onChange={e => this.handleSingleChange(e)}
          />
          <label class={`${singleLabelClass} ${this.size}`} htmlFor={this.inputId}>
            {this.labelTxt}
            {this.required ? <span class="required">*</span> : ''}
          </label>
          {showSingleValidation && this.validationMsg ? (
            <div class="invalid-feedback form-text">{this.validationMsg}</div>
          ) : null}
        </div>
      </div>
    );
  }
}
