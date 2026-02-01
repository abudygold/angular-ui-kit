import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormlyField } from '../../shared/model';
import { optionGenerator } from '../../shared/utils';

@Component({
	selector: 'lib-dropdown',
	imports: [FormField, MatFormFieldModule, MatSelectModule],
	templateUrl: './dropdown.html',
	styleUrl: './dropdown.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dropdown {
	field = input.required<FormlyField>();

	normalizedOptions = computed(() => {
		const _options = this.field().config.options;
		return optionGenerator(_options);
	});
}
