import {
	Directive,
	ElementRef,
	HostListener,
	afterRenderEffect,
	inject,
	input,
} from '@angular/core';
import { CurrencyIntlPipe } from '../pipes';

type CurrencyFieldTree = {
	(): {
		value: {
			(): string | number | null | undefined;
			set(value: string | number | null): void;
		};
	};
};

@Directive({
	selector: '[currencyIntlInput]',
	standalone: true,
	providers: [CurrencyIntlPipe],
})
export class CurrencyIntlInputDirective {
	private elementRef = inject(ElementRef<HTMLInputElement>);
	private currencyPipe = inject(CurrencyIntlPipe);

	/**
	 * Isi dengan field dari signal forms.
	 *
	 * Contoh:
	 * [currencyIntlInput]="packageForm.basePrice"
	 */
	currencyIntlInput = input<CurrencyFieldTree | null>(null);

	currency = input<string>('IDR');
	locale = input<string>('id-ID');
	allowEmpty = input<boolean>(true);

	private isWritingView = false;
	private isTyping = false;

	constructor() {
		afterRenderEffect(() => {
			const field = this.currencyIntlInput();

			if (!field || this.isTyping) {
				return;
			}

			const value = field().value();
			this.writeFormattedView(value);
		});
	}

	private notifyInputChange(): void {
		this.elementRef.nativeElement.dispatchEvent(
			new Event('input', {
				bubbles: true,
			}),
		);
	}

	private onlyDigits(value: string | number | null | undefined): string {
		return String(value ?? '').replace(/\D/g, '');
	}

	private toNumber(value: string | number | null | undefined): number | null {
		const digits = this.onlyDigits(value);

		if (!digits) {
			return this.allowEmpty() ? null : 0;
		}

		const numberValue = Number(digits);

		return Number.isNaN(numberValue) ? null : numberValue;
	}

	private formatValue(value: string | number | null | undefined): string {
		const numberValue = this.toNumber(value);

		if (numberValue === null) {
			return '';
		}

		return this.currencyPipe.transform(numberValue, this.currency(), this.locale(), 0, 0);
	}

	private writeFormattedView(value: string | number | null | undefined): void {
		const formattedValue = this.formatValue(value);
		const input = this.elementRef.nativeElement;

		if (input.value === formattedValue) {
			return;
		}

		this.isWritingView = true;
		input.value = formattedValue;

		/**
		 * Notify Angular Material mat-form-field
		 * supaya label float ketika value di-set dari directive.
		 */
		this.notifyInputChange();

		this.isWritingView = false;
	}

	private updateFieldValue(): void {
		const field = this.currencyIntlInput();

		if (!field) {
			console.log('@@@ return');
			return;
		}

		const input = this.elementRef.nativeElement;
		const numberValue = this.toNumber(input.value);

		field().value.set(numberValue);
	}

	private moveCaretToEnd(): void {
		queueMicrotask(() => {
			const input = this.elementRef.nativeElement;
			const length = input.value.length;

			input.setSelectionRange(length, length);
		});
	}

	@HostListener('focus')
	onFocus(): void {
		this.isTyping = true;
		this.moveCaretToEnd();
	}

	@HostListener('blur')
	onBlur(): void {
		this.isTyping = false;

		const field = this.currencyIntlInput();
		const value = field ? field().value() : this.elementRef.nativeElement.value;

		this.writeFormattedView(value);
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

		if (isModifierPressed && ['a', 'c', 'v', 'x', 'z', 'y'].includes(key)) {
			return;
		}

		if (allowedKeys.includes(event.key)) {
			return;
		}

		if (/^\d$/.test(event.key)) {
			return;
		}

		event.preventDefault();
	}

	@HostListener('input')
	onInput(): void {
		if (this.isWritingView) {
			return;
		}

		this.isTyping = true;

		const input = this.elementRef.nativeElement;
		const numberValue = this.toNumber(input.value);

		this.writeFormattedView(numberValue);
		this.updateFieldValue();
		this.moveCaretToEnd();
	}

	@HostListener('paste', ['$event'])
	onPaste(event: ClipboardEvent): void {
		event.preventDefault();

		const pastedText = event.clipboardData?.getData('text/plain') ?? '';
		const pastedDigits = this.onlyDigits(pastedText);

		if (!pastedDigits) {
			return;
		}

		const input = this.elementRef.nativeElement;
		const currentDigits = this.onlyDigits(input.value);

		input.value = currentDigits + pastedDigits;

		const numberValue = this.toNumber(input.value);

		this.writeFormattedView(numberValue);
		this.updateFieldValue();
		this.moveCaretToEnd();
	}
}
