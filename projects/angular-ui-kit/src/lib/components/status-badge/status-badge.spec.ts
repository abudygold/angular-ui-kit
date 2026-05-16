import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusBadge, StatusBadgeConfig } from './status-badge';

describe('StatusBadge', () => {
	let component: StatusBadge;
	let fixture: ComponentFixture<StatusBadge>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [StatusBadge],
		}).compileComponents();

		fixture = TestBed.createComponent(StatusBadge);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should render status badge with config', () => {
		const config: StatusBadgeConfig = {
			text: 'Active',
			color: 'green',
		};
		fixture.componentRef.setInput('config', config);
		fixture.detectChanges();

		const badge = fixture.nativeElement.querySelector('.status-badge');
		expect(badge).toBeTruthy();
		expect(badge.textContent).toContain('Active');
	});

	it('should apply correct color class', () => {
		const config: StatusBadgeConfig = {
			text: 'Failed',
			color: 'red',
		};
		fixture.componentRef.setInput('config', config);
		fixture.detectChanges();

		const badge = fixture.nativeElement.querySelector('.status-badge');
		expect(badge.classList.contains('color-red')).toBeTruthy();
	});

	it('should apply correct size class', () => {
		const config: StatusBadgeConfig = {
			text: 'Info',
			color: 'blue',
			size: 'large',
		};
		fixture.componentRef.setInput('config', config);
		fixture.detectChanges();

		const badge = fixture.nativeElement.querySelector('.status-badge');
		expect(badge.classList.contains('size-large')).toBeTruthy();
	});

	it('should apply correct variant class', () => {
		const config: StatusBadgeConfig = {
			text: 'Warning',
			color: 'yellow',
			variant: 'outlined',
		};
		fixture.componentRef.setInput('config', config);
		fixture.detectChanges();

		const badge = fixture.nativeElement.querySelector('.status-badge');
		expect(badge.classList.contains('variant-outlined')).toBeTruthy();
	});

	it('should render icon when provided', () => {
		const config: StatusBadgeConfig = {
			text: 'Approved',
			color: 'green',
			icon: '✓',
		};
		fixture.componentRef.setInput('config', config);
		fixture.detectChanges();

		const icon = fixture.nativeElement.querySelector('.badge-icon');
		expect(icon).toBeTruthy();
		expect(icon.textContent).toContain('✓');
	});

	it('should not render icon when not provided', () => {
		const config: StatusBadgeConfig = {
			text: 'Pending',
			color: 'purple',
		};
		fixture.componentRef.setInput('config', config);
		fixture.detectChanges();

		const icon = fixture.nativeElement.querySelector('.badge-icon');
		expect(icon).toBeFalsy();
	});

	it('should use default size medium when not specified', () => {
		const config: StatusBadgeConfig = {
			text: 'Info',
			color: 'blue',
		};
		fixture.componentRef.setInput('config', config);
		fixture.detectChanges();

		const badge = fixture.nativeElement.querySelector('.status-badge');
		expect(badge.classList.contains('size-medium')).toBeTruthy();
	});

	it('should use default variant filled when not specified', () => {
		const config: StatusBadgeConfig = {
			text: 'Neutral',
			color: 'gray',
		};
		fixture.componentRef.setInput('config', config);
		fixture.detectChanges();

		const badge = fixture.nativeElement.querySelector('.status-badge');
		expect(badge.classList.contains('variant-filled')).toBeTruthy();
	});

	it('should return correct color for each color type', () => {
		const colors: Array<{ color: StatusBadgeConfig['color']; expectedHex: string }> = [
			{ color: 'red', expectedHex: '#ef4444' },
			{ color: 'green', expectedHex: '#10b981' },
			{ color: 'blue', expectedHex: '#3b82f6' },
			{ color: 'yellow', expectedHex: '#eab308' },
			{ color: 'purple', expectedHex: '#8b5cf6' },
			{ color: 'gray', expectedHex: '#6b7280' },
			{ color: 'cyan', expectedHex: '#06b6d4' },
			{ color: 'orange', expectedHex: '#f97316' },
			{ color: 'indigo', expectedHex: '#6366f1' },
			{ color: 'amber', expectedHex: '#f59e0b' },
			{ color: 'pink', expectedHex: '#ec4899' },
			{ color: 'lime', expectedHex: '#84cc16' },
			{ color: 'teal', expectedHex: '#14b8a6' },
			{ color: 'violet', expectedHex: '#7c3aed' },
			{ color: 'rose', expectedHex: '#f43f5e' },
			{ color: 'emerald', expectedHex: '#059669' },
			{ color: 'sky', expectedHex: '#0ea5e9' },
			{ color: 'fuchsia', expectedHex: '#d946ef' },
		];

		colors.forEach(({ color, expectedHex }) => {
			const config: StatusBadgeConfig = {
				text: 'Test',
				color,
			};
			fixture.componentRef.setInput('config', config);
			fixture.detectChanges();

			expect(component.getColor()).toBe(expectedHex);
		});
	});
});
