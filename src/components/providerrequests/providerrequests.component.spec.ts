import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderrequestsComponent } from './providerrequests.component';

describe('ProviderrequestsComponent', () => {
  let component: ProviderrequestsComponent;
  let fixture: ComponentFixture<ProviderrequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderrequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProviderrequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
