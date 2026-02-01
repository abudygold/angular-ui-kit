import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable({
	providedIn: 'root',
})
export class CustomMatPaginatorIntl extends MatPaginatorIntl {
	override itemsPerPageLabel = 'Items per page:';

	override getRangeLabel = (page: number, pageSize: number, length: number): string => {
		if (length === 0 || pageSize === 0) {
			return `0 of ${length} Item`;
		}

		const startIndex = page * pageSize;
		const endIndex = Math.min(startIndex + pageSize, length);

		return `${startIndex + 1}–${endIndex} of a ${length} Item`;
	};
}
