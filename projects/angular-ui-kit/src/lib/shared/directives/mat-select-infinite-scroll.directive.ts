import {
	AfterViewInit,
	DestroyRef,
	Directive,
	EventEmitter,
	Input,
	NgZone,
	OnChanges,
	OnDestroy,
	Output,
	SimpleChanges,
	inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FORM_FIELD, FormField } from '@angular/forms/signals';
import { MatSelect } from '@angular/material/select';
import { Subscription, fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

export interface MatSelectInfiniteScrollEvent {
	source: MatSelect;
	panel: HTMLElement;
	formField: FormField<unknown> | null;
}

type Threshold = `${number}%` | `${number}px` | number | string;

@Directive({
	selector: 'mat-select[msInfiniteScroll], mat-select[matSelectInfiniteScroll]',
	standalone: true,
})
export class MatSelectInfiniteScrollDirective implements AfterViewInit, OnChanges, OnDestroy {
	private readonly matSelect = inject(MatSelect);
	private readonly ngZone = inject(NgZone);
	private readonly destroyRef = inject(DestroyRef);
	private readonly formField = inject(FORM_FIELD, { optional: true, self: true });

	@Input() threshold: Threshold = '15%';
	@Input() debounce = 150;
	@Input() complete = false;
	@Input() loading = false;
	@Input() loadOnOpen = false;
	@Input('msInfiniteScrollDisabled') disabled = false;

	@Input('msInfiniteScrollThreshold')
	set thresholdAlias(value: Threshold) {
		this.threshold = value;
		this.evaluateThreshold();
	}

	@Input('msInfiniteScrollComplete')
	set completeAlias(value: boolean) {
		this.complete = value;
		this.resetEmissionGuard();
	}

	@Input('msInfiniteScrollLoading')
	set loadingAlias(value: boolean) {
		this.loading = value;
		this.resetEmissionGuard();
	}

	@Input('matSelectInfiniteScrollThreshold')
	set matSelectThresholdAlias(value: Threshold) {
		this.thresholdAlias = value;
	}

	@Input('matSelectInfiniteScrollComplete')
	set matSelectCompleteAlias(value: boolean) {
		this.completeAlias = value;
	}

	@Input('matSelectInfiniteScrollLoading')
	set matSelectLoadingAlias(value: boolean) {
		this.loadingAlias = value;
	}

	@Input('matSelectInfiniteScrollDisabled')
	set matSelectDisabledAlias(value: boolean) {
		this.disabled = value;
		this.resetEmissionGuard();
	}

	@Output() infiniteScroll = new EventEmitter<MatSelectInfiniteScrollEvent>();
	@Output() msInfiniteScroll = new EventEmitter<MatSelectInfiniteScrollEvent>();

	private panel: HTMLElement | null = null;
	private thresholdPercent = 0.15;
	private thresholdPx = 0;
	private scrollSubscription?: Subscription;
	private lastEmittedScrollHeight = 0;

	ngAfterViewInit(): void {
		this.evaluateThreshold();

		this.matSelect.openedChange
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((opened) => this.handleOpenedChange(opened));
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['threshold']) {
			this.evaluateThreshold();
		}

		if (changes['complete'] || changes['loading'] || changes['disabled']) {
			this.resetEmissionGuard();
		}
	}

	ngOnDestroy(): void {
		this.unregisterScrollListener();
	}

	private handleOpenedChange(opened: boolean): void {
		if (!opened) {
			this.panel = null;
			this.unregisterScrollListener();
			this.resetEmissionGuard();
			return;
		}

		this.ngZone.runOutsideAngular(() => {
			queueMicrotask(() => {
				const panel = this.matSelect.panel?.nativeElement as HTMLElement | null;
				if (!panel) return;

				this.panel = panel;
				this.registerScrollListener(panel);

				if (this.loadOnOpen) {
					this.handleScroll(panel);
				}
			});
		});
	}

	private registerScrollListener(panel: HTMLElement): void {
		this.unregisterScrollListener();

		this.scrollSubscription = fromEvent(panel, 'scroll')
			.pipe(debounceTime(this.debounce), takeUntilDestroyed(this.destroyRef))
			.subscribe(() => this.handleScroll(panel));
	}

	private unregisterScrollListener(): void {
		this.scrollSubscription?.unsubscribe();
		this.scrollSubscription = undefined;
	}

	private handleScroll(panel: HTMLElement): void {
		this.ngZone.runOutsideAngular(() => {
			if (!this.canEmit()) return;

			const threshold = this.resolveThreshold(panel);
			const scrollPosition = panel.scrollTop + panel.clientHeight;
			const isThresholdReached = scrollPosition + threshold >= panel.scrollHeight;

			if (!isThresholdReached || this.lastEmittedScrollHeight === panel.scrollHeight) {
				return;
			}

			this.lastEmittedScrollHeight = panel.scrollHeight;
			this.ngZone.run(() => this.emitScroll(panel));
		});
	}

	private emitScroll(panel: HTMLElement): void {
		const event: MatSelectInfiniteScrollEvent = {
			source: this.matSelect,
			panel,
			formField: this.formField,
		};

		this.infiniteScroll.emit(event);
		this.msInfiniteScroll.emit(event);
	}

	private canEmit(): boolean {
		if (this.complete || this.loading || this.disabled || this.matSelect.disabled) {
			return false;
		}

		return !this.formField?.state().disabled();
	}

	private resolveThreshold(panel: HTMLElement): number {
		if (this.thresholdPercent > 0) {
			return panel.scrollHeight * this.thresholdPercent;
		}

		return this.thresholdPx;
	}

	private evaluateThreshold(): void {
		const value = String(this.threshold).trim();

		if (value.endsWith('%')) {
			this.thresholdPercent = this.toNumber(value) / 100;
			this.thresholdPx = 0;
			return;
		}

		this.thresholdPercent = 0;
		this.thresholdPx = this.toNumber(value);
	}

	private toNumber(value: string): number {
		const parsed = Number.parseFloat(value);
		return Number.isFinite(parsed) ? parsed : 0;
	}

	private resetEmissionGuard(): void {
		if (!this.loading) {
			this.lastEmittedScrollHeight = 0;
		}
	}
}
