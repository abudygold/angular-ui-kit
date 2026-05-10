import { Directive, ElementRef, HostListener, inject, input, OnInit } from '@angular/core';
import { CurrencyIntlPipe } from '../pipes';

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

	/**
	 * Digunakan kalau mau allow value kosong.
	 * Contoh:
	 * <input currencyIntlInput [allowEmpty]="true" />
	 */
	allowEmpty = input<boolean>(true);

	/**
	 * Ambil angka saja dari string.
	 * Contoh:
	 * "Rp 10.000" -> "10000"
	 */
	private onlyDigits(value: string | null | undefined): string {
		return (value ?? '').replace(/\D/g, '');
	}

	private formatValue(value: string | number | null | undefined): string {
		const digits = this.onlyDigits(String(value ?? ''));

		if (!digits) {
			return this.allowEmpty()
				? ''
				: this.currencyPipe.transform(0, this.currency(), this.locale(), 0, 0);
		}

		const numberValue = Number(digits);

		if (Number.isNaN(numberValue)) {
			return '';
		}

		return this.currencyPipe.transform(numberValue, this.currency(), this.locale(), 0, 0);
	}

	private setNativeValue(value: string): void {
		this.elementRef.nativeElement.value = value;
	}

	private dispatchInputEvent(): void {
		this.elementRef.nativeElement.dispatchEvent(
			new Event('input', {
				bubbles: true,
			}),
		);
	}

	private moveCaretToEnd(): void {
		queueMicrotask(() => {
			const input = this.elementRef.nativeElement;
			const length = input.value.length;
			input.setSelectionRange(length, length);
		});
	}

	private updateFormattedValue(): void {
		const input = this.elementRef.nativeElement;
		const formattedValue = this.formatValue(input.value);

		this.setNativeValue(formattedValue);
		this.dispatchInputEvent();
		this.moveCaretToEnd();
	}

	@HostListener('focus')
	onFocus(): void {
		/**
		 * Jangan ubah ke angka polos saat focus.
		 * Ini membuat user tetap bisa melihat format ribuan/nol saat input.
		 */
		this.moveCaretToEnd();
	}

	@HostListener('keydown', ['$event'])
	onKeyDown(event: KeyboardEvent): void {
		const allowedKeys = [
			'ArrowLeft',
			'ArrowRight',
			'ArrowUp',
			'ArrowDown',
			'Backspace',
			'Delete',
			'Enter',
			'Escape',
			'End',
			'Home',
			'Tab',
		];

		const key = event.key.toLowerCase();
		const isModifierPressed = event.ctrlKey || event.metaKey;

		// Allow select all, copy, paste, cut, undo, redo
		if (isModifierPressed && ['a', 'c', 'v', 'x', 'z', 'y'].includes(key)) {
			return;
		}

		if (allowedKeys.includes(event.key)) {
			return;
		}

		// Allow only number
		if (/^\d$/.test(event.key)) {
			return;
		}

		event.preventDefault();
	}

	@HostListener('input')
	onInput(): void {
		this.updateFormattedValue();
	}

	@HostListener('blur')
	onBlur(): void {
		const input = this.elementRef.nativeElement;
		const digits = this.onlyDigits(input.value);

		if (!digits && this.allowEmpty()) {
			this.setNativeValue('');
			this.dispatchInputEvent();
			return;
		}

		this.updateFormattedValue();
	}

	@HostListener('paste', ['$event'])
	onPaste(event: ClipboardEvent): void {
		event.preventDefault();

		const pastedText = event.clipboardData?.getData('text/plain') ?? '';
		const digits = this.onlyDigits(pastedText);

		if (!digits) {
			return;
		}

		const input = this.elementRef.nativeElement;
		const currentDigits = this.onlyDigits(input.value);

		/**
		 * Simpel behavior:
		 * paste akan append ke angka yang sudah ada.
		 * Contoh current Rp 10.000, paste 500 -> Rp 10.000.500
		 */
		this.setNativeValue(currentDigits + digits);
		this.updateFormattedValue();
	}

	ngOnInit(): void {
		const input = this.elementRef.nativeElement;
		const formattedValue = this.formatValue(input.value);

		this.setNativeValue(formattedValue);
	}
}
