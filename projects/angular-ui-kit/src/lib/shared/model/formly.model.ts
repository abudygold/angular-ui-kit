import { AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { FieldTree } from '@angular/forms/signals';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';

export type FormlyFieldType =
	| 'textbox'
	| 'textarea'
	| 'datepicker'
	| 'dropdown'
	| 'radio'
	| 'checkbox'
	| 'autocomplete'
	| 'chip'
	| 'slide-toggle'
	| 'currency'
	| 'array';

export type FormlyTextboxType = 'text' | 'password' | 'email' | 'number' | 'textarea';
export type FormlyAppearance = 'outline' | 'fill';
export type FormlyLabelPosition = 'before' | 'after';
export type FormlySignalControl = FieldTree<any, any>;
export type FormlyControl = FormlySignalControl;
export type FormlyEventHandler<TEvent = unknown> = (event: TEvent) => void;
export type FormlyDateFilterFn<D> = (date: D | null) => boolean;

export interface FormlyOptionsConfig<TOption = unknown> {
	data?: TOption[];
	labelKey?: string;
	valueKey?: string;
	filterKey?: string;
	avatarKey?: string;
}

export interface FormlyCurrencyConfig {
	currency?: string;
	locale?: string;
}

export interface FormlyDatepickerConfig {
	minDate?: Date;
	dateClass?: MatCalendarCellClassFunction<Date>;
	filterDate?: FormlyDateFilterFn<Date | null>;
}

export interface FormlyTextareaConfig {
	rows?: number;
}

export interface FormlyInfiniteScrollConfig {
	enabled?: boolean;
	threshold?: string | number;
	debounce?: number;
	complete?: boolean;
	loading?: boolean;
	disabled?: boolean;
	loadOnOpen?: boolean;
}

export interface FormlyDropdownConfig<TOption = unknown> {
	options?: TOption[];
	multiple?: boolean;
	labelKey?: string;
	valueKey?: string;
	infiniteScroll?: boolean | FormlyInfiniteScrollConfig;
}

export interface FormlySlideToggleConfig {
	label?: string;
	labelPosition?: FormlyLabelPosition;
}

export interface FormlyCheckboxConfig {
	isSelectAll?: boolean;
	align?: FormlyLabelPosition;
	selectAllLabel?: string;
}

export interface FormlyChipConfig {
	removable?: boolean;
	draggable?: boolean;
	stacked?: boolean;
	allowInput?: boolean;
	inputPlaceholder?: string;
	allowAutocomplete?: boolean;
}

export interface FormlyClassConfig {
	labelClass?: string;
	inputClass?: string;
	optionClass?: string;
	hintClass?: string;
	selectAllClass?: string;
}

export interface FormlyBaseConfig<TOption = unknown> extends FormlyClassConfig {
	label?: string;
	placeholder?: string;
	hint?: string;
	limit?: number;
	required?: boolean;
	disabled?: boolean;
	readonly?: boolean;
	appearance?: FormlyAppearance;
	textboxType?: FormlyTextboxType;
	textboxCurrency?: FormlyCurrencyConfig;

	/** @deprecated Use textboxCurrency instead. */
	texboxCurrency?: FormlyCurrencyConfig;

	datepicker?: FormlyDatepickerConfig;
	textarea?: FormlyTextareaConfig;
	dropdown?: FormlyDropdownConfig<TOption>;
	slideToggle?: FormlySlideToggleConfig;
	checkbox?: FormlyCheckboxConfig;
	chip?: FormlyChipConfig;
	options?: FormlyOptionsConfig<TOption>;
}

export interface FormlyValidation {
	validators?: ValidatorFn[];
	asyncValidators?: AsyncValidatorFn[];
	message?: Record<string, string>;
}

export interface FormlyArrayItem<TDefault = unknown> {
	defaultObject: TDefault;
}

export interface FormlyButtonClassConfig {
	div?: string;
	btn?: string;
}

export interface FormlyPanelClassConfig {
	accordion?: string;
	panel?: string;
	header?: string;
	title?: string;
	content?: string;
}

export interface FormlyField<
	TControl extends FormlySignalControl = FormlySignalControl,
	TOption = unknown,
> {
	key: string;
	type: FormlyFieldType;
	control: TControl;
	config: FormlyBaseConfig<TOption>;
	title?: string;
	addBtnLabel?: string;
	addItem?: FormlyArrayItem;
	formClass?: string;
	fieldClass?: string;
	removeClass?: FormlyButtonClassConfig;
	addClass?: FormlyButtonClassConfig;
	panelClass?: FormlyPanelClassConfig;
	validation?: FormlyValidation;
	fields?: FormlyField[];
	onInput?: FormlyEventHandler;
	onBlur?: FormlyEventHandler;
	onChange?: FormlyEventHandler;
	onInfiniteScroll?: FormlyEventHandler;
}

export interface FormlyFormConfig {
	formClass?: string;
	fields: FormlyField[];
}
