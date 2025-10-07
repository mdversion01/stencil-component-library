// src/components/dropdown/dropdown-types.ts
export interface DropdownItem {
  name: string;
  content?: string;
  checked?: boolean;
  disabled?: boolean;
  isDivider?: boolean;
  submenu?: DropdownItem[];
  inputId?: string;
  value?: string;
  path?: string;
  customListType?: 'checkboxes' | 'customCheckboxes' | 'toggleSwitches';
  submenuListType?: 'checkboxes' | 'customCheckboxes' | 'toggleSwitches';
}
