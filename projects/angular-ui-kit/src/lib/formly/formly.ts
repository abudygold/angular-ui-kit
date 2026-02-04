import { NgTemplateOutlet } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatError } from '@angular/material/form-field';
import { Autocomplete } from '../components/autocomplete';
import { Checkbox } from '../components/checkbox';
import { Chip } from '../components/chip';
import { Datepicker } from '../components/datepicker';
import { Dropdown } from '../components/dropdown';
import { RadioButton } from '../components/radio-button';
import { SlideToggle } from '../components/slide-toggle';
import { Textarea } from '../components/textarea';
import { Textbox } from '../components/textbox';
import { FormlyField, FormlyFormConfig } from '../shared/model';

@Component({
	selector: 'lib-formly',
	imports: [
		NgTemplateOutlet,
		MatError,
		Textbox,
		Textarea,
		Dropdown,
		Checkbox,
		RadioButton,
		Autocomplete,
		Datepicker,
		SlideToggle,
		Chip,
	],
	templateUrl: './formly.html',
	styleUrl: './formly.css',
})
export class Formly {
	formConfig = input.required<FormlyFormConfig | FormlyField | any>();
	isArray = input<boolean>(false);

	addItem(field: any) {
		if (!field.addItem || !field.control()) return;

		field
			.control()
			.value.update((oldValue: any[]) => [...oldValue, { ...field.addItem.defaultObject }]);
	}

	removeItem(control: any, index: number) {
		control().value.update((oldValue: any[]) => oldValue.filter((_, i: number) => i !== index));
	}
}
