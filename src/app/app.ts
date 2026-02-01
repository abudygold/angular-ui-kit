import { Component, signal } from '@angular/core';
import { applyEach, form, required, SchemaPathTree, submit } from '@angular/forms/signals';
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
		packages: [],
		jamaah: [],
	});

	formData = form(this.formModel, (schemaPath) => {
		required(schemaPath.umrahName, { message: 'Umrah name is required' });
		required(schemaPath.isPublish, { message: 'Is Publish is required' });
		applyEach(
			schemaPath.packages,
			(
				item: SchemaPathTree<{
					packageName: string;
					quota: number;
					prices: {
						priceValue: number;
					}[];
				}>,
			) => {
				required(item.packageName, { message: 'Package Name is required' });
				required(item.quota, { message: 'Quota is required' });
				applyEach(
					item.prices,
					(
						item: SchemaPathTree<{
							priceValue: number;
						}>,
					) => {
						required(item.priceValue, { message: 'Price value is required' });
					},
				);
			},
		);
		applyEach(schemaPath.jamaah, (item) => {
			required(item.jammahName, { message: 'Jamaah name is required' });
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
						jammahName: '',
					},
				},
				fields: [
					{
						key: 'jammahName',
						type: 'textbox',
						isSubField: true,
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
		/* onClick: () =>
			this.onClickedHandler({
				form: this.formModel(),
			}), */
	};

	onSubmit(): void {
		submit(this.formData, async () => {
			this.submitBtn.loading.set(true);
			console.log('@@@', this.formModel());
			setTimeout(() => this.submitBtn.loading.set(false), 300);
		});
	}
}
