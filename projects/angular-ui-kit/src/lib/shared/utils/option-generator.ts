export const optionGenerator = (options: any): any[] => {
	return [...(options?.data || [])].map((item: any) => {
		// string[] support
		if (typeof item === 'string' || typeof item === 'number') {
			return {
				label: item,
				value: item,
			};
		}

		// object[] support
		return {
			label: options?.labelKey ? item[options.labelKey] : item,
			value: options?.valueKey ? item[options.valueKey] : item,
		};
	});
};
