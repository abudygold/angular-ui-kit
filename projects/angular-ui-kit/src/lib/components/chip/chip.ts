import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	MatAutocompleteModule,
	MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormlyField } from '../../shared/model';

@Component({
	selector: 'lib-chip',
	imports: [
		FormsModule,
		MatInputModule,
		MatChipsModule,
		MatAutocompleteModule,
		MatIconModule,
		CdkDropList,
		CdkDrag,
	],
	templateUrl: './chip.html',
	styleUrl: './chip.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Chip {
	readonly separatorKeysCodes: number[] = [ENTER, COMMA];

	field = input.required<FormlyField>();

	filteredOptions = computed(() => {
		if (!(this.field().config.options?.data || [])) return [];

		const valueKey = this.field().config.options?.valueKey;

		const selected = new Set(
			(this.field().control().value() as any).map((c: any) => (valueKey ? c[valueKey] : c)),
		);
		return [...(this.field().config.options?.data || [])].filter(
			(o) => !selected.has(valueKey ? o[valueKey] : o),
		);
	});

	addFromInput(event: MatChipInputEvent) {
		const value = (event.value || '').trim();
		const valueKey = this.field().config.options?.valueKey;

		if (!value) return;

		this.field()
			.control()
			.value.update((list: any) => [...list, valueKey ? { [valueKey]: value } : value]);
	}

	addFromAutocomplete(event: MatAutocompleteSelectedEvent) {
		const value = event.option.viewValue;
		const valueKey = this.field().config.options?.valueKey;

		this.field()
			.control()
			.value.update((list: any) => [...list, valueKey ? { [valueKey]: value } : value]);
	}

	onRemove(chip: any) {
		const valueKey = this.field().config.options?.valueKey;

		this.field()
			.control()
			.value.update((list: any) =>
				list.filter((c: any) =>
					valueKey
						? c[valueKey]?.toLowerCase() !== chip[valueKey]?.toLowerCase()
						: c?.toLowerCase() !== chip?.toLowerCase(),
				),
			);
	}

	onDrop(event: CdkDragDrop<any[]>) {
		this.field()
			.control()
			.value.update((list: any) => {
				const copy = [...list];
				moveItemInArray(copy, event.previousIndex, event.currentIndex);
				return copy;
			});
	}
}
