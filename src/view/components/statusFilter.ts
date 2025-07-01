export interface StatusFilterProps {
    statuses: string[];
    activeStatus: string;
    onStatusChange?: (status: string) => void;
    label?: string;
}

export const StatusFilter = (statuses: string[], activeStatus: string, label: string = 'Status'): string => {
    return `
        <div class="status-filter">
            <label class="status-filter__label">${label}</label>
            <select class="status-filter__select" data-filter="status">
                ${statuses.map(status => `
                    <option value="${status}" ${status === activeStatus ? 'selected' : ''}>${status}</option>
                `).join('')}
            </select>
        </div>
    `;
}

export const StatusFilterInteractive = ({ statuses, activeStatus, onStatusChange, label = 'Status' }: StatusFilterProps): HTMLElement => {
    const container = document.createElement('div');
    container.className = 'status-filter';
    
    const labelElement = document.createElement('label');
    labelElement.className = 'status-filter__label';
    labelElement.textContent = label;
    
    const select = document.createElement('select');
    select.className = 'status-filter__select';
    select.dataset.filter = 'status';
    
    statuses.forEach(status => {
        const option = document.createElement('option');
        option.value = status;
        option.textContent = status;
        option.selected = status === activeStatus;
        select.appendChild(option);
    });
    
    // Add change event listener
    select.addEventListener('change', () => {
        if (onStatusChange) {
            onStatusChange(select.value);
        }
    });
    
    container.appendChild(labelElement);
    container.appendChild(select);
    
    return container;
}
