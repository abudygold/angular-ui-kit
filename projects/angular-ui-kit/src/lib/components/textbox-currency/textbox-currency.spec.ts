import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextboxCurrency } from './textbox-currency';

describe('TextboxCurrency', () => {
  let component: TextboxCurrency;
  let fixture: ComponentFixture<TextboxCurrency>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextboxCurrency]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextboxCurrency);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
