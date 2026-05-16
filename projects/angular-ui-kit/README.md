# Angular UI Kit

Welcome to the Angular UI Kit! This project provides reusable Angular components to accelerate your development workflow.

## Version Compatibility

| Angular Version | Package Version  |
| --------------- | ---------------- |
| Angular 19      | v1.0.x           |
| Angular 21      | v2.0.x and above |

## Features

- Prebuilt UI components (Table, Breadcrumbs, Buttons, etc.)
- Angular Material integration
- Customizable themes
- Easy to use and extend

## Getting Started

To use this library in your Angular project, install it via npm:

```bash
npm install @devkitify/angular-ui-kit
```

Then, import the desired modules into your application:

```typescript
import { TableComponent, TableModel } from '@devkitify/angular-ui-kit';
```

## Folder Structure

- **Components**
    - [Autocomplete](#autocomplete) - Search with autocomplete suggestions
    - [Breadcrumbs](#breadcrumbs) - Navigation breadcrumb component
    - [Button](#button) - Customizable button component
    - [Checkbox](#checkbox) - Multi-select checkbox group
    - [Chip](#chip) - Chip/tag display component
    - [Datepicker](#datepicker) - Date selection component
    - [Dropdown](#dropdown) - Select dropdown with infinite scroll
    - [Dialog](#dialog) - Modal dialog component
    - [Radio Button](#radio-button) - Radio group selector
    - [Slide Toggle](#slide-toggle) - Toggle switch component
    - [Table](#table) - Advanced data table with sorting & pagination
    - [Textarea](#textarea) - Multi-line text input
    - [Textbox](#textbox) - Single-line text input
    - [Textbox Currency](#textbox-currency) - Formatted currency input
- **Services**
    - [API](#api) - HTTP API service utilities
- **Shared**
    - Model - Type definitions and models
    - Pipes
        - [Currency](#currency) - Currency formatting pipe
    - Utils - Helper utility functions
    - Directives - Custom Angular directives

## Component Usage Examples

### Button

Basic button component with multiple appearances and variants:

```typescript
import { Component, signal } from '@angular/core';
import { Button, ButtonModel } from '@devkitify/angular-ui-kit';

@Component({
  selector: 'app-button-example',
  standalone: true,
  imports: [Button],
  template: `
    <lib-button [config]="buttonConfig()"></lib-button>
  `
})
export class ButtonExampleComponent {
  isLoading = signal(false);
  
  buttonConfig = signal<ButtonModel>({
    text: 'Click Me',
    appearance: 'raised',
    color: 'primary',
    onClick: () => this.handleClick()
  });

  handleClick() {
    this.isLoading.set(true);
    // Handle button click
  }
}
```

**ButtonModel Options:**
- `text`: Button label text
- `appearance`: 'flat' | 'raised' | 'stroked' | 'icon' | 'fab'
- `color`: 'primary' | 'accent' | 'warn'
- `icon`: Material icon name
- `disabled`: Signal<boolean> for disabled state
- `loading`: Signal<boolean> for loading state
- `onClick`: Callback function

---

### Table

Advanced data table with sorting, pagination, and custom formatting:

```typescript
import { Component, signal } from '@angular/core';
import { Table, TableModel } from '@devkitify/angular-ui-kit';

@Component({
  selector: 'app-table-example',
  standalone: true,
  imports: [Table],
  template: `
    <lib-table [config]="tableConfig()">
      <ng-template #customTemplate let-data="data" let-key="key">
        <strong>{{ data[key] }}</strong>
      </ng-template>
    </lib-table>
  `
})
export class TableExampleComponent {
  tableConfig = signal<TableModel>(new TableModel());

  ngOnInit() {
    const config = this.tableConfig();
    
    // Define columns
    config.columns = [
      { key: 'id', label: 'ID', sortable: true },
      { key: 'name', label: 'Name', sortable: true },
      { key: 'email', label: 'Email', sortable: true },
      { key: 'createdDate', label: 'Created', sortable: true },
      { key: 'amount', label: 'Amount', sortable: false }
    ];

    // Configure data types for formatting
    config.dataType = {
      createdDate: { type: 'date', format: 'short' },
      amount: { 
        type: 'currency', 
        currency: 'USD',
        locale: 'en-US',
        minimumFractionDigits: 2
      },
      name: { type: 'custom' }
    };

    // Set data
    config.dataSource = [
      { id: 1, name: 'John', email: 'john@example.com', createdDate: new Date(), amount: 1500 },
      { id: 2, name: 'Jane', email: 'jane@example.com', createdDate: new Date(), amount: 2500 }
    ];

    config.dataTotal = config.dataSource.length;
    config.pageSize = 10;
    config.isServerSide.set(false);
    config.isPagination.set(true);
    config.isSorter.set(true);

    config.generateDataType();
  }
}
```

**TableModel Features:**
- `columns`: Column definitions (key, label, sortable)
- `dataSource`: Array of data objects
- `dataType`: Configure formatting (date, currency, custom)
- `isServerSide()`: Signal for server-side data handling
- `isPagination()`: Enable/disable pagination
- `isSorter()`: Enable/disable sorting
- Nested property support: `dataType: 'user.address.city'`

---

### Checkbox

Multi-select checkbox component with select-all functionality:

```typescript
import { Component } from '@angular/core';
import { Checkbox, FormlyField } from '@devkitify/angular-ui-kit';
import { signal } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-checkbox-example',
  standalone: true,
  imports: [Checkbox],
  template: `
    <lib-checkbox [field]="checkboxField()"></lib-checkbox>
  `
})
export class CheckboxExampleComponent {
  checkboxField = signal<FormlyField>({
    control: () => new FormControl([]),
    options: [
      { label: 'Option 1', value: 'opt1' },
      { label: 'Option 2', value: 'opt2' },
      { label: 'Option 3', value: 'opt3' }
    ],
    onChange: (event) => console.log('Selected:', event)
  });
}
```

---

### Dropdown

Select dropdown with optional infinite scroll and custom options:

```typescript
import { Component, signal } from '@angular/core';
import { Dropdown, FormlyField } from '@devkitify/angular-ui-kit';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-dropdown-example',
  standalone: true,
  imports: [Dropdown],
  template: `
    <lib-dropdown [field]="dropdownField()"></lib-dropdown>
  `
})
export class DropdownExampleComponent {
  dropdownField = signal<FormlyField>({
    control: () => new FormControl(null),
    options: [
      { label: 'Select an option', value: null, disabled: true },
      { label: 'Option 1', value: 'opt1' },
      { label: 'Option 2', value: 'opt2' }
    ],
    config: {
      dropdown: {
        infiniteScroll: {
          enabled: true,
          threshold: '15%',
          debounce: 150
        }
      }
    },
    onChange: (event) => console.log('Selected:', event)
  });
}
```

---

### Textbox

Text input component with Material design support:

```typescript
import { Component, signal } from '@angular/core';
import { Textbox, FormlyField } from '@devkitify/angular-ui-kit';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-textbox-example',
  standalone: true,
  imports: [Textbox],
  template: `
    <lib-textbox [field]="textboxField()"></lib-textbox>
  `
})
export class TextboxExampleComponent {
  textboxField = signal<FormlyField>({
    label: 'Email Address',
    placeholder: 'Enter your email',
    control: () => new FormControl(''),
    hint: 'We will never share your email',
    onChange: (event) => console.log('Value:', event)
  });
}
```

#### Textbox Password with Show/Hide Icon

Password input with toggle visibility:

```typescript
import { Component, signal } from '@angular/core';
import { Textbox, FormlyField } from '@devkitify/angular-ui-kit';
import { FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgTemplateOutlet } from '@angular/common';
import { TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-password-example',
  standalone: true,
  imports: [Textbox, MatIconModule, MatButtonModule, NgTemplateOutlet],
  template: `
    <lib-textbox 
      [field]="passwordField()"
      [matSuffixRef]="suffixTemplate">
    </lib-textbox>

    <ng-template #suffixTemplate>
      <button 
        type="button"
        mat-icon-button 
        (click)="togglePasswordVisibility()"
        [attr.aria-label]="isPasswordVisible() ? 'Hide password' : 'Show password'">
        <mat-icon>{{ isPasswordVisible() ? 'visibility' : 'visibility_off' }}</mat-icon>
      </button>
    </ng-template>
  `
})
export class PasswordExampleComponent {
  isPasswordVisible = signal(false);
  
  passwordField = signal<FormlyField>({
    label: 'Password',
    placeholder: 'Enter your password',
    control: () => new FormControl(''),
    config: {
      textboxType: 'password',
      appearance: 'outline'
    },
    onChange: (event) => console.log('Password changed')
  });

  togglePasswordVisibility() {
    this.isPasswordVisible.update(v => !v);
    
    // Update password field type dynamically
    const field = this.passwordField();
    if (field.config) {
      field.config.textboxType = this.isPasswordVisible() ? 'text' : 'password';
    }
  }
}
```

**Features:**
- Toggle between `password` and `text` input types
- Material Design icon button
- Accessibility attributes (`aria-label`)
- Custom suffix template with icon
- Responsive visibility state

---

### Textbox Currency

Specialized input for currency values with formatting:

```typescript
import { Component, signal } from '@angular/core';
import { TextboxCurrency, FormlyField } from '@devkitify/angular-ui-kit';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-currency-example',
  standalone: true,
  imports: [TextboxCurrency],
  template: `
    <lib-textbox-currency [field]="currencyField()"></lib-textbox-currency>
  `
})
export class CurrencyExampleComponent {
  currencyField = signal<FormlyField>({
    label: 'Amount',
    control: () => new FormControl(0),
    config: {
      currency: 'USD',
      locale: 'en-US'
    }
  });
}
```

---

### Datepicker

Date selection component:

```typescript
import { Component, signal } from '@angular/core';
import { Datepicker, FormlyField } from '@devkitify/angular-ui-kit';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-datepicker-example',
  standalone: true,
  imports: [Datepicker],
  template: `
    <lib-datepicker [field]="dateField()"></lib-datepicker>
  `
})
export class DatepickerExampleComponent {
  dateField = signal<FormlyField>({
    label: 'Select Date',
    control: () => new FormControl(new Date()),
    onChange: (event) => console.log('Date selected:', event)
  });
}
```

---

### Radio Button

Single-select radio group component:

```typescript
import { Component, signal } from '@angular/core';
import { RadioButton, FormlyField } from '@devkitify/angular-ui-kit';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-radio-example',
  standalone: true,
  imports: [RadioButton],
  template: `
    <lib-radio-button [field]="radioField()"></lib-radio-button>
  `
})
export class RadioExampleComponent {
  radioField = signal<FormlyField>({
    label: 'Choose one',
    control: () => new FormControl('option1'),
    options: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' }
    ]
  });
}
```

---

### Textarea

Multi-line text input:

```typescript
import { Component, signal } from '@angular/core';
import { Textarea, FormlyField } from '@devkitify/angular-ui-kit';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-textarea-example',
  standalone: true,
  imports: [Textarea],
  template: `
    <lib-textarea [field]="textareaField()"></lib-textarea>
  `
})
export class TextareaExampleComponent {
  textareaField = signal<FormlyField>({
    label: 'Comments',
    placeholder: 'Enter your feedback',
    control: () => new FormControl('')
  });
}
```

---

### Slide Toggle

Toggle switch component:

```typescript
import { Component, signal } from '@angular/core';
import { SlideToggle, FormlyField } from '@devkitify/angular-ui-kit';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-toggle-example',
  standalone: true,
  imports: [SlideToggle],
  template: `
    <lib-slide-toggle [field]="toggleField()"></lib-slide-toggle>
  `
})
export class SlideToggleExampleComponent {
  toggleField = signal<FormlyField>({
    label: 'Enable Notifications',
    control: () => new FormControl(false),
    onChange: (event) => console.log('Toggled:', event)
  });
}
```

---

### Chip

Chip/tag component for displaying small pieces of information:

```typescript
import { Component, signal } from '@angular/core';
import { Chip, FormlyField } from '@devkitify/angular-ui-kit';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-chip-example',
  standalone: true,
  imports: [Chip],
  template: `
    <lib-chip [field]="chipField()"></lib-chip>
  `
})
export class ChipExampleComponent {
  chipField = signal<FormlyField>({
    control: () => new FormControl(['tag1', 'tag2']),
    options: [
      { label: 'Angular', value: 'tag1' },
      { label: 'TypeScript', value: 'tag2' },
      { label: 'Material', value: 'tag3' }
    ]
  });
}
```

---

### Autocomplete

Search and autocomplete input:

```typescript
import { Component, signal } from '@angular/core';
import { Autocomplete, FormlyField } from '@devkitify/angular-ui-kit';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-autocomplete-example',
  standalone: true,
  imports: [Autocomplete],
  template: `
    <lib-autocomplete [field]="autocompleteField()"></lib-autocomplete>
  `
})
export class AutocompleteExampleComponent {
  autocompleteField = signal<FormlyField>({
    label: 'Search',
    control: () => new FormControl(''),
    options: [
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
      { label: 'Cherry', value: 'cherry' }
    ]
  });
}
```

---

## Quick Start

1. **Install the package:**
```bash
npm install @devkitify/angular-ui-kit
```

2. **Import a component in your module:**
```typescript
import { Table, TableModel } from '@devkitify/angular-ui-kit';

// Use in your component
```

3. **Configure and use:**
```typescript
const tableConfig = signal<TableModel>(new TableModel());
// Configure your component
```

4. **Add Material Theme** (optional):
```scss
// In your styles.scss
@import '@angular/material/prebuilt-themes/indigo-pink.css';
```

---

## Resources

- [Angular CLI Documentation](https://angular.dev/tools/cli)
- [Angular Official Documentation](https://angular.dev/)
- [Angular Material Documentation](https://material.angular.io)

---

Feel free to contribute or open issues to help improve this library!
