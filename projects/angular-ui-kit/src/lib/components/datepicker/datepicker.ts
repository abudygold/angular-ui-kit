import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormlyField } from '../../shared/model';

@Component({
	selector: 'lib-datepicker',
	providers: [provideNativeDateAdapter()],
	imports: [FormField, MatFormFieldModule, MatInputModule, MatDatepickerModule],
	templateUrl: './datepicker.html',
	styleUrl: './datepicker.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Datepicker {
	field = input.required<FormlyField>();
}
