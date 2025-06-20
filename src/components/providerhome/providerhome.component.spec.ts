import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderhomeComponent } from './providerhome.component';

describe('ProviderhomeComponent', () => {
  let component: ProviderhomeComponent;
  let fixture: ComponentFixture<ProviderhomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderhomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProviderhomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
