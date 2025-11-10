import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { TruncatedTextComponent } from '@osf/shared/components/truncated-text/truncated-text.component';

import { OverviewComponentsComponent } from './overview-components.component';

describe.skip('ProjectComponentsComponent', () => {
  let component: OverviewComponentsComponent;
  let fixture: ComponentFixture<OverviewComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        OverviewComponentsComponent,
        ...MockComponents(TruncatedTextComponent, IconComponent, ContributorsListComponent),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OverviewComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
