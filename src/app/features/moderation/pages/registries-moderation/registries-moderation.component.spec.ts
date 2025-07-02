import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistriesModerationComponent } from './registries-moderation.component';

describe('RegistriesModerationComponent', () => {
  let component: RegistriesModerationComponent;
  let fixture: ComponentFixture<RegistriesModerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistriesModerationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistriesModerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
