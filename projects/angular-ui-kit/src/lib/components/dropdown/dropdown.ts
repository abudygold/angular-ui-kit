import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {
	MatSelectInfiniteScrollDirective,
	MatSelectInfiniteScrollEvent,
} from '../../shared/directives';
import { FormlyField, FormlyInfiniteScrollConfig } from '../../shared/model';
import { getFormlyOptionsConfig, optionGenerator } from '../../shared/utils';

type DropdownInfiniteScrollConfig = Required<FormlyInfiniteScrollConfig>;

@Component({
	selector: 'lib-dropdown',
	imports: [FormField, MatFormFieldModule, MatSelectModule, MatSelectInfiniteScrollDirective],
	templateUrl: './dropdown.html',
	styleUrl: './dropdown.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dropdown {
	field = input.required<FormlyField>();

	normalizedOptions = computed(() => {
		return optionGenerator(getFormlyOptionsConfig(this.field()));
	});

	get infiniteScrollConfig(): DropdownInfiniteScrollConfig {
		const config = this.field().config.dropdown?.infiniteScroll;

		if (config === true) {
			return this.createInfiniteScrollConfig({ enabled: true });
		}

		if (!config) {
			return this.createInfiniteScrollConfig({ enabled: false });
		}

		return this.createInfiniteScrollConfig(config);
	}

	onChange(event: unknown): void {
		this.field().onChange?.(event);
	}

	onInfiniteScroll(event: MatSelectInfiniteScrollEvent): void {
		if (!this.infiniteScrollConfig.enabled) return;

		this.field().onInfiniteScroll?.(event);
	}

	private createInfiniteScrollConfig(
		config: FormlyInfiniteScrollConfig,
	): DropdownInfiniteScrollConfig {
		return {
			enabled: config.enabled ?? false,
			threshold: config.threshold ?? '15%',
			debounce: config.debounce ?? 150,
			complete: config.complete ?? false,
			loading: config.loading ?? false,
			disabled: config.disabled ?? false,
			loadOnOpen: config.loadOnOpen ?? false,
		};
	}
}
