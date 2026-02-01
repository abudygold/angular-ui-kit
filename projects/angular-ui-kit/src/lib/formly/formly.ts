import { NgTemplateOutlet } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatError } from '@angular/material/form-field';
import { Textbox } from '../components/textbox';
import { FormlyField, FormlyFormConfig } from '../shared/model';

@Component({
	selector: 'lib-formly',
	imports: [NgTemplateOutlet, MatError, Textbox],
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

	checkError(control: any) {
		console.log(control);
	}
}
