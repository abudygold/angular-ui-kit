import { Component, computed, input } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatLabel } from '@angular/material/select';
import { FormlyField } from '../../shared/model';
import { optionGenerator } from '../../shared/utils';

@Component({
	selector: 'lib-checkbox',
	imports: [MatLabel, MatCheckboxModule],
	templateUrl: './checkbox.html',
	styleUrl: './checkbox.css',
})
export class Checkbox {
	field = input.required<FormlyField>();

	normalizedOptions = computed(() => {
		const _options = this.field().config.options;
		return optionGenerator(_options);
	});

	/* ---------- Select All State ---------- */

	isAllSelected = computed(() => {
		const values = this.normalizedOptions().map((o) => o.value);
		return (
			values.length > 0 &&
			values.every((v) => (this.field().control().value() as any).includes(v))
		);
	});

	isIndeterminate = computed(() => {
		const count = (this.field().control().value() as any).length;
		const total = this.normalizedOptions().length;
		return count > 0 && count < total;
	});

	/* ---------- Handlers ---------- */

	toggle(value: any, checked: boolean) {
		this.field()
			.control()
			.value.update((current: any) =>
				checked ? [...current, value] : current.filter((v: any) => v !== value),
			);
	}

	toggleAll(checked: boolean) {
		const values = this.normalizedOptions().map((o) => o.value);
		this.field()
			.control()
			.value.set(checked ? values : []);
	}
}
