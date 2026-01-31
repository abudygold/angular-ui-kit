import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularUiKit } from './angular-ui-kit';

describe('AngularUiKit', () => {
  let component: AngularUiKit;
  let fixture: ComponentFixture<AngularUiKit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AngularUiKit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AngularUiKit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
