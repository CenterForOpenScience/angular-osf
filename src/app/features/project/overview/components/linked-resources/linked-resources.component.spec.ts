import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { TruncatedTextComponent } from '@osf/shared/components/truncated-text/truncated-text.component';

import { LinkedResourcesComponent } from './linked-resources.component';

describe.skip('LinkedProjectsComponent', () => {
  let component: LinkedResourcesComponent;
  let fixture: ComponentFixture<LinkedResourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LinkedResourcesComponent,
        ...MockComponents(TruncatedTextComponent, IconComponent, ContributorsListComponent),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LinkedResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
