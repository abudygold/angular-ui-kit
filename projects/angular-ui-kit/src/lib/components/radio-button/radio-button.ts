import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { MatLabel } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { FormlyField } from '../../shared/model';
import { getFormlyOptionsConfig, optionGenerator } from '../../shared/utils';

@Component({
	selector: 'lib-radio-button',
	imports: [FormField, MatRadioModule, MatLabel],
	templateUrl: './radio-button.html',
	styleUrl: './radio-button.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioButton {
	field = input.required<FormlyField>();

	normalizedOptions = computed(() => {
		return optionGenerator(getFormlyOptionsConfig(this.field()));
	});

	onChange(event: unknown): void {
		this.field().onChange?.(event);
	}
}
