import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistriesContributorsComponent } from './registries-contributors.component';

describe('RegistriesContributorsComponent', () => {
  let component: RegistriesContributorsComponent;
  let fixture: ComponentFixture<RegistriesContributorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistriesContributorsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistriesContributorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
