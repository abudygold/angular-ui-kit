import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import {
	MatAutocompleteModule,
	MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormlyField } from '../../shared/model';
import { getFormlyOptionsConfig, optionGenerator } from '../../shared/utils';

@Component({
	selector: 'lib-autocomplete',
	imports: [MatFormFieldModule, MatAutocompleteModule, MatInputModule, MatIconModule],
	templateUrl: './autocomplete.html',
	styleUrl: './autocomplete.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Autocomplete {
	#keyword = signal('');

	field = input.required<FormlyField>();

	normalizedOptions = computed(() => {
		const options = optionGenerator(getFormlyOptionsConfig(this.field()));
		const keyword = this.#keyword().trim().toLowerCase();

		if (keyword) {
			return options.filter((option) => option.label.toLowerCase().includes(keyword));
		}

		return options;
	});

	inputValue = computed(() => {
		if (this.#keyword()) return this.#keyword();

		const selected = optionGenerator(getFormlyOptionsConfig(this.field())).find(
			(option) => option.value === this.field().control().value(),
		);
		return selected?.label ?? '';
	});

	onInput(event: Event): void {
		const value = (event.target as HTMLInputElement | null)?.value ?? '';
		this.#keyword.set(value);
		this.field().onInput?.(event);
	}

	onSelect(event: MatAutocompleteSelectedEvent): void {
		this.#keyword.set('');
		this.field().control().value.set(event.option.value);
		this.field().onChange?.(event);
	}

	onBlur(event: FocusEvent): void {
		this.field().onBlur?.(event);
	}
}
