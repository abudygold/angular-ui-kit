import { WritableSignal, signal } from '@angular/core';

export type ButtonType = 'submit' | 'reset' | 'button' | 'link' | 'icon';

export class ButtonModel {
	text?: string;
	buttonType?: ButtonType;
	color?: 'primary' | 'accent' | 'warn';
	appearance?: 'flat' | 'raised' | 'stroked' | 'icon' | 'fab';
	icon?: string;
	href?: string;
	target?: '_blank' | '_self';
	disabled: WritableSignal<boolean> = signal(false);
	loading: WritableSignal<boolean> = signal(false);
	onClick?: (props?: any) => void;
}
