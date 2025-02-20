import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissingPetReportComponent } from './missing-pet-report.component';

describe('MissingPetReportComponent', () => {
  let component: MissingPetReportComponent;
  let fixture: ComponentFixture<MissingPetReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MissingPetReportComponent]
    });
    fixture = TestBed.createComponent(MissingPetReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
