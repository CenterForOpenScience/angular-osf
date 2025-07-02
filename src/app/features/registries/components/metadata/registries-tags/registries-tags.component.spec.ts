import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistriesTagsComponent } from './registries-tags.component';

describe('TagsComponent', () => {
  let component: RegistriesTagsComponent;
  let fixture: ComponentFixture<RegistriesTagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistriesTagsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistriesTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
