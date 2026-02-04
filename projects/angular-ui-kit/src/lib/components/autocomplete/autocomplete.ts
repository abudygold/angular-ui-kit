import { Component, computed, input, signal } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormlyField } from '../../shared/model';
import { optionGenerator } from '../../shared/utils';

@Component({
	selector: 'lib-autocomplete',
	imports: [MatFormFieldModule, MatAutocompleteModule, MatInputModule],
	templateUrl: './autocomplete.html',
	styleUrl: './autocomplete.css',
})
export class Autocomplete {
	#keyword = signal('');

	field = input.required<FormlyField>();

	normalizedOptions = computed(() => {
		const _options = this.field().config.options;
		const _optionGenerator = optionGenerator(_options);

		if (this.#keyword()) {
			return _optionGenerator.filter((option: any) => {
				return option.label.toLowerCase().includes(this.#keyword().toLowerCase());
			});
		}

		return _optionGenerator;
	});

	inputValue = computed(() => {
		const selected = this.normalizedOptions().find(
			(o) => o.value === this.field().control().value(),
		);
		return selected?.label ?? '';
	});

	onInput(value: string) {
		this.#keyword.set(value);
		this.normalizedOptions();
	}

	onSelect(value: any) {
		this.#keyword.set('');
		this.field().control().value.set(value);
	}
}
