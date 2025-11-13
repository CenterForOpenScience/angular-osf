import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { TruncatedTextComponent } from '@osf/shared/components/truncated-text/truncated-text.component';

import { OverviewParentProjectComponent } from './overview-parent-project.component';

describe.skip('OverviewParentProjectComponent', () => {
  let component: OverviewParentProjectComponent;
  let fixture: ComponentFixture<OverviewParentProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        OverviewParentProjectComponent,
        ...MockComponents(TruncatedTextComponent, IconComponent, ContributorsListComponent),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OverviewParentProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
