import { NgTemplateOutlet } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	ContentChild,
	TemplateRef,
	input,
} from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CurrencyIntlInputDirective } from '../../shared/directives';
import { FormlyField } from '../../shared/model';

@Component({
	selector: 'lib-textbox-currency',
	imports: [
		NgTemplateOutlet,
		FormField,
		MatFormFieldModule,
		MatInputModule,
		CurrencyIntlInputDirective,
	],
	templateUrl: './textbox-currency.html',
	styleUrl: './textbox-currency.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextboxCurrency {
	field = input.required<FormlyField>();

	@ContentChild('matPrefixRef')
	public matPrefixRef!: TemplateRef<any> | null;

	@ContentChild('matSuffixRef')
	public matSuffixRef!: TemplateRef<any> | null;

	@ContentChild('matTextPrefixRef')
	public matTextPrefixRef!: TemplateRef<any> | null;

	@ContentChild('matTextSuffixRef')
	public matTextSuffixRef!: TemplateRef<any> | null;
}
