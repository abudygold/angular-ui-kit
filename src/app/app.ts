import { HttpClient } from '@angular/common/http';
import { Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { applyEach, email, form, required, submit } from '@angular/forms/signals';
import { Sort } from '@angular/material/sort';
import { RouterOutlet } from '@angular/router';
import {
	Autocomplete,
	Button,
	ButtonModel,
	Formly,
	FormlyFormConfig,
	Table,
	TableModel,
} from '@devkitify/angular-ui-kit';
import { DUMMY_CUSTOM_TYPE, DUMMY_TABLE, FormConfig, IExample } from './app.const';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet, Autocomplete, Formly, Table, Button],
	templateUrl: './app.html',
	styleUrl: './app.css',
	encapsulation: ViewEncapsulation.None,
})
export class App {
	#http = inject(HttpClient);

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

	formConfig: FormlyFormConfig = FormConfig(this.formData, (event: any) =>
		this.actionHandler(event),
	);

	submitBtn: ButtonModel = {
		text: 'Submit',
		appearance: 'flat',
		buttonClass: 'tw:my-8 tw:w-full',
		loading: signal<boolean>(false),
		onClick: () => this.onSubmit(),
		// onClick: (event: Event) => this.onSubmit(event, this.formModel()),
		// onClick: (event: Event) =>
		// 	this.onClickedHandler({
		// 		form: this.formModel(event, this.formModel()),
		// 	}),
	};

	tableModel: TableModel = DUMMY_TABLE;

	constructor() {
		this.fetchData();
	}

	fetchData(): void {
		this.tableModel.isLoading.set(true);

		this.#http
			.get(`https://example.com`, {
				params: {
					pageNo: this.tableModel.pageIndex + 1,
					itemPerPage: this.tableModel.pageSize,
				},
				headers: {
					Authorization: 'Bearer ',
				},
			})
			.subscribe({
				next: (res: any) => {
					this.tableModel.dataSource = res?.data?.list || [];
					this.tableModel.hasNext(res?.data?.hasNext || false);
					this.tableModel.pageIndex === 0 && this.tableModel.generateDataType();
					console.log(this.tableModel.dataTotal);
				},
				complete: () => {
					this.tableModel.dataType = {
						...this.tableModel.dataType,
						...(DUMMY_CUSTOM_TYPE as object),
					};

					this.tableModel.isLoading.set(false);
				},
				error: () => this.tableModel.isLoading.set(false),
			});
	}

	sortChange(event: Sort): void {
		this.tableModel.sortActive = event.active;
		this.tableModel.sortDirection = event.direction;
	}

	pageChange(event: any): void {
		this.tableModel.pageIndex = event.pageIndex;
		this.tableModel.pageSize = event.pageSize;
		this.fetchData();
	}

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
