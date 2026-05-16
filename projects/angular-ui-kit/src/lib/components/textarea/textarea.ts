import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormlyField } from '../../shared/model';
import { getFormlyValueLength } from '../../shared/utils';

@Component({
	selector: 'lib-textarea',
	imports: [FormField, MatFormFieldModule, MatInputModule],
	templateUrl: './textarea.html',
	styleUrl: './textarea.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Textarea {
	field = input.required<FormlyField>();

	valueLength(): number {
		return getFormlyValueLength(this.field());
	}

	onBlur(event: Event): void {
		this.field().onBlur?.(event);
	}

	onInput(event: Event): void {
		this.field().onInput?.(event);
	}

	onChange(event: Event): void {
		this.field().onChange?.(event);
	}
}
