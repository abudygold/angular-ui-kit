import { FormlyCurrencyConfig, FormlyField, FormlyOptionsConfig } from '../model';

export const getFormlyOptionsConfig = (field: FormlyField): FormlyOptionsConfig => {
	const { dropdown, options } = field.config;

	if (options) return options;
	if (!dropdown?.options) return { data: [] };

	return {
		data: dropdown.options,
		labelKey: dropdown.labelKey,
		valueKey: dropdown.valueKey,
	};
};

export const getFormlyCurrencyConfig = (field: FormlyField): Required<FormlyCurrencyConfig> => {
	const config = field.config.textboxCurrency ?? field.config.texboxCurrency;

	return {
		currency: config?.currency ?? 'USD',
		locale: config?.locale ?? 'en-US',
	};
};

export const getFormlyArrayValue = <TValue = unknown>(field: FormlyField): TValue[] => {
	const value = field.control().value();
	return Array.isArray(value) ? value : [];
};

export const getFormlyValueLength = (field: FormlyField): number => {
	const value = field.control().value();

	if (value === null || value === undefined) return 0;
	if (typeof value === 'string' || Array.isArray(value)) return value.length;

	return String(value).length;
};

export const updateFormlyArrayValue = <TValue = unknown>(
	field: FormlyField,
	updater: (current: TValue[]) => TValue[],
): void => {
	field
		.control()
		.value.update((current: unknown) =>
			updater(Array.isArray(current) ? (current as TValue[]) : []),
		);
};
