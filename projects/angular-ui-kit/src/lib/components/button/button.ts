import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ButtonModel } from '../../shared/model';

@Component({
	selector: 'lib-button',
	imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule],
	templateUrl: './button.html',
	styleUrl: './button.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
	config = input.required<ButtonModel>();

	get buttonClass(): string {
		const config = this.config();
		const customClass = config.buttonClass ?? '';

		switch (config.appearance) {
			case 'raised':
				return `mat-mdc-raised-button ${customClass}`;
			case 'stroked':
				return `mat-mdc-outlined-button ${customClass}`;
			case 'flat':
				return `mat-mdc-unelevated-button ${customClass}`;
			case 'fab':
				return `mat-mdc-fab ${customClass}`;
			default:
				return `mdc-button ${customClass}`;
		}
	}

	handleClick(): void {
		this.config().onClick?.();
	}
}
