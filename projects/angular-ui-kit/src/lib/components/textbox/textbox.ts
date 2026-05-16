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
import { FormlyField } from '../../shared/model';
import { getFormlyValueLength } from '../../shared/utils';

@Component({
	selector: 'lib-textbox',
	imports: [NgTemplateOutlet, FormField, MatFormFieldModule, MatInputModule],
	templateUrl: './textbox.html',
	styleUrl: './textbox.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Textbox {
	field = input.required<FormlyField>();

	@ContentChild('matPrefixRef')
	matPrefixRef!: TemplateRef<any> | null;

	@ContentChild('matSuffixRef')
	matSuffixRef!: TemplateRef<any> | null;

	@ContentChild('matTextPrefixRef')
	matTextPrefixRef!: TemplateRef<any> | null;

	@ContentChild('matTextSuffixRef')
	matTextSuffixRef!: TemplateRef<any> | null;

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
