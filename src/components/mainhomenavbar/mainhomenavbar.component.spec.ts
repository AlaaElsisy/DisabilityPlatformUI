import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainhomenavbarComponent } from './mainhomenavbar.component';

describe('MainhomenavbarComponent', () => {
  let component: MainhomenavbarComponent;
  let fixture: ComponentFixture<MainhomenavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainhomenavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainhomenavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
