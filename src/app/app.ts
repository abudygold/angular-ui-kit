import { Component, signal, ViewEncapsulation } from '@angular/core';
import { applyEach, email, form, required, submit } from '@angular/forms/signals';
import { RouterOutlet } from '@angular/router';
import {
	Button,
	ButtonModel,
	Formly,
	FormlyField,
	FormlyFormConfig,
} from '@devkitify/angular-ui-kit';

export interface IExample {
	firstName: string;
	lastName: string;
	email: string;
	dob: Date | null;
	birthPlace: string;
	age: number;
	hobbies: string[];
	child: {
		firstName: string;
		lastName: boolean;
		email: string;
		dob: Date | null;
		birthPlace: string;
		age: number;
		hobbies: string[];
		school: {
			name: string;
			location: string;
		}[];
	}[];
}

@Component({
	selector: 'app-root',
	imports: [RouterOutlet, Formly, Button],
	templateUrl: './app.html',
	styleUrl: './app.css',
	encapsulation: ViewEncapsulation.None,
})
export class App {
	formModel = signal<IExample>({
		firstName: '',
		lastName: '',
		email: '',
		dob: null,
		birthPlace: '',
		age: 0,
		hobbies: [],
		child: [],
	});

	formData = form(this.formModel, (schemaPath) => {
		required(schemaPath.firstName, { message: 'First name is required' });
		required(schemaPath.email, { message: 'Email is required' });
		email(schemaPath.email, { message: 'Invalid email format' });
		required(schemaPath.dob, { message: 'Date of Birth is required' });
		required(schemaPath.age, { message: 'Age is required' });
		applyEach(schemaPath.child, (item) => {
			required(item.firstName, { message: 'First name is required' });
			required(item.email, { message: 'Email is required' });
			email(item.email, { message: 'Invalid email format' });
			required(item.dob, { message: 'Date of Birth is required' });
			required(item.age, { message: 'Age is required' });
			applyEach(item.school, (item) => {
				required(item.name, { message: 'Price value is required' });
				required(item.location, { message: 'Price value is required' });
			});
		});
	});

	formConfig: FormlyFormConfig = {
		formClass: 'tw:grid tw:grid-cols-2 tw:gap-4 tw:m-6',
		fields: [
			{
				key: 'firstName',
				type: 'textbox',
				fieldClass: 'tw:mb-3',
				control: this.formData.firstName,
				config: { label: 'First Name', required: true },
			},
			{
				key: 'lastName',
				type: 'textbox',
				fieldClass: 'tw:mb-3',
				control: this.formData.lastName,
				config: { label: 'Last Name' },
			},
			{
				key: 'email',
				type: 'textbox',
				fieldClass: 'tw:mb-3',
				control: this.formData.email,
				config: { label: 'E-Mail', required: true },
			},
			{
				key: 'dob',
				type: 'datepicker',
				fieldClass: 'tw:mb-3',
				control: this.formData.dob,
				config: {
					label: 'Date of Birth',
					required: true,
					/* datepicker: {
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
					}, */
				},
			},
			{
				key: 'birthPlace',
				type: 'dropdown',
				control: this.formData.birthPlace,
				onSelectionChange: (event: Event) => this.actionHandler(event),
				config: {
					label: 'Birth Place',
					required: true,
					options: {
						labelKey: 'name',
						data: [
							{ id: 'new-york', name: 'New York' },
							{ id: 'london', name: 'London' },
							{ id: 'tokyo', name: 'Tokyo' },
							{ id: 'paris', name: 'Paris' },
							{ id: 'sydney', name: 'Sydney' },
							{ id: 'berlin', name: 'Berlin' },
							{ id: 'toronto', name: 'Toronto' },
							{ id: 'seoul', name: 'Seoul' },
							{ id: 'rome', name: 'Rome' },
							{ id: 'dubai', name: 'Dubai' },
							{ id: 'singapore', name: 'Singapore' },
							{ id: 'amsterdam', name: 'Amsterdam' },
							{ id: 'los-angeles', name: 'Los Angeles' },
							{ id: 'barcelona', name: 'Barcelona' },
							{ id: 'vienna', name: 'Vienna' },
						],
					},
				},
			},
			{
				key: 'age',
				type: 'textbox',
				fieldClass: 'tw:mb-3',
				control: this.formData.age,
				config: { label: 'Age', required: true, textboxType: 'number' },
			},
			{
				key: 'hobbies',
				type: 'chip',
				fieldClass: 'tw:col-span-2',
				control: this.formData.hobbies,
				config: {
					label: 'Hobbies',
					options: {
						data: [
							'Reading books',
							'Playing football',
							'Cooking delicious meals',
							'Hiking in the mountains',
							'Painting landscapes',
							'Playing musical instruments',
							'Swimming',
							'Photography',
							'Gardening',
							'Traveling to new places',
							'Watching movies',
							'Playing video games',
							'Writing stories',
							'Yoga and meditation',
							'Cycling',
						],
					},
					chip: {
						draggable: true,
						removable: true,
						// allowInput: true,
						allowAutocomplete: true,
						inputPlaceholder: 'Add Hobby',
					},
				},
			},
			{
				key: 'child',
				type: 'array',
				title: 'Childs',
				control: this.formData.child,
				addBtnLabel: 'Add Child',
				fieldClass: 'tw:col-span-2',
				addClass: {
					div: 'tw:flex tw:justify-end tw:mt-3',
				},
				removeClass: {
					div: 'tw:flex tw:justify-end tw:my-3',
				},
				panelClass: {
					panel: 'tw:shadow-2xl tw:mb-3!',
					header: 'tw:bg-[var(--mat-sys-primary)]! tw:rounded-none!',
					title: 'tw:text-white!',
					content:
						'tw:grid tw:grid-cols-2 tw:gap-4 tw:border tw:border-gray-300 tw:solid tw:p-4 tw:rounded-xl',
				},
				addItem: {
					defaultObject: {
						firstName: '',
						lastName: '',
						email: '',
						dob: null,
						birthPlace: '',
						age: null,
						hobbies: [],
						school: [],
					},
				},
				fields: [
					{
						key: 'firstName',
						type: 'textbox',
						fieldClass: 'tw:mb-3',
						config: { label: 'First Name', required: true },
					},
					{
						key: 'lastName',
						type: 'textbox',
						fieldClass: 'tw:mb-3',
						config: { label: 'Last Name' },
					},
					{
						key: 'email',
						type: 'textbox',
						fieldClass: 'tw:mb-3',
						config: { label: 'E-Mail', required: true },
					},
					{
						key: 'dob',
						type: 'datepicker',
						fieldClass: 'tw:mb-3',
						config: {
							label: 'Date of Birth',
							required: true,
						},
					},
					{
						key: 'birthPlace',
						type: 'dropdown',
						onSelectionChange: (event: Event) => this.actionHandler(event),
						config: {
							label: 'Birth Place',
							required: true,
							options: {
								labelKey: 'name',
								data: [
									{ id: 'new-york', name: 'New York' },
									{ id: 'london', name: 'London' },
									{ id: 'tokyo', name: 'Tokyo' },
									{ id: 'paris', name: 'Paris' },
									{ id: 'sydney', name: 'Sydney' },
									{ id: 'berlin', name: 'Berlin' },
									{ id: 'toronto', name: 'Toronto' },
									{ id: 'seoul', name: 'Seoul' },
									{ id: 'rome', name: 'Rome' },
									{ id: 'dubai', name: 'Dubai' },
									{ id: 'singapore', name: 'Singapore' },
									{ id: 'amsterdam', name: 'Amsterdam' },
									{ id: 'los-angeles', name: 'Los Angeles' },
									{ id: 'barcelona', name: 'Barcelona' },
									{ id: 'vienna', name: 'Vienna' },
								],
							},
						},
					},
					{
						key: 'age',
						type: 'textbox',
						fieldClass: 'tw:mb-3',
						config: { label: 'Age', required: true, textboxType: 'number' },
					},
					{
						key: 'hobbies',
						type: 'chip',
						fieldClass: 'tw:col-span-2',
						config: {
							label: 'Hobbies',
							options: {
								data: [
									'Reading books',
									'Playing football',
									'Cooking delicious meals',
									'Hiking in the mountains',
									'Painting landscapes',
									'Playing musical instruments',
									'Swimming',
									'Photography',
									'Gardening',
									'Traveling to new places',
									'Watching movies',
									'Playing video games',
									'Writing stories',
									'Yoga and meditation',
									'Cycling',
								],
							},
							chip: {
								draggable: true,
								removable: true,
								allowInput: true,
								// allowAutocomplete: true,
								// inputPlaceholder: 'Add Hobby',
							},
						},
					},
					{
						key: 'school',
						type: 'array',
						title: 'School',
						addBtnLabel: 'Add School',
						fieldClass: 'tw:col-span-2',
						addClass: {
							div: 'tw:flex tw:justify-end tw:mt-3',
						},
						removeClass: {
							div: 'tw:flex tw:justify-end tw:my-3',
						},
						panelClass: {
							panel: 'tw:shadow-2xl tw:mb-3!',
							header: 'tw:bg-[var(--mat-sys-primary)]! tw:rounded-none!',
							title: 'tw:text-white!',
							content:
								'tw:grid tw:grid-cols-2 tw:gap-4 tw:border tw:border-gray-300 tw:solid tw:p-4 tw:rounded-xl',
						},
						addItem: {
							defaultObject: {
								name: '',
								location: '',
							},
						},
						fields: [
							{
								key: 'name',
								type: 'textbox',
								config: { label: 'School Name', required: true },
							},
							{
								key: 'location',
								type: 'dropdown',
								onSelectionChange: (event: Event) => this.actionHandler(event),
								config: {
									label: 'Location',
									required: true,
									options: {
										labelKey: 'name',
										data: [
											{ id: 'new-york', name: 'New York' },
											{ id: 'london', name: 'London' },
											{ id: 'tokyo', name: 'Tokyo' },
											{ id: 'paris', name: 'Paris' },
											{ id: 'sydney', name: 'Sydney' },
											{ id: 'berlin', name: 'Berlin' },
											{ id: 'toronto', name: 'Toronto' },
											{ id: 'seoul', name: 'Seoul' },
											{ id: 'rome', name: 'Rome' },
											{ id: 'dubai', name: 'Dubai' },
											{ id: 'singapore', name: 'Singapore' },
											{ id: 'amsterdam', name: 'Amsterdam' },
											{ id: 'los-angeles', name: 'Los Angeles' },
											{ id: 'barcelona', name: 'Barcelona' },
											{ id: 'vienna', name: 'Vienna' },
										],
									},
								},
							},
						],
					},
				] as FormlyField[],
			},
		] as FormlyField[],
	};

	submitBtn: ButtonModel = {
		text: 'Submit',
		appearance: 'flat',
		buttonClass: 'tw:my-8 tw:w-full',
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
			this.submitBtn.loading?.set(true);
			console.log('@@@', this.formModel());
			setTimeout(() => this.submitBtn.loading?.set(false), 300);
		});
	}
}
