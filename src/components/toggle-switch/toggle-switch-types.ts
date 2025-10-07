// src/components/toggle-switch/toggle-switch-types.ts

export interface ToggleItem {
  id: string;
  label: string;
  checked?: boolean;
  customSwitch?: boolean;
  disabled?: boolean;
  required?: boolean;
  value?: string;
  toggleTxt?: boolean;
  validation?: boolean;
  validationMessage?: string;
  size?: string;
  newToggleTxt?: {
    on: string;
    off: string;
  };
}
