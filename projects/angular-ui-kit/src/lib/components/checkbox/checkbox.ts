import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatLabel } from '@angular/material/form-field';
import { FormlyField } from '../../shared/model';
import {
	getFormlyArrayValue,
	getFormlyOptionsConfig,
	optionGenerator,
	updateFormlyArrayValue,
} from '../../shared/utils';

@Component({
	selector: 'lib-checkbox',
	imports: [MatLabel, MatCheckboxModule],
	templateUrl: './checkbox.html',
	styleUrl: './checkbox.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Checkbox {
	field = input.required<FormlyField>();

	normalizedOptions = computed(() => {
		return optionGenerator(getFormlyOptionsConfig(this.field()));
	});

	isAllSelected = computed(() => {
		const selected = getFormlyArrayValue(this.field());
		const values = this.normalizedOptions().map((option) => option.value);

		return values.length > 0 && values.every((value) => selected.includes(value));
	});

	isIndeterminate = computed(() => {
		const count = getFormlyArrayValue(this.field()).length;
		const total = this.normalizedOptions().length;

		return count > 0 && count < total;
	});

	isChecked(value: unknown): boolean {
		return getFormlyArrayValue(this.field()).includes(value);
	}

	toggle(value: unknown, event: MatCheckboxChange): void {
		updateFormlyArrayValue(this.field(), (current) =>
			event.checked ? [...current, value] : current.filter((item) => item !== value),
		);
		this.field().onChange?.(event);
	}

	toggleAll(event: MatCheckboxChange): void {
		const values = this.normalizedOptions().map((option) => option.value);

		this.field()
			.control()
			.value.set(event.checked ? values : []);
		this.field().onChange?.(event);
	}
}
