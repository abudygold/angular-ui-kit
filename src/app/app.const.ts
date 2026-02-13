import { FieldTree } from '@angular/forms/signals';
import { FormlyField, FormlyFormConfig, TableModel } from '@devkitify/angular-ui-kit';

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

export const BLOG_CATEGORY_CUSTOM_TYPE = {
	label: {
		type: '',
	},
	value: {
		type: '',
	},
	createdAt: {
		type: 'date',
		format: 'dd MMM yyyy',
	},
	updatedAt: {
		type: 'date',
		format: 'dd MMM yyyy',
	},
};

export const BLOG_CATEGORY_TABLE: TableModel = new TableModel();
BLOG_CATEGORY_TABLE.columns = [
	{
		key: 'label',
		label: 'Label',
		sortable: true,
	},
	{
		key: 'value',
		label: 'Value',
		sortable: true,
	},
	{
		key: 'code',
		label: 'Code',
		sortable: true,
	},
	{
		key: 'createdAt',
		label: 'Created At',
		sortable: true,
	},
	{
		key: 'updatedAt',
		label: 'Updated At',
		sortable: true,
	},
];
BLOG_CATEGORY_TABLE.sortActive = 'createdAt';
BLOG_CATEGORY_TABLE.sortDirection = 'desc';
BLOG_CATEGORY_TABLE.isServerSide.set(false);
BLOG_CATEGORY_TABLE.isPagination.set(true);

export const FormConfig = (
	formData: FieldTree<IExample, string | number>,
	actionHandler: Function,
): FormlyFormConfig => ({
	formClass: 'tw:grid tw:grid-cols-2 tw:gap-4 tw:m-6',
	fields: [
		{
			key: 'firstName',
			type: 'textbox',
			fieldClass: 'tw:mb-3',
			control: formData.firstName,
			config: { label: 'First Name', required: true },
		},
		{
			key: 'lastName',
			type: 'textbox',
			fieldClass: 'tw:mb-3',
			control: formData.lastName,
			config: { label: 'Last Name' },
		},
		{
			key: 'email',
			type: 'textbox',
			fieldClass: 'tw:mb-3',
			control: formData.email,
			config: { label: 'E-Mail', required: true },
		},
		{
			key: 'dob',
			type: 'datepicker',
			fieldClass: 'tw:mb-3',
			control: formData.dob,
			dateChange: (event: Event) => actionHandler(event),
			config: {
				label: 'Date of Birth',
				required: true,
				// datepicker: {
				// 	minDate: new Date(),
				// 	dateClass: (cellDate, view) => {
				// 		// Only highligh dates inside the month view.
				// 		if (view === 'month') {
				// 			const date = cellDate.getDate();

				// 			// Highlight the 1st and 20th day of each month.
				// 			return date === 1 || date === 20
				// 				? 'tw:bg-orange-500! tw:rounded-full'
				// 				: '';
				// 		}

				// 		return '';
				// 	},
				// 	filterDate: (d: Date | null): boolean => {
				// 		const day = (d || new Date()).getDay();
				// 		// Prevent Saturday and Sunday from being selected.
				// 		return day !== 0 && day !== 6 && day !== 4;
				// 	},
				// },
			},
		},
		{
			key: 'birthPlace',
			type: 'dropdown',
			control: formData.birthPlace,
			onChange: (event: Event) => actionHandler(event),
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
			control: formData.age,
			config: { label: 'Age', required: true, textboxType: 'number' },
		},
		{
			key: 'hobbies',
			type: 'chip',
			fieldClass: 'tw:col-span-2',
			control: formData.hobbies,
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
			control: formData.child,
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
					onChange: (event: Event) => actionHandler(event),
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
							onChange: (event: Event) => actionHandler(event),
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
});
