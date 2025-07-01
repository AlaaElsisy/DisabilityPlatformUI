import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderservicesComponent } from './providerservices.component';

describe('ProviderservicesComponent', () => {
  let component: ProviderservicesComponent;
  let fixture: ComponentFixture<ProviderservicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderservicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProviderservicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
