import { AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { FieldTree } from '@angular/forms/signals';

export type FormlyFieldType =
	| 'textbox'
	| 'textarea'
	| 'datepicker'
	| 'dropdown'
	| 'radio'
	| 'checkbox'
	| 'autocomplete'
	| 'chip'
	| 'button-toggle'
	| 'array';

export type TextBoxType = 'text' | 'password' | 'email' | 'number' | 'textarea';

export interface FormlyBaseConfig {
	label?: string;
	labelClass?: string;
	placeholder?: string;
	hint?: string;
	limit?: number;
	required?: boolean;
	disabled?: boolean;
	readonly?: boolean;
	appearance?: 'outline' | 'fill';
	textboxType?: TextBoxType;
	datepicker?: {
		isRangeDate?: boolean;
	};
}

export interface FormlyValidation {
	validators?: ValidatorFn[];
	asyncValidators?: AsyncValidatorFn[];
	message?: Record<string, string>;
}

export interface FormlyField {
	key: string;
	type: FormlyFieldType;
	control: FieldTree<any, any>;

	isSubField?: boolean;
	addItem?: {
		defaultObject: any;
	};
	fieldClass?: string;
	optionKey?: string;

	config: FormlyBaseConfig;
	validation?: FormlyValidation;

	fields?: FormlyField[];
}

export interface FormlyFormConfig {
	formClass?: string;
	fields: FormlyField[];
}
