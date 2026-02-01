import { Component, input } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { BreadcrumbModel } from '../../shared/model';

@Component({
	selector: 'lib-breadcrumb',
	imports: [RouterLink, MatIconModule, MatDividerModule],
	templateUrl: './breadcrumb.html',
	styleUrl: './breadcrumb.css',
})
export class Breadcrumb {
	breadcrumbs = input.required<BreadcrumbModel[]>();
}
