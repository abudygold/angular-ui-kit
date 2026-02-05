import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Formly } from './formly';

describe('Formly', () => {
	let component: Formly;
	let fixture: ComponentFixture<Formly>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [Formly],
		}).compileComponents();

		fixture = TestBed.createComponent(Formly);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
