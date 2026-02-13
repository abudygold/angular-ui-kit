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
	inputClass?: string;
	optionClass?: string;
	hintClass?: string;
	selectAllClass?: string;
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
	title?: string;
	addBtnLabel?: string;
	type: FormlyFieldType;
	control: FieldTree<any, any>;

	// Default object to be added when addItem is called
	addItem?: {
		defaultObject: any;
	};

	formClass?: string;
	fieldClass?: string;
	removeClass?: {
		div?: string;
		btn?: string;
	};
	addClass?: {
		div?: string;
		btn?: string;
	};
	panelClass?: {
		accordion?: string;
		panel?: string;
		header?: string;
		title?: string;
		content?: string;
	};

	// panelClass?: string;
	// arrayDivClass?: string;
	// removeButtonClass?: string;
	// addButtonClass?: string;
	// fieldClass?: string;

	config: FormlyBaseConfig;
	validation?: FormlyValidation;

	fields?: FormlyField[];

	onInput?: (event: any) => void;
	onBlur?: (event: any) => void;
	onChange?: (event: any) => void;
}

export interface FormlyFormConfig {
	formClass?: string;
	fields: FormlyField[];
}
