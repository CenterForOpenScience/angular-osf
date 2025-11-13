import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { DataResourcesComponent } from '@osf/shared/components/data-resources/data-resources.component';
import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { TruncatedTextComponent } from '@osf/shared/components/truncated-text/truncated-text.component';

import { RegistrationLinksCardComponent } from './registration-links-card.component';

describe('RegistrationLinksCardComponent', () => {
  let component: RegistrationLinksCardComponent;
  let fixture: ComponentFixture<RegistrationLinksCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RegistrationLinksCardComponent,
        ...MockComponents(DataResourcesComponent, TruncatedTextComponent, IconComponent, ContributorsListComponent),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationLinksCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
