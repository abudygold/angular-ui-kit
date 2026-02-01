/*
 *  * Author: Abdullah Umar Babsel
 *  * Date: 12/06/2025
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'currencyIntl',
	standalone: true,
})
export class CurrencyIntlPipe implements PipeTransform {
	transform(
		value: number,
		currency: string = 'USD',
		locale: string = 'en-US',
		minimumFractionDigits?: number,
		maximumFractionDigits?: number,
	): string {
		const options: Intl.NumberFormatOptions = {
			style: 'currency',
			currency,
			minimumFractionDigits,
			maximumFractionDigits,
		};

		// Remove undefined options
		Object.keys(options).forEach(
			(key) =>
				options[key as keyof Intl.NumberFormatOptions] === undefined &&
				delete options[key as keyof Intl.NumberFormatOptions],
		);

		return new Intl.NumberFormat(locale, options).format(value);
	}

	public parse(value: string): string {
		return value
			?.toString()
			.split('.')
			.join('')
			.split(',')
			.join('')
			.split(' ')
			.join('')
			?.match(/(\d+)/)
			?.shift() as string;
	}
}
