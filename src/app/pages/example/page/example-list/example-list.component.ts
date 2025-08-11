import {
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
import { IViewList, VIEW_LIST_FORM } from '../../../../shared/const/search';
import { EXAMPLE_DUMMY_DATA, EXAMPLES_TABLE } from '../../../../shared/const/table/example';

@Component({
	selector: 'app-example-list',
	imports: [MatCheckboxModule, MatIconModule, TextboxComponent, ButtonComponent, TableComponent],
	templateUrl: './example-list.component.html',
	styleUrl: './example-list.component.scss',
})
export class ExampleListComponent {
	#router = inject(Router);
	#activatedRoute = inject(ActivatedRoute);

	clientSide: TableModel = EXAMPLES_TABLE;
	formList: IViewList = VIEW_LIST_FORM('Search by name');
	searchControl: FormControl = new FormControl('');

	onRowSelection(row: any): void {
		this.clientSide.selectRow(row);
	}

	onAllSelection(isChecked: boolean): void {
		this.clientSide.selectAll(isChecked);
	}

	sortChange(event: Sort): void {
		this.clientSide.sortActive = event.active;
		this.clientSide.sortDirection = event.direction;
	}

	pageChange(event: any): void {
		console.log(event);
	}

	onInputChange(): void {
		this.clientSide.isLoading.set(true);

		if (!this.searchControl.value) {
			this.clientSide.dataSource = EXAMPLE_DUMMY_DATA;
			this.clientSide.dataTotal = this.clientSide.dataSource.length;
			this.clientSide.isLoading.set(false);
			return;
		}

		setTimeout(() => {
			this.clientSide.dataSource = this.clientSide.dataSource.filter(d =>
				d.name?.toLowerCase().includes(this.searchControl.value?.toLowerCase()),
			);
			this.clientSide.dataTotal = this.clientSide.dataSource.length;
			this.clientSide.isLoading.set(false);
		}, 2000);
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
