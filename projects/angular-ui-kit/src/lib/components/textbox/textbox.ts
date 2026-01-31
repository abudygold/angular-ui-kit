import { NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, TemplateRef, input } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormlyField } from '../../shared/model';

@Component({
	selector: 'lib-textbox',
	imports: [NgTemplateOutlet, FormField, MatFormFieldModule, MatInputModule],
	templateUrl: './textbox.html',
	styleUrl: './textbox.css',
})
export class Textbox {
	field = input.required<FormlyField>();

	@ContentChild('matPrefixRef')
	public matPrefixRef!: TemplateRef<any> | null;

	@ContentChild('matSuffixRef')
	public matSuffixRef!: TemplateRef<any> | null;

	@ContentChild('matTextPrefixRef')
	public matTextPrefixRef!: TemplateRef<any> | null;

	@ContentChild('matTextSuffixRef')
	public matTextSuffixRef!: TemplateRef<any> | null;

	controlValue(fieldControl: any): any {
		if (this.field().isSubField) return fieldControl[this.field().key];

		return fieldControl;
	}
}
