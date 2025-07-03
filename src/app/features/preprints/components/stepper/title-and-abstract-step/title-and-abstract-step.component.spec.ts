import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleAndAbstractStepComponent } from '@osf/features/preprints/components';

describe('TitleAndAbstractStepComponent', () => {
  let component: TitleAndAbstractStepComponent;
  let fixture: ComponentFixture<TitleAndAbstractStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitleAndAbstractStepComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TitleAndAbstractStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
