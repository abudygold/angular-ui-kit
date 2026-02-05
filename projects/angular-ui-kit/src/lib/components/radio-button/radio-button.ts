import { Component, computed, input } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { MatRadioModule } from '@angular/material/radio';
import { MatLabel } from '@angular/material/select';
import { FormlyField } from '../../shared/model';
import { optionGenerator } from '../../shared/utils';

@Component({
	selector: 'lib-radio-button',
	imports: [FormField, MatRadioModule, MatLabel],
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
