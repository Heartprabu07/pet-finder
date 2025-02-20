import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPetFormComponent } from './report-pet-form.component';

describe('ReportPetFormComponent', () => {
  let component: ReportPetFormComponent;
  let fixture: ComponentFixture<ReportPetFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportPetFormComponent]
    });
    fixture = TestBed.createComponent(ReportPetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
