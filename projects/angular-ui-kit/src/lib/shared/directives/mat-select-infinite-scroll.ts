import {
	AfterViewInit,
	DestroyRef,
	Directive,
	EventEmitter,
	Input,
	NgZone,
	Output,
	inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSelect } from '@angular/material/select';
import { fromEvent } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';

@Directive({
	selector: '[msInfiniteScroll]',
	standalone: true,
})
export class MatSelectInfiniteScrollDirective implements AfterViewInit {
	private matSelect = inject(MatSelect);
	private ngZone = inject(NgZone);
	private destroyRef = inject(DestroyRef);

	@Input() threshold: string = '15%';
	@Input() debounce = 150;
	@Input() complete = false;

	@Output() infiniteScroll = new EventEmitter<void>();

	private panel!: HTMLElement;
	private optionHeightPx = 48; // default mat-option height
	private thrPx = 0;
	private thrPc = 0;

	ngAfterViewInit() {
		this.evaluateThreshold();

		this.matSelect.openedChange
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((opened) => {
				if (!opened) return;

				this.ngZone.runOutsideAngular(() => {
					setTimeout(() => {
						const panel = this.matSelect.panel?.nativeElement as HTMLElement | null;

						if (!panel) return;

						this.panel = panel;
						this.resolveOptionHeight();
						this.registerScrollListener();
					});
				});
			});
	}

	private evaluateThreshold() {
		if (this.threshold.includes('%')) {
			this.thrPc = parseFloat(this.threshold) / 100;
			this.thrPx = 0;
		} else {
			this.thrPx = parseFloat(this.threshold);
			this.thrPc = 0;
		}
	}

	private resolveOptionHeight() {
		// try to read real mat-option height
		const option = this.panel.querySelector('mat-option') as HTMLElement;
		if (option) {
			this.optionHeightPx = option.getBoundingClientRect().height;
		}
	}

	private registerScrollListener() {
		fromEvent(this.panel, 'scroll')
			.pipe(
				debounceTime(this.debounce),
				tap((event) => this.handleScroll(event)),
				takeUntilDestroyed(this.destroyRef),
			)
			.subscribe();
	}

	private handleScroll(event: Event) {
		this.ngZone.runOutsideAngular(() => {
			if (this.complete) return;

			const optionCount = this.matSelect.options.length;
			const totalHeight = this.optionHeightPx * optionCount;
			const threshold = this.thrPc !== 0 ? totalHeight * this.thrPc : this.thrPx;

			const target = event.target as HTMLElement;
			const scrolledDistance = target.clientHeight + target.scrollTop;

			if (scrolledDistance + threshold >= totalHeight) {
				this.ngZone.run(() => this.infiniteScroll.emit());
			}
		});
	}
}
