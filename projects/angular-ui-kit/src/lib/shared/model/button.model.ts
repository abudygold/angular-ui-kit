type ButtonVariant =
	| 'basic'
	| 'raised'
	| 'flat'
	| 'icon'
	| 'stroked'
	| 'fab'
	| 'mini-fab'
	| 'extended-fab';
type Color = 'primary' | 'secondary' | 'secondary-gray' | 'tertiary' | 'link';
type IconPosition = 'start' | 'end';

export class ButtonModel {
	/**
	 * Creates an instance of ButtonModel.
	 *
	 * @param type - The type of the button. Defaults to 'basic'.
	 * @param label - The label text displayed on the button. Defaults to 'Button'.
	 * @param color - Defines the text color of the button.
	 * @param disabled - Indicates whether the button is disabled. Defaults to `false`.
	 * @param buttonClass - Define the custom class of the button. Defaults to an empty string.
	 * @param link - The URL or route the button navigates to. Defaults to an empty string.
	 * @param icon - The icon associated with the button. Defaults to an empty string.
	 * @param iconPosition - The position of the icon relative to the label. Defaults to 'start'.
	 */
	constructor(
		public variant: ButtonVariant = 'basic',
		public label: string = 'Button',
		public color: Color = 'primary',
		public disabled: boolean = false,
		public buttonClass: string = '',
		public link: string = '',
		public icon: string = '',
		public iconPosition: IconPosition = 'start',
		public imageIcon: string = '',
	) {}
}
