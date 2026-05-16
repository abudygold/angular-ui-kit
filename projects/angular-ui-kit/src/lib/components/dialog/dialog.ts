import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'lib-dialog',
	imports: [MatDialogModule, MatIconModule],
	templateUrl: './dialog.html',
	styleUrl: './dialog.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dialog {
	title = input.required<string>();
	subtitle = input<string>();
}
