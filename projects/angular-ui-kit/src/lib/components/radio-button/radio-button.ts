import { Component, computed, input } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { MatRadioButton } from '@angular/material/radio';
import { FormlyField } from '../../shared/model';
import { optionGenerator } from '../../shared/utils';
import { MatLabel } from '@angular/material/select';

@Component({
	selector: 'lib-radio-button',
	imports: [FormField, MatRadioButton, MatLabel],
	templateUrl: './radio-button.html',
	styleUrl: './radio-button.css',
})
export class RadioButton {
	field = input.required<FormlyField>();

	normalizedOptions = computed(() => {
		const _options = this.field().config.options;
		return optionGenerator(_options);
	});
}
