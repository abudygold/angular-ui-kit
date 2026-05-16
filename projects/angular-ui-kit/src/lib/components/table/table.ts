import { DatePipe, NgTemplateOutlet } from '@angular/common';
import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	ContentChild,
	DoCheck,
	input,
	output,
	TemplateRef,
} from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
	TableCellConfig,
	TableColumn,
	TableModel,
	TablePageEvent,
	TableRow,
} from '../../shared/model';
import { CurrencyIntlPipe } from '../../shared/pipes';
import { Pagination } from './pagination';

interface TableRenderState {
	dataSource: unknown;
	rows: readonly TableRow[];
	rowsLength: number;
	columns: readonly TableColumn[];
	pageIndex: number;
	pageSize: number;
	sortActive: string;
	sortDirection: string;
	isServerSide: boolean;
	isPagination: boolean;
	isSorter: boolean;
}

@Component({
	selector: 'lib-table',
	imports: [
		NgTemplateOutlet,
		DatePipe,
		CurrencyIntlPipe,
		MatTableModule,
		MatSortModule,
		MatProgressSpinnerModule,
		Pagination,
	],
	templateUrl: './table.html',
	styleUrl: './table.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Table implements AfterViewInit, DoCheck {
	sortChange = output<Sort>();
	pageChange = output<TablePageEvent>();
	mouseOverChange = output<TableRow | null>();
	selectData = output<TableRow>();

	dataSource: MatTableDataSource<TableRow> = new MatTableDataSource<TableRow>([]);

	config = input.required<TableModel>();

	@ContentChild('selectionTemplate')
	selectionTemplate!: TemplateRef<any> | null;

	@ContentChild('customTemplate')
	customTemplate!: TemplateRef<any> | null;

	@ContentChild('emptyStateTable')
	emptyStateTable!: TemplateRef<any> | null;

	private renderState: TableRenderState | null = null;
	private readonly clickSafeColumns = new Set(['action', 'actions', 'selection']);

	ngAfterViewInit(): void {
		this.syncDataSource(true);
	}

	ngDoCheck(): void {
		this.syncDataSource();
	}

	disableClick(event: Event, tableKey: string): void {
		if (this.clickSafeColumns.has(tableKey)) {
			event.stopPropagation();
		}
	}

	displayValue(value: any): any {
		return value !== null && value !== undefined ? value : '-';
	}

	getCellValue(table: TableModel, row: TableRow, key: string): any {
		return table.getValue(row, key);
	}

	getCellConfig(table: TableModel, key: string): TableCellConfig {
		return table.getDataType(key);
	}

	getCurrencyValue(value: unknown): number {
		if (typeof value === 'number') return value;
		if (typeof value === 'string' && value.trim() !== '') return Number(value);
		return 0;
	}

	getHeaderRow(table: TableModel): string[] {
		return table.columnKeys;
	}

	getSortActive(table: TableModel): string {
		if (!table.isSorter()) return '';
		return table.sortActive || table.defaultSortKey;
	}

	getSortDirection(table: TableModel): 'asc' | 'desc' | '' {
		return table.isSorter() ? table.sortDirection : '';
	}

	getTotalItems(table: TableModel): number {
		return table.isServerSide() ? table.dataTotal : table.rows.length;
	}

	isSortDisabled(table: TableModel, column: TableColumn): boolean {
		return !table.isSorter() || column.sortable === false;
	}

	onSortChange(sort: Sort): void {
		const table = this.config();
		table.sortActive = sort.active;
		table.sortDirection = sort.direction;

		if (!table.isServerSide()) {
			this.syncDataSource(true);
		}

		this.sortChange.emit(sort);
	}

	onPageChange(page: TablePageEvent): void {
		if (!page) return;

		const table = this.config();
		table.pageIndex = page.pageIndex;
		table.pageSize = page.pageSize;

		if (table.isServerSide()) {
			table.isLoading.set(true);
			this.pageChange.emit(page);
			return;
		}

		this.syncDataSource(true);
	}

	private syncDataSource(force = false): void {
		const table = this.config();
		const nextState = this.createRenderState(table);

		if (!force && this.isSameRenderState(nextState)) {
			return;
		}

		this.dataSource.data = this.getRenderedRows(table, nextState.rows);
		this.renderState = nextState;
	}

	private getRenderedRows(table: TableModel, rows: readonly TableRow[]): TableRow[] {
		if (table.isServerSide()) {
			return [...rows];
		}

		const sortedRows = this.sortRows(table, rows);
		return table.isPagination() ? this.getPaginatedRows(table, sortedRows) : sortedRows;
	}

	private sortRows(table: TableModel, rows: readonly TableRow[]): TableRow[] {
		const active = this.getSortActive(table);
		const direction = this.getSortDirection(table);

		if (!active || !direction) {
			return [...rows];
		}

		return [...rows].sort((firstRow, secondRow) => {
			const firstValue = table.getValue(firstRow, active);
			const secondValue = table.getValue(secondRow, active);
			const comparison = this.compareValues(firstValue, secondValue);

			return direction === 'asc' ? comparison : comparison * -1;
		});
	}

	private getPaginatedRows(table: TableModel, rows: TableRow[]): TableRow[] {
		const pageSize = Math.max(table.pageSize, 1);
		const maxPageIndex = Math.max(Math.ceil(rows.length / pageSize) - 1, 0);
		table.pageIndex = Math.min(Math.max(table.pageIndex, 0), maxPageIndex);

		const start = table.pageIndex * pageSize;
		return rows.slice(start, start + pageSize);
	}

	private compareValues(firstValue: unknown, secondValue: unknown): number {
		if (firstValue === secondValue) return 0;
		if (firstValue === null || firstValue === undefined) return 1;
		if (secondValue === null || secondValue === undefined) return -1;

		const firstDate = this.getDateTime(firstValue);
		const secondDate = this.getDateTime(secondValue);

		if (firstDate !== null && secondDate !== null) {
			return firstDate - secondDate;
		}

		if (typeof firstValue === 'number' && typeof secondValue === 'number') {
			return firstValue - secondValue;
		}

		return String(firstValue).localeCompare(String(secondValue), undefined, {
			numeric: true,
			sensitivity: 'base',
		});
	}

	private getDateTime(value: unknown): number | null {
		if (value instanceof Date) return value.getTime();
		if (typeof value !== 'string') return null;

		const parsedDate = new Date(value);
		const timestamp = parsedDate.getTime();

		return Number.isNaN(timestamp) ? null : timestamp;
	}

	private createRenderState(table: TableModel): TableRenderState {
		const rows = table.rows;

		return {
			dataSource: table.dataSource,
			rows,
			rowsLength: rows.length,
			columns: table.columns,
			pageIndex: table.pageIndex,
			pageSize: table.pageSize,
			sortActive: table.sortActive,
			sortDirection: table.sortDirection,
			isServerSide: table.isServerSide(),
			isPagination: table.isPagination(),
			isSorter: table.isSorter(),
		};
	}

	private isSameRenderState(nextState: TableRenderState): boolean {
		return (
			this.renderState !== null &&
			this.renderState.dataSource === nextState.dataSource &&
			this.renderState.rows === nextState.rows &&
			this.renderState.rowsLength === nextState.rowsLength &&
			this.renderState.columns === nextState.columns &&
			this.renderState.pageIndex === nextState.pageIndex &&
			this.renderState.pageSize === nextState.pageSize &&
			this.renderState.sortActive === nextState.sortActive &&
			this.renderState.sortDirection === nextState.sortDirection &&
			this.renderState.isServerSide === nextState.isServerSide &&
			this.renderState.isPagination === nextState.isPagination &&
			this.renderState.isSorter === nextState.isSorter
		);
	}
}
