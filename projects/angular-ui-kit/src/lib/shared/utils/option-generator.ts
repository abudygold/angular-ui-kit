import { FormlyOptionsConfig } from '../model';

export interface NormalizedOption<TValue = unknown, TRaw = unknown> {
	label: string;
	value: TValue;
	avatar?: string;
	raw: TRaw;
}

export const optionGenerator = <TOption = unknown>(
	options?: FormlyOptionsConfig<TOption> | null,
): NormalizedOption[] => {
	return [...(options?.data ?? [])].map((item) => {
		const label = resolveOptionValue(item, options?.labelKey);
		const value = resolveOptionValue(item, options?.valueKey, item);
		const avatar = resolveOptionValue(item, options?.avatarKey);

		return {
			label: String(label ?? ''),
			value,
			avatar: avatar === undefined || avatar === null ? undefined : String(avatar),
			raw: item,
		};
	});
};

const resolveOptionValue = <TOption>(
	item: TOption,
	key?: string,
	fallback: unknown = item,
): unknown => {
	if (!key) return fallback;
	if (!isRecord(item)) return fallback;

	return item[key] ?? fallback;
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
	return value !== null && typeof value === 'object';
};
