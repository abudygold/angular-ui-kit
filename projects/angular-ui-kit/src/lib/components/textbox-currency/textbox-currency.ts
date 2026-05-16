import { NgTemplateOutlet } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	ContentChild,
	TemplateRef,
	input,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CurrencyIntlInputDirective } from '../../shared/directives';
import { FormlyField } from '../../shared/model';
import { getFormlyCurrencyConfig, getFormlyValueLength } from '../../shared/utils';

@Component({
	selector: 'lib-textbox-currency',
	imports: [NgTemplateOutlet, MatFormFieldModule, MatInputModule, CurrencyIntlInputDirective],
	templateUrl: './textbox-currency.html',
	styleUrl: './textbox-currency.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextboxCurrency {
	field = input.required<FormlyField>();

	@ContentChild('matPrefixRef')
	matPrefixRef!: TemplateRef<any> | null;

	@ContentChild('matSuffixRef')
	matSuffixRef!: TemplateRef<any> | null;

	@ContentChild('matTextPrefixRef')
	matTextPrefixRef!: TemplateRef<any> | null;

	@ContentChild('matTextSuffixRef')
	matTextSuffixRef!: TemplateRef<any> | null;

	get currency(): string {
		return getFormlyCurrencyConfig(this.field()).currency;
	}

	get locale(): string {
		return getFormlyCurrencyConfig(this.field()).locale;
	}

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
