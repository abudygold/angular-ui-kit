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

	isServerSide = signal(true);
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
			if (this.isValidDateFormat(keyValue)) {
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

		console.log('this.dataType', this);

		return this;
	}

	/* isValidDate(value: unknown): boolean {
		if (value instanceof Date) {
			return !isNaN(value.getTime());
		}

		if (typeof value === 'string') {
			// Check if string matches common date formats (ISO, timestamp, etc.)
			const dateRegex = /^\d{4}-\d{2}-\d{2}|^\d{1,2}\/\d{1,2}\/\d{4}|^\d{10,13}$/;
			if (!dateRegex.test(value)) {
				return false;
			}
			const d = new Date(value);
			return !isNaN(d.getTime());
		}

		if (typeof value === 'number') {
			const d = new Date(value);
			return !isNaN(d.getTime());
		}

		return false;
	} */

	/**
	 * Memvalidasi format tanggal (ISO, YYYY-MM-DD, MM/DD/YYYY, dll)
	 * Mengabaikan format Epoch/Timestamp murni.
	 */
	isValidDateFormat(dateInput: any): boolean {
		// 1. Tolak jika bukan string atau input murni angka (Epoch)
		if (typeof dateInput !== 'string' || !isNaN(Number(dateInput))) {
			return false;
		}

		// 2. Tambahkan Filter Regex: Harus mengandung pemisah tanggal umum
		// Minimal ada 2 angka dan pemisah seperti / - atau .
		// Contoh: 2024-01-01 atau 01/01/2024
		const datePattern = /^[0-9]{1,4}[.\-\/][0-9]{1,2}[.\-\/][0-9]{1,4}/;
		const isStandardFormat = datePattern.test(dateInput.trim());

		// Jika tidak sesuai pola umum, cek apakah ini format Long Date (Jan 1, 2024)
		const isLongDate = /^[A-Za-z]{3,}\s\d{1,2},?\s\d{4}/.test(dateInput.trim());

		if (!isStandardFormat && !isLongDate) {
			return false;
		}

		// 3. Jika lolos regex, baru cek validitas kalender
		const parsedDate = new Date(dateInput);
		return !isNaN(parsedDate.getTime());
	}

	isEmpty(): boolean {
		return this.dataSource?.length === 0;
	}

	resetPage() {
		this.pageIndex = TablePageIndexDefaultConst;
		this.pageSize = TablePageSizeDefaultConst;
		this.sortActive = '';
		this.sortDirection = 'asc';
	}

	resetDataSource() {
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

	hasNext(hasNext: boolean): void {
		if (!hasNext && this.pageIndex <= 1) {
			this.dataTotal = this.dataSource?.length ?? 0;
			return;
		}

		this.dataTotal =
			this.pageIndex === 1 ? this.pageSize * 2 : this.pageSize * (this.pageIndex + 1);

		const diffData = this.pageSize - this.dataSource?.length;

		/* totalData substracted by diffData if data < pageSize  */
		if (diffData !== 0) this.dataTotal -= diffData;

		/* totalData substracted by pageSize if isNext false */
		if (!hasNext) this.dataTotal -= this.pageSize;
	}
}
