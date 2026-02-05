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

	get buttonClass() {
		switch (this.config().appearance) {
			case 'raised':
				return `mat-mdc-raised-button ${this.config().buttonClass}`;
			case 'stroked':
				return `mat-mdc-outlined-button ${this.config().buttonClass}`;
			case 'flat':
				return `mat-mdc-unelevated-button ${this.config().buttonClass}`;
			case 'fab':
				return `mat-mdc-fab ${this.config().buttonClass}`;
			default:
				return `mdc-button ${this.config().buttonClass}`;
		}
	}

	handleClick() {
		if (!this.config().onClick) return;

		this.config().onClick?.();
	}
}
