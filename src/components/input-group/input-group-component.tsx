// File: src/components/input-group/input-group-component.tsx
import { Component, h, Prop, Element, State, Event, EventEmitter, Watch, Fragment } from '@stencil/core';

type AffixSide = 'prepend' | 'append';
type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  tag: 'input-group-component',
  styleUrls: ['../layout-styles.scss', '../form-styles.scss', '../input-field/input-field-styles.scss', './input-group-styles.scss'],
  shadow: false,
})
export class InputGroupComponent {
  @Element() el!: HTMLElement;

  @Prop({ attribute: 'has-append' }) appendField: boolean = false;
  @Prop() appendId: string = '';
  @Prop() appendButtonId: string = '';

  @Prop() disabled: boolean = false;

  @Prop({ mutable: true }) formId: string = '';
  @Prop({ mutable: true }) formLayout: '' | 'horizontal' | 'inline' = '';

  @Prop() icon: string = '';
  @Prop() prependIcon?: string;
  @Prop() appendIcon?: string;

  @Prop() inputId: string = '';
  @Prop() inputSize: string = '';

  @Prop() label: string = '';
  @Prop() labelSize: 'base' | 'xs' | 'sm' | 'lg' = 'sm';
  @Prop() labelAlign: '' | 'right' = '';
  @Prop() labelHidden: boolean = false;
  @Prop() placeholder: string = '';
  @Prop() readOnly: boolean = false;

  @Prop({ attribute: 'has-prepend' }) prependField: boolean = false;
  @Prop() prependId: string = '';
  @Prop() prependButtonId: string = '';

  @Prop() required: boolean = false;
  @Prop() size: '' | 'sm' | 'lg' = '';
  @Prop() type: string = 'text';

  @Prop({ mutable: true }) validation: boolean = false;
  @Prop() validationMessage: string = '';

  @Prop({ mutable: true }) value: string = '';

  @Prop() labelCol: number = 2;
  @Prop() inputCol: number = 10;

  @Prop() labelCols: string = '';
  @Prop() inputCols: string = '';

  @Prop() prependText: string = '';
  @Prop() appendText: string = '';

  @Prop() prependButton: boolean = false;
  @Prop() appendButton: boolean = false;

  @Prop() prependButtonType: ButtonType = 'button';
  @Prop() appendButtonType: ButtonType = 'button';

  @Prop() prependButtonVariant: string = 'secondary';
  @Prop() appendButtonVariant: string = 'secondary';

  @Prop() prependAriaLabel: string = '';
  @Prop() appendAriaLabel: string = '';

  @State() _computedFormId: string = '';
  @State() private valueState: string = '';

  private inputEl?: HTMLInputElement;

  private uid = `igc-${Math.random().toString(16).slice(2)}-${Date.now().toString(16)}`;
  private ids = {
    input: '',
    label: '',
    desc: '',
    validation: '',
  };

  @Event() valueChange: EventEmitter<{ value: string }>;
  @Event() prependClick: EventEmitter<{ originalEvent: MouseEvent }>;
  @Event() appendClick: EventEmitter<{ originalEvent: MouseEvent }>;

  connectedCallback() {
    const formComponent = this.el.closest('form-component') as any;

    const fcFormId = formComponent?.formId;
    const fcLayout = formComponent?.formLayout;

    if (!this.formId && typeof fcFormId === 'string') this.formId = fcFormId;

    if (!this.formLayout && typeof fcLayout === 'string') {
      const allowed = ['', 'horizontal', 'inline'] as const;
      if ((allowed as readonly string[]).includes(fcLayout)) {
        this.formLayout = fcLayout as '' | 'horizontal' | 'inline';
      }
    }

    this._computedFormId = this.formId || '';
    this.valueState = this.value ?? '';
    this.computeIds();
  }

  componentDidLoad() {
    this.applyFormAttribute();
  }

  @Watch('formId')
  onFormIdChange(newVal: string) {
    this._computedFormId = newVal || '';
    this.applyFormAttribute();
  }

  @Watch('value')
  onValuePropChange(newVal: string) {
    this.valueState = newVal ?? '';
    if (this.inputEl && this.inputEl.value !== this.valueState) {
      this.inputEl.value = this.valueState;
    }
  }

  @Watch('inputId')
  onInputIdChange() {
    this.computeIds();
  }

  @Watch('label')
  onLabelChange() {
    this.computeIds();
  }

  private applyFormAttribute() {
    if (!this.inputEl) return;
    if (this._computedFormId) this.inputEl.setAttribute('form', this._computedFormId);
    else this.inputEl.removeAttribute('form');
  }

  private meetsTypingThreshold() {
    return (this.valueState || '').trim().length >= 2;
  }

  private showAsRequired() {
    return this.required && !this.meetsTypingThreshold();
  }

  private isInvalidNow() {
    return this.validation && !this.meetsTypingThreshold();
  }

  private sanitizeInput(value: string): string {
    if (typeof value !== 'string') return '';
    let v = value.replace(/<[^>]*>/g, '');
    v = v.replace(/[\u0000-\u001F\u007F]/g, '');
    v = v.replace(/\s+/g, ' ').trim();
    const MAX_LEN = 512;
    if (v.length > MAX_LEN) v = v.slice(0, MAX_LEN);
    return v;
  }

  private handleInput = (ev: Event) => {
    const target = ev.target as HTMLInputElement;

    if (this._computedFormId) target.setAttribute('form', this._computedFormId);
    else target.removeAttribute('form');

    const sanitized = this.sanitizeInput(target.value);
    if (sanitized !== target.value) target.value = sanitized;

    this.value = sanitized;
    this.valueState = sanitized;

    this.valueChange.emit({ value: this.value });
    this.el.dispatchEvent(new CustomEvent('change', { detail: { value: this.value }, bubbles: true }));
  };

  private handleAffixClick = (side: AffixSide, ev: MouseEvent) => {
    ev.stopPropagation();

    if (side === 'prepend') this.prependClick.emit({ originalEvent: ev });
    else this.appendClick.emit({ originalEvent: ev });
  };

  private camelCase(str: string): string {
    if (!str) return '';
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (w, i) => (i === 0 ? w.toLowerCase() : w.toUpperCase())).replace(/\s+/g, '');
  }

  private computeIds() {
    const base = (this.inputId && String(this.inputId).trim()) || (this.label && this.camelCase(this.label)) || this.uid;
    const safeBase = String(base)
      .replace(/\s+/g, '')
      .replace(/[^A-Za-z0-9\-_:.]/g, '');
    this.ids.input = safeBase;
    this.ids.label = `${safeBase}__label`;
    this.ids.desc = `${safeBase}__desc`;
    this.ids.validation = `${safeBase}__validation`;
  }

  private isHorizontal() {
    return this.formLayout === 'horizontal';
  }

  private isInline() {
    return this.formLayout === 'inline';
  }

  private parseColsSpec(spec?: string): string {
    if (!spec) return '';
    const tokens = spec.trim().split(/\s+/);
    const out: string[] = [];

    for (const t of tokens) {
      if (!t) continue;

      if (/^col(-\w+)?(-\d+)?$/.test(t)) {
        out.push(t);
        continue;
      }
      if (/^\d{1,2}$/.test(t)) {
        const n = Math.max(1, Math.min(12, parseInt(t, 10)));
        out.push(`col-${n}`);
        continue;
      }
      const m = /^(xs|sm|md|lg|xl|xxl)-(\d{1,2})$/.exec(t);
      if (m) {
        const bp = m[1];
        const n = Math.max(1, Math.min(12, parseInt(m[2], 10)));
        out.push(bp === 'xs' ? `col-${n}` : `col-${bp}-${n}`);
        continue;
      }
      if (t === 'col') {
        out.push('col');
        continue;
      }
    }

    return Array.from(new Set(out)).join(' ');
  }

  private buildColClass(kind: 'label' | 'input'): string {
    const spec = (kind === 'label' ? this.labelCols : this.inputCols)?.trim();

    if (this.isHorizontal()) {
      if (spec) return this.parseColsSpec(spec);

      if (kind === 'input' && this.labelHidden) {
        return this.inputCols ? this.parseColsSpec(this.inputCols) : 'col-12';
      }

      const num = kind === 'label' ? this.labelCol : this.inputCol;
      if (Number.isFinite(num)) {
        const n = Math.max(0, Math.min(12, Number(num)));
        if (n === 0) return '';
        return `col-${n}`;
      }
      return '';
    }

    if (this.isInline()) return spec ? this.parseColsSpec(spec) : '';
    return '';
  }

  private getComputedCols() {
    const DEFAULT_LABEL = 2;
    const DEFAULT_INPUT = 10;

    if (this.isHorizontal() && this.labelHidden) return { label: 0, input: 12 };

    const lbl = Number(this.labelCol);
    const inp = Number(this.inputCol);
    const label = Number.isFinite(lbl) ? Math.max(1, Math.min(11, lbl)) : DEFAULT_LABEL;
    const input = Number.isFinite(inp) ? Math.max(1, Math.min(11, inp)) : DEFAULT_INPUT;

    if (this.isHorizontal() && !this.labelCols && !this.inputCols && label + input !== 12) {
      console.error(
        '[input-group-component] For formLayout="horizontal", labelCol + inputCol must equal 12. ' +
          `Received: ${this.labelCol} + ${this.inputCol} = ${Number(this.labelCol) + Number(this.inputCol)}. Falling back to 2/10.`,
      );
      return { label: DEFAULT_LABEL, input: DEFAULT_INPUT };
    }

    return { label, input };
  }

  private labelClasses(labelColClass?: string) {
    return [
      'form-control-label',
      this.readOnly || this.disabled ? '' : this.showAsRequired() ? 'required' : '',
      this.labelSize === 'xs' ? 'label-xs' : this.labelSize === 'sm' ? 'label-sm' : this.labelSize === 'lg' ? 'label-lg' : '',
      this.labelAlign === 'right' ? 'align-right' : '',
      this.labelHidden ? 'sr-only' : '',
      this.isHorizontal() ? `${labelColClass} no-padding col-form-label` : '',
      this.isInline() ? 'col-form-label' : '',
      this.readOnly || this.disabled ? '' : this.isInvalidNow() ? 'invalid' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private inputClasses() {
    return ['form-control', this.disabled ? 'disabled' : this.readOnly ? 'read-only' : this.isInvalidNow() ? 'is-invalid' : ''].filter(Boolean).join(' ');
  }

  private groupSizeClass() {
    return this.size === 'sm' ? 'input-group-sm' : this.size === 'lg' ? 'input-group-lg' : '';
  }

  private renderHelpText() {
    const labelText = (this.label || 'this field').trim();
    const typeText = (this.type || 'text').trim();
    const msg = `Enter ${labelText}. Type: ${typeText}.`;
    return (
      <div id={this.ids.desc} class="sr-only">
        {msg}
      </div>
    );
  }

  private renderInputLabel(labelColClass?: string) {
    const text = this.isHorizontal() || this.isInline() ? `${this.label}:` : this.label;

    return (
      <label id={this.ids.label} class={this.labelClasses(labelColClass)} htmlFor={this.ids.input || undefined}>
        <span class={this.readOnly || this.disabled ? '' : this.showAsRequired() ? 'required' : ''}>{text}</span>
        {this.readOnly || this.disabled ? null : this.required ? <span class="required">*</span> : null}
      </label>
    );
  }

  private getAffixIcon(side: AffixSide) {
    return side === 'prepend' ? this.prependIcon || this.icon : this.appendIcon || this.icon;
  }

  private getAffixText(side: AffixSide) {
    return side === 'prepend' ? this.prependText : this.appendText;
  }

  private getAffixId(side: AffixSide) {
    return side === 'prepend' ? this.prependId : this.appendId;
  }

  private getAffixButtonId(side: AffixSide) {
    return side === 'prepend' ? this.prependButtonId : this.appendButtonId;
  }

  private getAffixButton(side: AffixSide) {
    return side === 'prepend' ? this.prependButton : this.appendButton;
  }

  private getAffixButtonType(side: AffixSide) {
    return side === 'prepend' ? this.prependButtonType : this.appendButtonType;
  }

  private getAffixButtonVariant(side: AffixSide) {
    return side === 'prepend' ? this.prependButtonVariant : this.appendButtonVariant;
  }

  private getAffixAriaLabel(side: AffixSide) {
    return side === 'prepend' ? this.prependAriaLabel : this.appendAriaLabel;
  }

  private getNativeButtonClass(variant: string) {
    const safe = (variant || 'secondary').trim();
    return `btn btn-${safe}`;
  }

  private renderAffix(side: AffixSide) {
    const icon = this.getAffixIcon(side);
    const text = this.getAffixText(side);
    const id = this.getAffixId(side) || undefined;
    const buttonId = this.getAffixButtonId(side) || undefined;
    const isButton = this.getAffixButton(side);
    const buttonType = this.getAffixButtonType(side);
    const buttonVariant = this.getAffixButtonVariant(side);
    const ariaLabel = this.getAffixAriaLabel(side);
    const invalidClass = this.isInvalidNow() ? 'is-invalid' : '';

    if (icon) {
      return (
        <span class={`input-group-text ${this.readOnly || this.disabled ? '' : invalidClass}`.trim()} id={id}>
          <i class={icon} aria-hidden="true" />
        </span>
      );
    }

    if (!text) {
      return null;
    }

    if (this.readOnly ? null : isButton) {
      return (
        <span class={side === 'prepend' ? 'prepend-btn' : 'append-btn'} id={id}>
          <button
            id={buttonId}
            type={buttonType}
            class={this.getNativeButtonClass(buttonVariant)}
            aria-label={ariaLabel || undefined}
            disabled={this.disabled}
            onClick={ev => this.handleAffixClick(side, ev)}
          >
            {text}
          </button>
        </span>
      );
    }

    return (
      <span class={`input-group-text ${this.readOnly || this.disabled ? '' : invalidClass}`.trim()} id={id}>
        {text}
      </span>
    );
  }

  private renderInputBlock(names: string) {
    const placeholder = (this.placeholder && this.placeholder.trim()) || this.label || 'Placeholder Text';

    const describedBy = [this.ids.desc, this.isInvalidNow() && this.validationMessage ? this.ids.validation : ''].filter(Boolean).join(' ');

    const sizeClass = this.groupSizeClass();

    return (
      <Fragment>
        {this.renderHelpText()}

        <div
          class={{
            'input-group': true,
            [sizeClass]: !!sizeClass,
            'is-invalid': !this.readOnly && !this.disabled && this.isInvalidNow(),
          }}
        >
          {this.prependField ? this.renderAffix('prepend') : null}

          <input
            ref={el => {
              this.inputEl = el as HTMLInputElement;
              this.applyFormAttribute();
            }}
            type={this.type || 'text'}
            class={this.inputClasses()}
            placeholder={placeholder}
            id={this.ids.input || undefined}
            name={names || undefined}
            value={this.valueState || ''}
            aria-labelledby={this.ids.label}
            aria-describedby={describedBy || undefined}
            aria-invalid={this.isInvalidNow() ? 'true' : undefined}
            aria-disabled={this.disabled ? 'true' : undefined}
            aria-readonly={this.readOnly ? 'true' : undefined}
            disabled={this.disabled}
            required={this.required}
            readOnly={this.readOnly}
            form={this._computedFormId || undefined}
            onInput={this.handleInput}
          />

          {this.appendField ? this.renderAffix('append') : null}
        </div>

        {this.readOnly || this.disabled ? null : this.renderValidation()}
      </Fragment>
    );
  }

  private renderValidation() {
    if (!this.isInvalidNow() || !this.validationMessage) return null;
    return (
      <div id={this.ids.validation} class="invalid-feedback" aria-live="polite" aria-atomic="true">
        {this.validationMessage}
      </div>
    );
  }

  render() {
    const names = this.camelCase(this.label).replace(/ /g, '');

    const outerClass = this.formLayout ? ` ${this.formLayout}` : '';
    const groupClasses = ['form-group'];

    if (this.isHorizontal()) groupClasses.push('row', 'horizontal');
    else if (this.isInline()) groupClasses.push('row', 'inline');

    this.getComputedCols();

    const labelColClass = this.isHorizontal() && !this.labelHidden ? this.buildColClass('label') : '';
    const inputColClass = this.isHorizontal() ? this.buildColClass('input') || undefined : this.isInline() ? this.buildColClass('input') || undefined : undefined;

    return (
      <div class={outerClass}>
        <div class={groupClasses.join(' ')}>
          {this.renderInputLabel(labelColClass)}

          {this.isHorizontal() ? <div class={inputColClass}>{this.renderInputBlock(names)}</div> : <div>{this.renderInputBlock(names)}</div>}
        </div>
      </div>
    );
  }
}
