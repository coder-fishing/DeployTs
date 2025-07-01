import { caretDown } from "~/assets/icon";

export interface DropdownOption {
  value: string;
  label: string;
}

export interface DropdownProps {
  id: string;
  label?: string;
  value: string;
  options: DropdownOption[];
  placeholder?: string;
}

export const Dropdown = ({ id, label: _label, value, options, placeholder = "Select..." }: DropdownProps): string => {
  return `
    <div class="dropdown" id="${id}">
      <div class="dropdown-group">
        <div class="dropbtn" id="${id}Button" onclick="
          const content = document.getElementById('${id}Content');
          content.style.display = content.style.display === 'none' ? 'block' : 'none';
          event.stopPropagation();
          return false;
        ">${value || placeholder}</div>
        <img src="${caretDown}" alt="caret-down" class="caret-down"/>
      </div>
      <div class="dropdown-content" id="${id}Content">
        ${options.map(option => `
          <div data-value="${option.value}">${option.label}</div>
        `).join('')}
      </div>
    </div>
  `;
};
