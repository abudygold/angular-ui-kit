import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ButtonModel } from '../../shared/model';

@Component({
	selector: 'lib-button',
	imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule],
	templateUrl: './button.html',
	styleUrl: './button.css',
})
export class Button {
	config = input.required<ButtonModel>();

	get buttonClass() {
		switch (this.config().appearance) {
			case 'raised':
				return 'mat-mdc-raised-button';
			case 'stroked':
				return 'mat-mdc-outlined-button';
			case 'flat':
				return 'mat-mdc-unelevated-button';
			case 'fab':
				return 'mat-mdc-fab';
			default:
				return 'mdc-button';
		}
	}

	handleClick() {
		if (!this.config().onClick) return;

		this.config().onClick?.();
	}
}
