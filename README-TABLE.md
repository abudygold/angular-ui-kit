## Usage: TableComponent

The `TableComponent` lets you easily display tabular data in your Angular application.

### 1. Define Table Constants

Create a constants file to define your table configuration, for example at `/shared/const/table/user/table.ts`:

```typescript
import { TableModel } from '@devkitify/angular-ui-kit';

export const EXAMPLE_TABLE: TableModel = new TableModel();
EXAMPLE_TABLE.columns = [
	{
		key: 'selection',
		label: '',
		sortable: false,
	},
	{
		key: 'name',
		label: 'Name',
		sortable: true,
	},
	{
		key: 'username',
		label: 'Username',
		sortable: true,
	},
	{
		key: 'email',
		label: 'Email',
		sortable: true,
	},
	{
		key: 'total',
		label: 'Total',
		sortable: true,
	},
	{
		key: 'createdDate',
		label: 'Created Date',
		sortable: true,
	},
	{
		key: 'actions',
		label: 'Actions',
		sortable: false,
	},
];
EXAMPLE_TABLE.sortActive = 'name';
EXAMPLE_TABLE.sortDirection = 'asc';
EXAMPLE_TABLE.isHttpPagination.set(false);
```

This file centralizes your table's column definitions and initial configuration for easy reuse.

### 2. Prepare Your Data

Define your table data and columns in your component:

```typescript
import { TableModel, TableComponent, ApiService } from '@devkitify/angular-ui-kit';

@Component({
	imports: [TableComponent, TableModel, ApiService],
})
export class ExampleComponent {
	#apiService = inject(ApiService);

	tableConfig: TableModel = EXAMPLE_TABLE;
	params: Record<string, any> = {};

	constructor() {
		this.#getUsers();
	}

	#getUsers(): void {
		this.tableConfig.isLoading.set(true);
		this.#apiService.get(API_URL + '/users', this.params).subscribe({
			next: (resp: any) => {
				this.tableConfig.dataSource = resp as any[];
				this.tableConfig.dataTotal = (resp as any[]).length;
				this.tableConfig.generateDataType();
				this.tableConfig.dataType = {
					...this.tableConfig.dataType,
					selection: {
						type: 'custom',
					},
					total: {
						type: 'currency',
						currency: 'USD',
						locale: 'en-US',
						minimumFractionDigits: 0,
						maximumFractionDigits: 0,
					},
					createdDate: {
						type: 'date',
						format: 'M/d/yyyy hh:mma',
					},
					actions: {
						type: 'custom',
					},
				};
			},
			complete: () => this.tableConfig.isLoading.set(false),
			error: () => this.tableConfig.isLoading.set(false),
		});
	}

	onRowSelection(row: any): void {
		this.tableConfig.selectRow(row);
	}

	onAllSelection(isChecked: boolean): void {
		this.tableConfig.selectAll(isChecked);
	}

	sortChange(event: Sort): void {
		this.tableConfig.sortActive = event.active;
		this.tableConfig.sortDirection = event.direction;
	}

	pageChange(event: any): void {
		console.log(event);
	}

	onAction(): void {
		console.log('--- Action Clicked ---');
	}
}
```

### 3. Use in Template

Add the component to your template and bind your data:

```html
<lib-table
	[config]="tableConfig"
	(sortChange)="sortChange($event)"
	(pageChange)="pageChange($event)"
>
	<ng-template #customTemplate let-data="data" let-key="key">
		@if (key === 'selection') {
		<div [class.show-checkbox]="data.isSelected">
			<mat-checkbox
				class="check-box check__file"
				[checked]="tableConfig.isSelected(data)"
				(change)="onRowSelection(data)"
			/>
		</div>
		} @else if (key === 'actions') {
		<div class="tw-flex tw-gap-3">
			<mat-icon class="tw-cursor-pointer" (click)="onAction()">edit</mat-icon>
			<mat-icon class="tw-cursor-pointer" (click)="onAction()">delete</mat-icon>
		</div>
		}
	</ng-template>

	<ng-template #selectionTemplate>
		<div class="filter-list">
			<mat-checkbox class="check__file" (change)="onAllSelection($event.checked)" />
		</div>
	</ng-template>
</lib-table>
```

### 4. API

| Input              | Type                                                                                                            | Description                                                                                                      |
| ------------------ | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `columns`          | Array<{ key, label, sortable }>                                                                                 | List of column definitions to display and sort.                                                                  |
| `dataSource`       | any[]                                                                                                           | The raw data to be rendered in the table.                                                                        |
| `dataTotal`        | number                                                                                                          | Total number of rows (used for pagination).                                                                      |
| `pageIndex`        | number                                                                                                          | Current page index (starts from 0).                                                                              |
| `pageSize`         | number                                                                                                          | Number of items per page.                                                                                        |
| `sortActive`       | string                                                                                                          | Active sort key (column identifier).                                                                             |
| `sortDirection`    | 'asc' / 'desc'                                                                                                  | Current sort direction of the table. Use `'asc'` for ascending, `'desc'` for descending, or `''` for no sorting. |
| `selection`        | SelectionModel<any>                                                                                             | Angular CDK selection model for checkbox selection handling.                                                     |
| `tableClass`       | string                                                                                                          | Custom class for the table (used for styling).                                                                   |
| `isHttpPagination` | Signal<boolean>                                                                                                 | Whether pagination is handled via API.                                                                           |
| `isPagination`     | Signal<boolean>                                                                                                 | Toggle for enabling/disabling client-side pagination.                                                            |
| `isSorter`         | Signal<boolean>                                                                                                 | Toggle for enabling/disabling sorting UI.                                                                        |
| `isLoading`        | Signal<boolean>                                                                                                 | Indicates loading state of the table.                                                                            |
| `selectedOptionId` | Signal<string / number / null>                                                                                  | Reactive signal that holds the currently selected row's identifier, or `null` if no selection is made.           |
| `filters`          | FilterOptions                                                                                                   | Object used to store filter settings sent to the server.                                                         |
| `dataType`         | Record<string, { type: DataType, format?, currency?, locale?, minimumFractionDigits?, maximumFractionDigits? }> | Optional field configuration for formatting cells (e.g., date, currency).                                        |

---

## For more advanced usage:

- **Dynamic Column Formatting:** Use the dataType property to define custom display logic (like currency formatting or localized dates).
- **Reactive Integration:** All Signal-based properties (like isLoading, selectedOptionId) can be used inside Angular signals/effects for responsive, reactive table behavior.
- **Server-side Filtering:** Combine options with isHttpPagination to build query parameters for server-side filtering, sorting, and pagination.
- **Selection Handling:** Use selection.selected to track selected rows programmatically.
