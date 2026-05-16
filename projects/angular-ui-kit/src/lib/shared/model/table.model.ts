import { SelectionModel } from '@angular/cdk/collections';
import { signal, WritableSignal } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

export type TableCellType = 'string' | 'date' | 'currency' | 'custom';
export type TableSortDirection = 'asc' | 'desc' | '';
export type TableRow = Record<string, unknown>;
export type TableDataSource<T extends TableRow = TableRow> = T[] | MatTableDataSource<T>;

export interface TableColumn {
	key: string;
	label: string;
	sortable?: boolean;
}

export interface TableCellConfig {
	type: TableCellType;
	format?: string;
	currency?: string;
	locale?: string;
	minimumFractionDigits?: number;
	maximumFractionDigits?: number;
}

export interface TablePageEvent {
	pageIndex: number;
	pageSize: number;
}

export interface TableModelOptions<T extends TableRow = TableRow> {
	columns?: TableColumn[];
	dataSource?: TableDataSource<T>;
	dataTotal?: number;
	pageIndex?: number;
	pageSize?: number;
	sortActive?: string;
	sortDirection?: TableSortDirection;
	selection?: SelectionModel<T>;
	tableClass?: string;
	filters?: Record<string, unknown>;
	dataType?: Record<string, TableCellConfig>;
	isServerSide?: boolean;
	isPagination?: boolean;
	isSorter?: boolean;
	isLoading?: boolean;
	selectedOptionId?: string | number | null;
}

export const TABLE_DEFAULT_PAGE_INDEX = 0;
export const TABLE_DEFAULT_PAGE_SIZE = 10;
export const TABLE_DEFAULT_CELL_CONFIG: TableCellConfig = { type: 'string' };

export class TableModel<T extends TableRow = TableRow> {
	public columns: TableColumn[] = [];
	public dataSource: TableDataSource<T> = [];
	public filteredData: T[] = [];
	public dataTotal = 0;
	public pageIndex = TABLE_DEFAULT_PAGE_INDEX;
	public pageSize = TABLE_DEFAULT_PAGE_SIZE;
	public sortActive: string = '';
	public sortDirection: TableSortDirection = 'asc';
	public selection: SelectionModel<T> = new SelectionModel<T>(true, []);
	public tableClass: string = '';
	public filters: Record<string, unknown> = {};
	public dataType: Record<string, TableCellConfig> = {};

	isServerSide: WritableSignal<boolean> = signal(true);
	isPagination: WritableSignal<boolean> = signal(true);
	isSorter: WritableSignal<boolean> = signal(true);
	isLoading: WritableSignal<boolean> = signal(false);
	selectedOptionId: WritableSignal<string | number | null> = signal<string | number | null>(null);

	constructor(options: TableModelOptions<T> = {}) {
		this.patch(options);
	}

	get rows(): T[] {
		return this.resolveRows(this.dataSource);
	}

	get columnKeys(): string[] {
		return this.columns.map((column) => column.key);
	}

	get defaultSortKey(): string {
		return this.columns.find((column) => column.sortable)?.key ?? this.columns.at(0)?.key ?? '';
	}

	patch(options: TableModelOptions<T>): this {
		this.columns = options.columns ?? this.columns;
		this.dataSource = options.dataSource ?? this.dataSource;
		this.filteredData = this.resolveRows(options.dataSource ?? this.filteredData);
		this.dataTotal = options.dataTotal ?? this.dataTotal;
		this.pageIndex = options.pageIndex ?? this.pageIndex;
		this.pageSize = options.pageSize ?? this.pageSize;
		this.sortActive = options.sortActive ?? this.sortActive;
		this.sortDirection = options.sortDirection ?? this.sortDirection;
		this.selection = options.selection ?? this.selection;
		this.tableClass = options.tableClass ?? this.tableClass;
		this.filters = options.filters ?? this.filters;
		this.dataType = options.dataType ?? this.dataType;

		this.setSignalValue(this.isServerSide, options.isServerSide);
		this.setSignalValue(this.isPagination, options.isPagination);
		this.setSignalValue(this.isSorter, options.isSorter);
		this.setSignalValue(this.isLoading, options.isLoading);
		this.setSignalValue(this.selectedOptionId, options.selectedOptionId);

		return this;
	}

	public generateDataType() {
		const firstRow = this.rows.at(0);
		if (!firstRow) return this;

		for (const key of Object.keys(firstRow)) {
			if (!this.columns.some((column) => column.key === key)) continue;

			let dataType: TableCellType = 'string';
			if (this.isValidDateFormat(firstRow[key])) {
				dataType = 'date';
			}

			this.dataType[key] = { type: dataType };
		}

		return this;
	}

	/**
	 * Memvalidasi format tanggal (ISO, YYYY-MM-DD, MM/DD/YYYY, dll)
	 * Mengabaikan format Epoch/Timestamp murni.
	 */
	isValidDateFormat(dateInput: unknown): boolean {
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
		return this.rows.length === 0;
	}

	resetPage(): this {
		this.pageIndex = TABLE_DEFAULT_PAGE_INDEX;
		this.pageSize = TABLE_DEFAULT_PAGE_SIZE;
		this.sortActive = '';
		this.sortDirection = 'asc';
		return this;
	}

	resetDataSource(): this {
		this.resetPage();

		this.dataSource = [];
		this.filteredData = [];
		this.dataTotal = 0;
		this.selection.clear();
		return this;
	}

	setColumns(columns: TableColumn[]): this {
		this.columns = columns;
		return this;
	}

	setDataSource(
		dataSource: TableDataSource<T>,
		dataTotal = this.resolveRows(dataSource).length,
	): this {
		this.dataSource = dataSource;
		this.filteredData = this.resolveRows(dataSource);
		this.dataTotal = dataTotal;
		return this;
	}

	setDataType(key: string, config: TableCellConfig): this {
		this.dataType[key] = config;
		return this;
	}

	getDataType(key: string): TableCellConfig {
		return this.dataType[key] ?? TABLE_DEFAULT_CELL_CONFIG;
	}

	getValue(row: T | unknown, key: string): unknown {
		if (!key) return row;

		return key.split('.').reduce<unknown>((value, segment) => {
			if (value === null || value === undefined || typeof value !== 'object') {
				return undefined;
			}

			return (value as Record<string, unknown>)[segment];
		}, row);
	}

	isSelected(row: T): boolean {
		return this.selection.isSelected(row);
	}

	selectRow(row: T): void {
		this.selection.toggle(row);
	}

	selectAll(isChecked: boolean): void {
		if (!isChecked) {
			this.selection.clear();
			return;
		}

		this.selection.select(...this.rows);
	}

	hasNext(hasNext: boolean): void {
		const currentPage = Math.max(this.pageIndex, 0) + 1;
		const currentLength = this.rows.length;

		if (hasNext) {
			this.dataTotal = (currentPage + 1) * this.pageSize;
			return;
		}

		this.dataTotal =
			currentPage > 1 ? (currentPage - 1) * this.pageSize + currentLength : currentLength;
	}

	private resolveRows(dataSource: TableDataSource<T> | T[]): T[] {
		return dataSource instanceof MatTableDataSource ? dataSource.data : dataSource;
	}

	private setSignalValue<Value>(target: WritableSignal<Value>, value: Value | undefined): void {
		if (value !== undefined) {
			target.set(value);
		}
	}
}
