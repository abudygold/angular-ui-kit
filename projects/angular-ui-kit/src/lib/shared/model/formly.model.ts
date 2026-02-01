import { AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { FieldTree } from '@angular/forms/signals';

export type FormlyFieldType =
	| 'textbox'
	| 'textarea'
	| 'datepicker' // TODO
	| 'dropdown'
	| 'radio'
	| 'checkbox'
	| 'autocomplete'
	| 'chip' // TODO
	| 'slide-toggle'
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
	textarea?: {
		rows?: number;
	};
	dropdown?: {
		options: any[];
		multiple?: boolean;
		labelKey?: string;
		valueKey?: string;
	};
	slideToggle?: {
		label?: string;
		labelPosition?: 'before' | 'after';
	};
	checkbox?: {
		isSelectAll?: boolean;
		align?: 'before' | 'after';
		selectAllLabel?: string;
	};
	options?: {
		data: any[];
		labelKey?: string;
		valueKey?: string;
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

	addItem?: {
		defaultObject: any;
	};
	fieldClass?: string;
	optionKey?: string;

	config: FormlyBaseConfig;
	validation?: FormlyValidation;

	fields?: FormlyField[];

	onInput?: (event: any) => void;
	onBlur?: (event: any) => void;
	onChange?: (event: any) => void;
	onSelectionChange?: (event: any) => void;
}

export interface FormlyFormConfig {
	formClass?: string;
	fields: FormlyField[];
}
