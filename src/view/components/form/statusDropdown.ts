import { Dropdown } from "./dropdown";

export interface StatusDropdownProps {
  value: string;
  className?: string;
}

// Simple status badge component
const StatusBadge = ({ status, className = "" }: { status: string; className?: string }): string => {
  const statusClass = status.toLowerCase().replace(/\s+/g, '-');
  return `<span class="status-badge status-badge--${statusClass} ${className}">${status}</span>`;
};

export const StatusDropdown = ({ value, className }: StatusDropdownProps): string => {
  const status = value || 'Draft';
  
  return `
    <div class="form-section"> 
      <div class="form-section__title">
        <span class="form-section__title-status">Status</span> 
        ${StatusBadge({ status, className })}
      </div> 
      <div class="form-section__field">
        <p class="form-section__field--name">Product Status</p>             
      </div> 
      ${Dropdown({
        id: "dropdown",
        value: status,
        options: [
          { value: "Draft", label: "Draft" },
          { value: "Published", label: "Published" },
          { value: "Out of Stock", label: "Out of Stock" },
          { value: "Low Stock", label: "Low Stock" }
        ]
      })}
    </div>
  `;
};
