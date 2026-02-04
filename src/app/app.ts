import { Component, signal, ViewEncapsulation } from '@angular/core';
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
	departure: Date | null;
	hobbies: string[];
}

@Component({
	selector: 'app-root',
	imports: [RouterOutlet, Formly, Button],
	templateUrl: './app.html',
	styleUrl: './app.css',
	encapsulation: ViewEncapsulation.None,
})
export class App {
	formModel = signal<MenuData>({
		umrahName: '',
		isPublish: false,
		facilities: '',
		cities: '',
		packages: [],
		jamaah: [],
		departure: null,
		hobbies: ['Sepeda', 'Motoran', 'Membaca'],
	});

	formData = form(this.formModel, (schemaPath) => {
		required(schemaPath.umrahName, { message: 'Umrah name is required' });
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
				key: 'hobbies',
				type: 'chip',
				fieldClass: 'tw:col-span-2',
				control: this.formData.hobbies,
				config: {
					label: 'Hobbies',
					options: {
						data: ['Sepeda', 'Motoran', 'Membaca', 'Tidur Siang', 'Makan'],
					},
					chip: {
						// draggable: true,
						// allowInput: true,
						removable: true,
						allowAutocomplete: true,
						inputPlaceholder: 'Add Hobby',
					},
				},
			},
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
				key: 'departure',
				type: 'datepicker',
				control: this.formData.departure,
				config: {
					label: 'Departure',
					datepicker: {
						minDate: new Date(),
						dateClass: (cellDate, view) => {
							// Only highligh dates inside the month view.
							if (view === 'month') {
								const date = cellDate.getDate();

								// Highlight the 1st and 20th day of each month.
								return date === 1 || date === 20
									? 'tw:bg-orange-500! tw:rounded-full'
									: '';
							}

							return '';
						},
						filterDate: (d: Date | null): boolean => {
							const day = (d || new Date()).getDay();
							// Prevent Saturday and Sunday from being selected.
							return day !== 0 && day !== 6 && day !== 4;
						},
					},
				},
			},
			{
				key: 'isPublish',
				type: 'slide-toggle',
				control: this.formData.isPublish,
				config: { label: 'Is Publish' },
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
						filterKey: 'label',
						// valueKey: 'name',
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
