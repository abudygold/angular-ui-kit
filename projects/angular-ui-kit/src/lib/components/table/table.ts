import { CommonModule, NgTemplateOutlet } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	ContentChild,
	input,
	output,
	TemplateRef,
	ViewChild,
} from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TableModel } from '../../shared/model';
import { CurrencyIntlPipe } from '../../shared/pipes';
import { Pagination } from './pagination';

interface IPagination {
	pageIndex: number;
	pageSize: number;
}

@Component({
	selector: 'lib-table',
	imports: [
		NgTemplateOutlet,
		CommonModule,
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
export class Table {
	sortChange = output<Sort>();
	pageChange = output<IPagination>();
	mouseOverChange = output<any>();
	selectData = output<any>();

	dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

	config = input.required<TableModel>();

	@ViewChild(MatSort) sort!: MatSort;

	@ContentChild('selectionTemplate')
	public selectionTemplate!: TemplateRef<any> | null;

	@ContentChild('customTemplate')
	public customTemplate!: TemplateRef<any> | null;

	public disableClick(event: Event, tableKey: string) {
		(tableKey === 'action' || tableKey === 'selection') && event.stopPropagation();
	}

	public displayValue(value: any): any {
		return value !== null && value !== undefined ? value : '-';
	}

	public getPropertyValue(obj: any, key: string): any {
		if (!key) return obj;

		const props = key.split('.');

		for (let i = 0; i < props.length; i++) {
			if (obj === null || obj === undefined) {
				return 'N/A';
			}
			obj = obj[props[i]];
		}

		return obj !== undefined ? obj : null;
	}

	get headerRow(): string[] {
		return this.config().columns.map((c) => c.key);
	}

	fetchBootstrapData(): MatTableDataSource<any> {
		const { dataSource, pageIndex, pageSize } = this.config();
		const start = pageIndex * pageSize;
		const end = start + pageSize;

		this.dataSource = new MatTableDataSource<any>(dataSource.slice(start, end));
		this.dataSource.sort = this.sort;
		return this.dataSource;
	}

	onPageChange(page: IPagination): void {
		if (!page) return;

		if (this.config().isServerSide()) {
			this.config().isLoading.set(true);
			this.pageChange.emit(page);
			return;
		}

		this.config().pageIndex = page.pageIndex;
		this.config().pageSize = page.pageSize;
		this.fetchBootstrapData();
	}
}
