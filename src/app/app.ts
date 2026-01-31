import { Component, signal } from '@angular/core';
import { applyEach, form, required, submit } from '@angular/forms/signals';
import { RouterOutlet } from '@angular/router';
import { Formly, FormlyField, FormlyFormConfig } from '@devkitify/angular-ui-kit';

export interface MenuData {
	umrahName: string;
	isPublish: boolean;
	packages: {
		name: string;
		quota: number;
		prices: {
			priceValue: number;
		}[];
	}[];
	jamaah: {
		name: string;
	}[];
}

@Component({
	selector: 'app-root',
	imports: [RouterOutlet, Formly],
	templateUrl: './app.html',
	styleUrl: './app.css',
})
export class App {
	formModel = signal<MenuData>({
		umrahName: '',
		isPublish: false,
		packages: [],
		jamaah: [],
	});

	formData = form(this.formModel, (schemaPath) => {
		required(schemaPath.umrahName, { message: 'Umrah name is required' });
		required(schemaPath.isPublish, { message: 'Is Publish is required' });
		applyEach(schemaPath.packages, (item) => {
			required(item.name, { message: 'Name is required' });
			required(item.quota, { message: 'Quota is required' });
			applyEach(item.prices, (item) => {
				required(item.priceValue, { message: 'Price value is required' });
			});
		});
		applyEach(schemaPath.jamaah, (item) => {
			required(item.name, { message: 'Jamaah name is required' });
		});
	});

	formConfig: FormlyFormConfig = {
		formClass: 'tw:grid tw:grid-cols-2 tw:gap-4 tw:m-6',
		fields: [
			{
				key: 'umrahName',
				type: 'textbox',
				control: this.formData.umrahName,
				config: { label: 'Umrah Name', required: true },
			},
			{
				key: 'isPublish',
				type: 'textbox',
				control: this.formData.isPublish,
				config: { label: 'Is Publish', required: true },
			},
			{
				key: 'packages',
				type: 'array',
				fieldClass: 'tw:col-span-2',
        // itemListClass: 'tw:border !tw:border-solid tw:border-gray-400/80 tw:rounded-2xl tw:p-4 tw:mb-4',
				control: this.formData.packages,
				addItem: {
					defaultObject: {
						name: '',
						quota: 0,
						prices: [],
					},
				},
				fields: [
					{
						key: 'name',
						type: 'textbox',
						isSubField: true,
						config: { label: 'Package Name', required: true },
					},
					{
						key: 'quota',
						type: 'textbox',
						isSubField: true,
						config: { label: 'Quota', required: true },
					},
					{
						key: 'prices',
						type: 'array',
						fieldClass: 'tw:col-span-12 tw:m-8',
						addItem: {
							defaultObject: {
								priceValue: 0,
							},
						},
						fields: [
							{
								key: 'priceValue',
								type: 'textbox',
								isSubField: true,
								config: { label: 'Price Value', required: true },
							},
						],
					},
				] as FormlyField[],
			},
			{
				key: 'jamaah',
				type: 'array',
				fieldClass: 'tw:col-span-2',
				control: this.formData.jamaah,
				addItem: {
					defaultObject: {
						name: '',
					},
				},
				fields: [
					{
						key: 'name',
						type: 'textbox',
						isSubField: true,
						config: { label: 'Jamaah Name', required: true },
					},
				] as FormlyField[],
			},
		] as FormlyField[],
	};

	onSubmit(): void {
		submit(this.formData, async () => console.log('@@@', this.formModel()));
	}
}
