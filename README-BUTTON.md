## Usage: ButtonComponent

The `ButtonComponent` is a powerful Angular component that allows you to create dynamic buttons with various styles and configurations. It supports reactive programming with Angular's `WritableSignal` for options management.

### 1. Define Button Constants

Create a constants file to define your button configuration and styles. This helps in maintaining a clean structure and reusability across your application.:

```typescript
import { ButtonModel } from '@devkitify/angular-ui-kit';

export const EXAMPLE_BUTTON_CONST: ButtonModel = new ButtonModel(
	'stroked',
	'Back to login',
	'primary',
	false,
	'tw-w-full !tw-h-10',
);

export const EXAMPLE_BUTTON_WITH_ICON_CONST: ButtonModel = new ButtonModel(
	'stroked',
	'Back to login',
	'primary',
	false,
	'tw-w-full !tw-h-10',
	'',
	'arrow_back',
	'start',
);

export const EXAMPLE_BUTTON_WITH_IMAGE_ICON_CONST: ButtonModel = new ButtonModel(
	'flat',
	'Hubungi Kami',
	'primary',
	false,
	'!tw-h-10',
	'',
	'',
	'start',
	'./icons/socmed/whatsapp-white.svg',
);
```

This file centralizes your button's configuration and constants for easy reuse.

### 2. Prepare Your Data

Define your button data and configuration in your component:

```typescript
import { ButtonComponent } from '@devkitify/angular-ui-kit';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { EXAMPLE_BUTTON_CONST } from '../shared/const/button';

@Component({
	selector: 'app-example',
	imports: [ButtonComponent],
	templateUrl: './example.component.html',
	styleUrl: './example.component.scss',
})
export class ExampleComponent {
	#router = inject(Router);

	formConfig = {
		back: signal<ButtonModel>(EXAMPLE_BUTTON_CONST),
	};

	navigateToLogin(): void {
		this.#router.navigate(['/']);
	}
}
```

### 3. Use in Template

Add the component to your template and bind your data:

```html
<lib-button [config]="formConfig.back()" (onClick)="navigateToLogin()" />
```

### 4. API

| Input          | Type                                                                                   | Description                                                             |
| -------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `variant`      | 'basic' / 'raised' / 'flat' / 'icon' / 'stroked' / 'fab' / 'mini-fab' / 'extended-fab' | The type of the button. Defaults to 'basic'                             |
| `label`        | string                                                                                 | The label text displayed on the button. Defaults to 'Button'.           |
| `color`        | 'primary' / 'secondary' / 'secondary-gray' / 'tertiary' / 'link'                       | Defines the text color of the button. Defaults to 'primary'.            |
| `disabled`     | boolean                                                                                | Indicates whether the button is disabled. Defaults to false.            |
| `buttonClass`  | string                                                                                 | Custom class for the button. Defaults to an empty string.               |
| `link`         | string                                                                                 | The URL or route the button navigates to. Defaults to an empty string.  |
| `icon`         | string                                                                                 | The icon associated with the button. Defaults to an empty string.       |
| `iconPosition` | 'start' / 'end'                                                                        | The position of the icon relative to the label. Defaults to 'start'.    |
| `imageIcon`    | string                                                                                 | The image icon associated with the button. Defaults to an empty string. |

---

## For more advanced usage:

- **Custom Styling:** Use the <code>buttonClass</code> property to apply custom CSS classes for unique button styles.
- **Navigation:** The <code>link</code> property allows the button to act as a navigation element, directing users to a specified URL or route.
- **Icons:** Combine the <code>icon</code> and <code>iconPosition</code> properties to add visual cues and improve user experience, placing the icon at the start or end of the button label.
- **State Management:** The <code>disabled</code> property can be dynamically bound to a variable to enable or disable the button based on the application's state.
