import { HttpClient } from '@angular/common/http';
import { Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { applyEach, email, form, required, submit } from '@angular/forms/signals';
import { Sort } from '@angular/material/sort';
import { RouterOutlet } from '@angular/router';
import {
	Button,
	ButtonModel,
	Formly,
	FormlyFormConfig,
	Table,
	TableModel,
} from '@devkitify/angular-ui-kit';
import { BLOG_CATEGORY_CUSTOM_TYPE, BLOG_CATEGORY_TABLE, FormConfig, IExample } from './app.const';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet, Formly, Table, Button],
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

	tableModel: TableModel = BLOG_CATEGORY_TABLE;

	constructor() {
		this.fetchData();
	}

	fetchData(): void {
		this.tableModel.isLoading.set(true);

		this.#http
			.get(
				`http://localhost:3000/categories?page=${this.tableModel.pageIndex + 1}&limit=${this.tableModel.pageSize}`,
			)
			.subscribe({
				next: (res: any) => {
					// this.tableModel.dataSource = res?.data?.rows || [];
					// this.tableModel.dataTotal = res?.data?.pagination?.total || 0;
					this.tableModel.dataSource = [
						{
							id: '41cea05a-b195-4cb6-a993-aabfa9ab2857',
							label: 'Double',
							value: 'double',
							code: 'ROOM_TYPE',
							createdAt: '2026-02-12T16:33:14.602Z',
							updatedAt: null,
							deletedAt: null,
						},
						{
							id: '273439b9-5c2d-4721-9f94-4cfedc53ac79',
							label: 'Triple',
							value: 'triple',
							code: 'ROOM_TYPE',
							createdAt: '2026-02-12T16:32:50.307Z',
							updatedAt: null,
							deletedAt: null,
						},
						{
							id: '9e1b959a-9310-43c2-885a-597d4b289335',
							label: 'Quad',
							value: 'quad',
							code: 'ROOM_TYPE',
							createdAt: '2026-02-12T16:32:38.691Z',
							updatedAt: null,
							deletedAt: null,
						},
						{
							id: '53532ecc-1d74-4cbe-8b46-7b0d5646ab85',
							label: 'Bintang 5',
							value: '5',
							code: 'HOTEL_STAR',
							createdAt: '2026-02-12T15:42:13.376Z',
							updatedAt: '2026-02-12T15:43:16.637Z',
							deletedAt: null,
						},
						{
							id: '77b02188-831a-4044-83ed-685bfa805db5',
							label: 'Bintang 4',
							value: '4',
							code: 'HOTEL_STAR',
							createdAt: '2026-02-12T15:42:02.036Z',
							updatedAt: null,
							deletedAt: null,
						},
						{
							id: '17607b50-856c-4d4c-a7a2-3dff19ec2c21',
							label: 'Bintang 3',
							value: '3',
							code: 'HOTEL_STAR',
							createdAt: '2026-02-12T15:41:49.165Z',
							updatedAt: null,
							deletedAt: null,
						},
						{
							id: '0ce1f3cf-b538-4139-91d4-afc9da954bc8',
							label: 'Bintang 2',
							value: '2',
							code: 'HOTEL_STAR',
							createdAt: '2026-02-12T15:41:38.197Z',
							updatedAt: null,
							deletedAt: null,
						},
						{
							id: 'b3bde8b2-ee59-46d1-811f-7c46dddac00d',
							label: 'Bintang 1',
							value: '1',
							code: 'HOTEL_STAR',
							createdAt: '2026-02-12T15:41:29.358Z',
							updatedAt: null,
							deletedAt: null,
						},
						{
							id: '1f6704ba-6316-4393-8421-b323ad32e58d',
							label: 'Prince Mohammad Bin Abdulaziz International Airport (MED)',
							value: 'MED',
							code: 'LANDING',
							createdAt: '2026-02-12T15:33:30.596Z',
							updatedAt: null,
							deletedAt: null,
						},
						{
							id: '981e096b-6450-4435-90ba-6f225ec95530',
							label: 'King Abdulaziz International Airport (JED)',
							value: 'JED',
							code: 'LANDING',
							createdAt: '2026-02-12T15:32:56.984Z',
							updatedAt: null,
							deletedAt: null,
						},
						{
							id: '8d95f3ce-dacc-404a-8ebd-86e0608c3be2',
							label: 'Soekarno-Hatta International Airport (CGK)',
							value: 'CGK',
							code: 'LANDING',
							createdAt: '2026-02-12T15:31:46.037Z',
							updatedAt: null,
							deletedAt: null,
						},
						{
							id: 'bbfec931-d80b-4f2b-9ab2-ae3f1223eb0b',
							label: 'Lion Air',
							value: 'Lion Air',
							code: 'AIRLINE',
							createdAt: '2026-02-12T07:24:11.770Z',
							updatedAt: null,
							deletedAt: null,
						},
						{
							id: 'a96ae841-f46a-4677-aade-c45faa2fcbfc',
							label: 'Turkish Airlines',
							value: 'Turkish Airlines',
							code: 'AIRLINE',
							createdAt: '2026-02-12T07:24:02.473Z',
							updatedAt: null,
							deletedAt: null,
						},
						{
							id: 'ab54d456-2955-4f40-a869-d8a88be99fdf',
							label: 'Etihad Airways',
							value: 'Etihad Airways',
							code: 'AIRLINE',
							createdAt: '2026-02-12T07:23:44.921Z',
							updatedAt: null,
							deletedAt: null,
						},
						{
							id: 'b5dc8452-ce1f-4dba-985d-a023a141f62e',
							label: 'Qatar Airways',
							value: 'Qatar Airways',
							code: 'AIRLINE',
							createdAt: '2026-02-12T07:23:35.977Z',
							updatedAt: null,
							deletedAt: null,
						},
						{
							id: 'c1d64a23-757e-4d52-b9c1-e519317fdbc1',
							label: 'Saudia Airlines',
							value: 'Saudia Airlines',
							code: 'AIRLINE',
							createdAt: '2026-02-12T07:22:55.154Z',
							updatedAt: null,
							deletedAt: null,
						},
						{
							id: '5eb4c9aa-14b1-4ca1-a1f8-b0fa7c21f894',
							label: 'Garuda Indonesia',
							value: 'Garuda Indonesia',
							code: 'AIRLINE',
							createdAt: '2026-02-12T07:22:28.074Z',
							updatedAt: null,
							deletedAt: null,
						},
						{
							id: '706ba008-ba32-4393-9be1-4d80e6ff5081',
							label: 'Transit',
							value: 'transit',
							code: 'FLIGHT_TYPE',
							createdAt: '2026-02-12T07:00:16.843Z',
							updatedAt: null,
							deletedAt: null,
						},
						{
							id: '1bee8e65-4bef-42cd-a78d-37390e8b472b',
							label: 'Direct',
							value: 'direct',
							code: 'FLIGHT_TYPE',
							createdAt: '2026-02-12T07:00:07.960Z',
							updatedAt: null,
							deletedAt: null,
						},
						{
							id: '9ce5d1c9-01b4-4faa-bc1f-36d4b29f7319',
							label: 'Private',
							value: 'private',
							code: 'UMRAH_TYPE',
							createdAt: '2026-02-12T06:59:51.833Z',
							updatedAt: null,
							deletedAt: null,
						},
						{
							id: '934e8f2b-dabe-41a2-9760-5b06a47f505c',
							label: 'Plus',
							value: 'plus',
							code: 'UMRAH_TYPE',
							createdAt: '2026-02-12T06:59:36.378Z',
							updatedAt: null,
							deletedAt: null,
						},
						{
							id: '17b38620-a8c2-4ec5-aa4d-edc56266ecfd',
							label: 'Regular',
							value: 'regular',
							code: 'UMRAH_TYPE',
							createdAt: '2026-02-12T06:57:12.152Z',
							updatedAt: null,
							deletedAt: null,
						},
						{
							id: '1e3b9a21-b6f8-4cf4-9382-4c121f48598a',
							label: 'Umrah dan Haji',
							value: 'UMRAH_HAJI',
							code: 'BLOG',
							createdAt: '2026-02-08T21:34:38.208Z',
							updatedAt: null,
							deletedAt: null,
						},
					];
					this.tableModel.dataTotal = this.tableModel.dataSource.length || 0;
					this.tableModel.generateDataType();
				},
				complete: () => {
					this.tableModel.dataType = {
						...this.tableModel.dataType,
						...(BLOG_CATEGORY_CUSTOM_TYPE as any),
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
