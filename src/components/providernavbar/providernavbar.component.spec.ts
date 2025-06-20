import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvidernavbarComponent } from './providernavbar.component';

describe('ProvidernavbarComponent', () => {
  let component: ProvidernavbarComponent;
  let fixture: ComponentFixture<ProvidernavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProvidernavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProvidernavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
