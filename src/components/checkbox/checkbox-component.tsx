import { Component, Prop, h, State, Event, EventEmitter, Element, Watch } from '@stencil/core';

@Component({
  tag: 'checkbox-component',
  styleUrls: ['./checkbox.scss', '../form-styles.scss', '../custom-form-inputs.scss'],
  shadow: false,
})
export class CheckboxComponent {
  @Element() host!: HTMLElement;

  @Prop() checkbox = false;
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
  @Prop() checked: boolean = false; // @Prop({ mutable: true, reflect: true }) checked = false; // Only if you need mutable prop
  @Prop() disabled: boolean = false;
  @Prop() validation = false;
  @Prop() validationMsg = '';
  @Prop() value = '';

  @State() parsedOptions: Array<any> = [];
  @State() checkedValues: string[] = [];
  @State() singleChecked = false;

  @Event() groupChange: EventEmitter<string[]>;

  @Event() toggle: EventEmitter<{ checked: boolean; value: string; inputId: string }>;

  @Watch('checked')
  onCheckedPropChange(next: boolean) {
    // keep internal state in sync when parent updates prop
    this.singleChecked = !!next;
  }

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

    // Initialize single from prop so it renders correctly on first paint
    this.singleChecked = !!this.checked;

    this.checkedValues = this.parsedOptions.filter(opt => opt.checked).map(opt => opt.value);
  }

  // @Watch('checked')
  // syncSingleFromProp(newVal: boolean) {
  //   this.singleChecked = !!newVal;
  // }

  private handleGroupChange(event: Event, value: string) {
    const target = event.target as HTMLInputElement;
    let updated = [...this.checkedValues];

    if (target.checked) {
      if (!updated.includes(value)) {
        updated.push(value);
      }
    } else {
      updated = updated.filter(v => v !== value);
    }

    this.checkedValues = updated;
    this.groupChange.emit(this.checkedValues);
  }

  private handleSingleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.singleChecked = target.checked;
   // this.checked = target.checked; // keep prop+state in sync for re-renders

    // 🔊 Emit an event parents can listen to (your dropdown uses onToggle)
    this.toggle.emit({ checked: this.singleChecked, value: this.value, inputId: this.inputId });

    // (Optional) also bubble a generic change for consumers who rely on it
    this.host.dispatchEvent(new CustomEvent('change', { detail: { checked: this.singleChecked }, bubbles: true, composed: true }));
  }

  render() {
    // GROUP RENDER
    if (this.checkboxGroup || this.customCheckboxGroup) {
      const wrapperClass = this.customCheckboxGroup ? 'custom-control custom-checkbox' : 'form-check';
      const inputClass = this.customCheckboxGroup ? 'custom-control-input' : 'form-check-input';
      const labelClass = this.customCheckboxGroup ? 'custom-control-label' : 'form-check-label';

      const showValidation = this.validation && this.required && this.checkedValues.length === 0;

      return (
        <div class={`checkbox-group ${showValidation ? 'was-validated' : ''}`}>
          <div class={`group-title ${this.groupTitleSize}`}>
            {this.groupTitle}
            {this.required ? <span class="required">*</span> : ''}
          </div>
          <div class={`form-group ${this.inline ? 'form-inline' : ''} no-pad`}>
            {this.parsedOptions.map(option => (
              <div class={wrapperClass}>
                <input
                  class={`${inputClass} ${this.size}`}
                  type="checkbox"
                  name={this.name}
                  id={option.inputId}
                  value={option.value}
                  checked={this.checkedValues.includes(option.value)}
                  disabled={option.disabled}
                  required={this.required}
                  aria-checked={this.checkedValues.includes(option.value) ? 'true' : 'false'}
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
            <div class="invalid-feedback form-text" style={{ display: showValidation ? 'block' : '' }}>
              {this.validationMsg}
            </div>
          ) : null}
        </div>
      );
    }

    // SINGLE RENDER
    const singleWrapperClass = this.customCheckbox ? 'custom-control custom-checkbox' : 'form-check';
    const singleInputClass = this.customCheckbox ? 'custom-control-input' : 'form-check-input';
    const singleLabelClass = this.customCheckbox ? 'custom-control-label' : 'form-check-label';

    const showSingleValidation = this.validation && this.required && !this.singleChecked;

    return (
      <div class={`form-group check-box no-pad ${showSingleValidation ? 'was-validated' : ''}`}>
        <div class={singleWrapperClass}>
          <input
            class={`${singleInputClass} ${this.size}`}
            id={this.inputId}
            type="checkbox"
            name={this.name}
            value={this.value}
            // ✅ CRITICAL: bind "checked" so parent-controlled state reflects in UI
            checked={this.singleChecked}
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
          {showSingleValidation && this.validationMsg ? <div class="invalid-feedback form-text">{this.validationMsg}</div> : null}
        </div>
      </div>
    );
  }
}
