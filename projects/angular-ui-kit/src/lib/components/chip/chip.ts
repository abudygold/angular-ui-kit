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
import {
	getFormlyArrayValue,
	getFormlyOptionsConfig,
	NormalizedOption,
	optionGenerator,
	updateFormlyArrayValue,
} from '../../shared/utils';

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

	normalizedOptions = computed(() => {
		return optionGenerator(getFormlyOptionsConfig(this.field()));
	});

	filteredOptions = computed(() => {
		const selected = new Set(
			getFormlyArrayValue(this.field()).map((chip) => this.getValue(chip)),
		);
		return this.normalizedOptions().filter((option) => !selected.has(option.value));
	});

	chips(): unknown[] {
		return getFormlyArrayValue(this.field());
	}

	addFromInput(event: MatChipInputEvent): void {
		const value = (event.value || '').trim();

		if (!value) return;

		updateFormlyArrayValue(this.field(), (list) => [...list, this.createCustomChip(value)]);
		this.field().onInput?.(event);
	}

	addFromAutocomplete(event: MatAutocompleteSelectedEvent): void {
		const option = event.option.value as NormalizedOption;

		updateFormlyArrayValue(this.field(), (list) => [...list, option.raw]);
		this.field().onChange?.(event);
	}

	onRemove(chip: unknown): void {
		const value = this.getValue(chip);

		updateFormlyArrayValue(this.field(), (list) =>
			list.filter((item) => this.getValue(item) !== value),
		);
	}

	onDrop(event: CdkDragDrop<unknown[]>): void {
		updateFormlyArrayValue(this.field(), (list) => {
			const copy = [...list];
			moveItemInArray(copy, event.previousIndex, event.currentIndex);
			return copy;
		});
	}

	getLabel(chip: unknown): string {
		const label = this.getConfiguredValue(chip, this.field().config.options?.labelKey);
		return String(label ?? chip ?? '');
	}

	getAvatar(chip: unknown): string | null {
		const avatar = this.getConfiguredValue(chip, this.field().config.options?.avatarKey);
		return avatar === undefined || avatar === null ? null : String(avatar);
	}

	private createCustomChip(value: string): unknown {
		const { labelKey, valueKey } = getFormlyOptionsConfig(this.field());

		if (!labelKey && !valueKey) return value;

		return {
			...(labelKey ? { [labelKey]: value } : {}),
			...(valueKey ? { [valueKey]: value } : {}),
		};
	}

	private getValue(chip: unknown): unknown {
		const configuredValue = this.getConfiguredValue(
			chip,
			getFormlyOptionsConfig(this.field()).valueKey,
		);
		return configuredValue ?? chip;
	}

	private getConfiguredValue(chip: unknown, key?: string): unknown {
		if (!key || chip === null || chip === undefined || typeof chip !== 'object') {
			return undefined;
		}

		return (chip as Record<string, unknown>)[key];
	}
}
