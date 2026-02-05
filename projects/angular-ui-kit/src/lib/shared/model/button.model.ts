import { WritableSignal } from '@angular/core';

export type ButtonType = 'submit' | 'reset' | 'button' | 'link' | 'icon';

export class ButtonModel {
	text?: string;
	buttonType?: ButtonType;
	color?: 'primary' | 'accent' | 'warn';
	appearance?: 'flat' | 'raised' | 'stroked' | 'icon' | 'fab';
	icon?: string;
	href?: string;
	target?: '_blank' | '_self';
	buttonClass?: string;
	disabled?: WritableSignal<boolean>;
	loading?: WritableSignal<boolean>;
	onClick?: () => void;
}
