import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface StatusBadgeConfig {
	text: string;
	class?: string;
	icon?: string;
	size?: 'small' | 'medium' | 'large';
}

@Component({
	selector: 'lib-status-badge',
	imports: [CommonModule],
	templateUrl: './status-badge.html',
	styleUrl: './status-badge.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusBadge {
	config = input.required<StatusBadgeConfig>();

	get badgeClass(): string {
		const cfg = this.config();
		const colorClass = cfg.class;
		const sizeClass = `size-${cfg.size ?? 'medium'}`;

		return `${colorClass} ${sizeClass}`;
	}
}
