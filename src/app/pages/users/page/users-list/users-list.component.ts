import {
	ApiService,
	ButtonComponent,
	TableComponent,
	TableModel,
	TextboxComponent,
} from '@devkitify/angular-ui-kit';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { API_URL } from '../../../../app.const';
import { IViewList, VIEW_LIST_FORM } from '../../../../shared/const/search';
import { USERS_TABLE } from '../../../../shared/const/table/user';

@Component({
	selector: 'app-users-list',
	imports: [MatCheckboxModule, MatIconModule, TextboxComponent, ButtonComponent, TableComponent],
	templateUrl: './users-list.component.html',
	styleUrl: './users-list.component.scss',
})
export class UsersListComponent {
	#router = inject(Router);
	#activatedRoute = inject(ActivatedRoute);
	#apiService = inject(ApiService);

	serverSide: TableModel = USERS_TABLE;
	formList: IViewList = VIEW_LIST_FORM('Search by username', 'Add New User');
	searchControl: FormControl = new FormControl('');
	params: Record<string, any> = {};

	constructor() {
		this.#getUsers();
	}

	#getUsers(): void {
		this.serverSide.isLoading.set(true);
		this.#apiService.get(API_URL + '/users', this.params).subscribe({
			next: (resp: any) => {
				this.serverSide.dataSource = resp as any[];
				this.serverSide.dataTotal = (resp as any[]).length;
				this.serverSide.generateDataType();
				this.serverSide.dataType = {
					...this.serverSide.dataType,
					selection: {
						type: 'custom',
					},
					actions: {
						type: 'custom',
					},
				};
			},
			complete: () => this.serverSide.isLoading.set(false),
			error: () => this.serverSide.isLoading.set(false),
		});
	}

	onRowSelection(row: any): void {
		this.serverSide.selectRow(row);
	}

	onAllSelection(isChecked: boolean): void {
		this.serverSide.selectAll(isChecked);
	}

	sortChange(event: Sort): void {
		this.serverSide.sortActive = event.active;
		this.serverSide.sortDirection = event.direction;
	}

	pageChange(event: any): void {
		console.log(event);
	}

	onInputChange(): void {
		this.params['username'] = this.searchControl.value;
		this.#getUsers();
	}

	onAction(): void {
		console.log('--- Action Clicked ---');
	}

	navigateToAdd(): void {
		this.#router.navigate(['./add'], {
			relativeTo: this.#activatedRoute,
		});
	}
}
