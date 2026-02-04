import { AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { FieldTree } from '@angular/forms/signals';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';

type FormlyFieldType =
	| 'textbox'
	| 'textarea'
	| 'datepicker'
	| 'dropdown'
	| 'radio'
	| 'checkbox'
	| 'autocomplete'
	| 'chip'
	| 'slide-toggle'
	| 'array';

type TextBoxType = 'text' | 'password' | 'email' | 'number' | 'textarea';

type DateFilterFn<D> = (date: D | null) => boolean;

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
		minDate?: Date;
		dateClass?: MatCalendarCellClassFunction<Date>;
		filterDate?: DateFilterFn<Date | null>;
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
	chip?: {
		removable?: boolean;
		draggable?: boolean;
		stacked?: boolean;

		/** input chip */
		allowInput?: boolean;
		inputPlaceholder?: string;
		allowAutocomplete?: boolean;
	};
	options?: {
		data: any[];
		labelKey?: string;
		valueKey?: string;
		filterKey?: string;
		avatarKey?: string;
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
	dateChange?: (event: any) => void;
	onSelectionChange?: (event: any) => void;
}

export interface FormlyFormConfig {
	formClass?: string;
	fields: FormlyField[];
}
