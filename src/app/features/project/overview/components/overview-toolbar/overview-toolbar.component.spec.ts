import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialsShareButtonComponent } from '@osf/shared/components/socials-share-button/socials-share-button.component';

import { OverviewToolbarComponent } from './overview-toolbar.component';

describe('OverviewToolbarComponent', () => {
  let component: OverviewToolbarComponent;
  let fixture: ComponentFixture<OverviewToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewToolbarComponent, MockComponent(SocialsShareButtonComponent)],
    }).compileComponents();

    fixture = TestBed.createComponent(OverviewToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
