import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormlyField } from '../../shared/model';

@Component({
	selector: 'lib-slide-toggle',
	imports: [FormField, MatSlideToggleModule],
	templateUrl: './slide-toggle.html',
	styleUrl: './slide-toggle.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideToggle {
	field = input.required<FormlyField>();
}
