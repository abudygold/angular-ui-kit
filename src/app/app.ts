import { Component, signal } from '@angular/core';
import { applyEach, form, required, submit } from '@angular/forms/signals';
import { RouterOutlet } from '@angular/router';
import {
	Button,
	ButtonModel,
	Formly,
	FormlyField,
	FormlyFormConfig,
} from '@devkitify/angular-ui-kit';

export interface MenuData {
	umrahName: string;
	isPublish: boolean;
	facilities: string;
	cities: string;
	packages: {
		packageName: string;
		quota: number;
		prices: {
			priceValue: number;
		}[];
	}[];
	jamaah: {
		jammahName: string;
	}[];
}

@Component({
	selector: 'app-root',
	imports: [RouterOutlet, Formly, Button],
	templateUrl: './app.html',
	styleUrl: './app.css',
})
export class App {
	formModel = signal<MenuData>({
		umrahName: '',
		isPublish: false,
		facilities: '',
		cities: '',
		packages: [],
		jamaah: [],
	});

	formData = form(this.formModel, (schemaPath) => {
		required(schemaPath.umrahName, { message: 'Umrah name is required' });
		// required(schemaPath.isPublish, { message: 'Is Publish is required' });
		applyEach(schemaPath.packages, (item) => {
			required(item.packageName, { message: 'Package Name is required' });
			required(item.quota, { message: 'Quota is required' });
			applyEach(item.prices, (item) => {
				required(item.priceValue, { message: 'Price value is required' });
			});
		});
		applyEach(schemaPath.jamaah, (item) => {
			required(item.jammahName, { message: 'Jamaah name is required' });
		});
	});

	formConfig: FormlyFormConfig = {
		formClass: 'tw:grid tw:grid-cols-2 tw:gap-4 tw:m-6',
		fields: [
			{
				key: 'umrahName',
				type: 'dropdown',
				control: this.formData.umrahName,
				onSelectionChange: (event: Event) => this.actionHandler(event),
				config: {
					label: 'Umrah Name',
					required: true,
					options: {
						labelKey: 'name',
						data: [
							{ id: 1, name: 'Umrah' },
							{ id: 2, name: 'Haji' },
							{ id: 3, name: 'Flight' },
						],
					},
				},
			},
			{
				key: 'isPublish',
				type: 'slide-toggle',
				control: this.formData.isPublish,
				config: { label: 'Is Publish', required: true },
			},
			{
				key: 'facilities',
				type: 'checkbox',
				control: this.formData.facilities,
				config: {
					label: 'Facilities',
					checkbox: {
						isSelectAll: true,
					},
					options: {
						labelKey: 'name',
						valueKey: 'name',
						data: [
							{ id: 1, name: 'Hotel' },
							{ id: 2, name: 'Flight' },
							{ id: 3, name: 'Visa' },
						],
					},
				},
			},
			{
				key: 'cities',
				type: 'autocomplete',
				control: this.formData.cities,
				config: {
					label: 'City',
					options: {
						labelKey: 'name',
						valueKey: 'name',
						data: [
							{ id: 1, name: 'Makkah' },
							{ id: 2, name: 'Madinah' },
							{ id: 3, name: 'Jeddah' },
						],
					},
				},
			},
			{
				key: 'packages',
				type: 'array',
				fieldClass: 'tw:col-span-2',
				control: this.formData.packages,
				addItem: {
					defaultObject: {
						packageName: '',
						quota: 0,
						prices: [],
					},
				},
				fields: [
					{
						key: 'packageName',
						type: 'textarea',
						config: { label: 'Package Name', required: true },
						onChange: (event: Event) => this.actionHandler(event),
					},
					{
						key: 'quota',
						type: 'textbox',
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
						jammahName: '',
					},
				},
				fields: [
					{
						key: 'jammahName',
						type: 'textbox',
						config: { label: 'Jamaah Name', required: true },
					},
				] as FormlyField[],
			},
		] as FormlyField[],
	};

	submitBtn: ButtonModel = {
		text: 'Submit',
		appearance: 'flat',
		disabled: signal<boolean>(false),
		loading: signal<boolean>(false),
		onClick: () => this.onSubmit(),
		// onClick: (event: Event) => this.onSubmit(event, this.formModel()),
		/* onClick: (event: Event) =>
			this.onClickedHandler({
				form: this.formModel(event, this.formModel()),
			}), */
	};

	actionHandler(event: any): void {
		console.log('event', event);
	}

	onSubmit(): void {
		submit(this.formData, async () => {
			this.submitBtn.loading.set(true);
			console.log('@@@', this.formModel());
			setTimeout(() => this.submitBtn.loading.set(false), 300);
		});
	}
}
