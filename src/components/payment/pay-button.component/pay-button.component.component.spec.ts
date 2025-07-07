import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayButtonComponentComponent } from './pay-button.component.component';

describe('PayButtonComponentComponent', () => {
  let component: PayButtonComponentComponent;
  let fixture: ComponentFixture<PayButtonComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayButtonComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayButtonComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
