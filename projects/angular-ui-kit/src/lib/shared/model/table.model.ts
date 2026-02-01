import { SelectionModel } from '@angular/cdk/collections';
import { signal } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

type DataType = 'date' | 'number' | 'title' | 'currency' | 'custom' | '';
const TablePageIndexDefaultConst = 0;
const TablePageSizeDefaultConst = 10;

export class TableModel {
	public columns: {
		key: string;
		label: string;
		sortable: boolean;
	}[];
	public dataSource: any[];
	public dataTotal: number;
	public pageIndex: number;
	public pageSize: number;
	public sortActive: string = '';
	public sortDirection: 'asc' | 'desc' | '';
	public selection: SelectionModel<any> = new SelectionModel<any>(true, []);
	public tableClass: string = '';

	isHttpPagination = signal(true);
	isPagination = signal(true);
	isSorter = signal(true);
	isLoading = signal(false);
	selectedOptionId = signal<string | number | null>(null);
	filters: { [key: string]: any } = {};
	dataType: {
		[key: string]: {
			type: DataType;
			format?: string;
			currency?: string;
			locale?: string;
			minimumFractionDigits?: number;
			maximumFractionDigits?: number;
		};
	} = {};

	constructor() {
		this.columns = [];
		this.dataSource = [];
		this.dataTotal = 0;
		this.pageIndex = TablePageIndexDefaultConst;
		this.pageSize = TablePageSizeDefaultConst;
		this.sortDirection = 'asc';
	}

	public generateDataType() {
		if (this.dataSource.length === 0) return;

		for (const key in this.dataSource[0]) {
			const keyValue = this.dataSource[0][key];

			if (!this.columns.some((t) => t.key === key)) continue;

			let dataType: DataType = '';
			if (keyValue instanceof Date) {
				dataType = 'date';
			} else if (typeof keyValue === 'number') {
				dataType = 'number';
			} else if (typeof keyValue === 'string') {
				dataType = 'title';
			} else {
				dataType = '';
			}

			this.dataType[key] = { type: dataType };
		}

		return this;
	}

	public isEmpty(): boolean {
		return this.dataSource?.length === 0;
	}

	public resetPage() {
		this.pageIndex = TablePageIndexDefaultConst;
		this.pageSize = TablePageSizeDefaultConst;
		this.sortActive = '';
		this.sortDirection = 'asc';
	}

	public resetDataSource() {
		this.resetPage();

		this.dataSource = [];
		this.dataTotal = 0;
	}

	isSelected(row: any): boolean {
		return this.selection.isSelected(row);
	}

	selectRow(row: any): void {
		this.selection.toggle(row);
	}

	selectAll(isChecked: boolean): void {
		if (!isChecked) {
			this.selection.clear();
			return;
		}

		if (this.dataSource instanceof MatTableDataSource) {
			this.selection.select(...this.dataSource.data);
			return;
		}

		this.selection.select(...this.dataSource);
	}
}
