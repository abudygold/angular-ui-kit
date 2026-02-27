import { Directive, ElementRef, HostListener, inject, input, OnInit } from '@angular/core';
import { CurrencyIntlPipe } from '@devkitify/angular-ui-kit';

@Directive({
	selector: '[currencyIntlInput]',
	standalone: true,
	providers: [CurrencyIntlPipe],
})
export class CurrencyIntlInputDirective implements OnInit {
	private elementRef = inject(ElementRef<HTMLInputElement>);
	private currencyPipe = inject(CurrencyIntlPipe);

	currency = input<string>('USD');
	locale = input<string>('en-US');

	@HostListener('focus', ['$event'])
	onFocus(event: FocusEvent) {
		// on focus remove currency formatting
		const inputValue = (event.target as HTMLInputElement).value;
		this.elementRef.nativeElement.value = this.currencyPipe.parse(inputValue);
		this.elementRef.nativeElement.select();
	}

	@HostListener('keydown', ['$event'])
	onKeyDown(event: KeyboardEvent) {
		const input = event.key;
		const numberRegex = /[0-9]+/g;
		const operatorKeys = ['+', '-', '*', '/', '(', ')'];
		const specialKeys = [
			'ArrowLeft',
			'ArrowRight',
			'Backspace',
			'Del',
			'Delete',
			'Enter',
			'Escape',
			'End',
			'Home',
			'Tab',
		];
		const key = event.key.toLowerCase();
		const isModifierPressed = event.ctrlKey || event.metaKey;

		/* Allow Select All, Copy, Paste, Cut */
		if (isModifierPressed && ['a', 'c', 'v', 'x'].includes(key)) {
			return;
		}

		/* Allow Special Key */
		if (specialKeys.indexOf(event.key) !== -1) {
			return;
		}

		/* Allow Operator */
		if (operatorKeys.indexOf(event.key) !== -1) {
			return;
		}

		/* Allow Number */
		if (numberRegex.test(input)) {
			return;
		}

		event.preventDefault();
	}

	@HostListener('blur', ['$event'])
	onBlur(event: FocusEvent) {
		// on blur, add currency formatting
		const inputValue = (event.target as HTMLInputElement).value;
		const numberValue = parseInt(this.currencyPipe.parse(inputValue));

		this.elementRef.nativeElement.value = this.currencyPipe.transform(
			numberValue,
			this.currency(),
			this.locale(),
			0,
			0,
		);
	}

	@HostListener('paste', ['$event'])
	onPaste(event: ClipboardEvent) {
		const input = event?.clipboardData?.getData('text/plain').replace(/\D/g, '') ?? '';
		const numberRegex = /[0-9]+/g;

		// Check Number
		if (!numberRegex.test(input)) {
			event.preventDefault();
			return;
		}

		event.preventDefault();

		const pastedInput: string =
			event?.clipboardData?.getData('text/plain').replace(/\D/g, '') ?? '';
		// this.model()?.().value.set(+result);
		document.execCommand('insertText', false, pastedInput);
	}

	@HostListener('keydown.control.z', ['$event'])
	onUndo(_event: any) {
		this.elementRef.nativeElement.value = '';
	}

	ngOnInit() {
		this.elementRef.nativeElement.value = this.currencyPipe.transform(
			this.elementRef.nativeElement.value,
			this.currency(),
			this.locale(),
			0,
			0,
		);
	}
}
