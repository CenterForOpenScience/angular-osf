import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialsShareButtonComponent } from '@osf/shared/components/socials-share-button/socials-share-button.component';

import { RegistrationOverviewToolbarComponent } from './registration-overview-toolbar.component';

describe('RegistrationRegistrationOverviewToolbarComponent', () => {
  let component: RegistrationOverviewToolbarComponent;
  let fixture: ComponentFixture<RegistrationOverviewToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationOverviewToolbarComponent, MockComponent(SocialsShareButtonComponent)],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationOverviewToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
