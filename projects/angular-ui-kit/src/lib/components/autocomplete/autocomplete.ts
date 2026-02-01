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
		return optionGenerator(_options);
	});

	inputValue = computed(() => {
		const selected = this.normalizedOptions().find(
			(o) => o.value === this.field().control().value(),
		);
		return selected?.label ?? this.#keyword();
	});

	onInput(value: string) {
		this.#keyword.set(value);
		this.field().control().value.set(null); // reset selection while typing
	}

	select(value: any) {
		this.field().control().value.set(value);
		const selected = this.normalizedOptions().find((o) => o.value === value);
		this.#keyword.set(selected?.label ?? '');
	}
}
