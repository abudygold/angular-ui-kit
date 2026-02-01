import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormlyField } from '../../shared/model';

@Component({
	selector: 'lib-textarea',
	imports: [FormField, MatFormFieldModule, MatInputModule],
	templateUrl: './textarea.html',
	styleUrl: './textarea.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Textarea {
	field = input.required<FormlyField>();
}
