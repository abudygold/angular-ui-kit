import { Directive, HostListener } from '@angular/core';

@Directive({
	selector: '[onlyNumbers]',
	standalone: true,
})
export class OnlyNumbersDirective {
	@HostListener('keydown', ['$event'])
	onKeyDown(event: KeyboardEvent) {
		const key = event.key;

		// 1. Izinkan tombol navigasi dan penghapus
		const allowedKeys = [
			'Backspace',
			'Tab',
			'End',
			'Home',
			'ArrowLeft',
			'ArrowRight',
			'Delete',
			'Enter',
		];
		if (allowedKeys.includes(key)) return;

		// 2. IZINKAN Kombinasi Shortcut (CTRL+A, CTRL+C, CTRL+V, CMD+A, dll)
		// Kita cek apakah tombol Meta (Mac) atau Control (Windows) sedang ditekan
		if (event.ctrlKey || event.metaKey) {
			return;
		}

		// 3. Blokir jika bukan angka (0-9)
		// Pastikan kita hanya mengecek karakter tunggal agar tombol fungsi (F1-F12) tidak terblokir
		if (key.length === 1 && !/^[0-9]$/.test(key)) {
			event.preventDefault();
		}
	}

	@HostListener('paste', ['$event'])
	onPaste(event: ClipboardEvent) {
		const clipboardData = event.clipboardData;
		const pastedText = clipboardData?.getData('text');

		// Tetap validasi hasil paste agar tidak kecolongan huruf
		if (pastedText && !/^\d+$/.test(pastedText)) {
			event.preventDefault();
		}
	}
}
