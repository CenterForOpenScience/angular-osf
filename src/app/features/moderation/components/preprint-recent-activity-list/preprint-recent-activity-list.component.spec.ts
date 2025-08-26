import { TranslatePipe } from '@ngx-translate/core';
import { MockComponents, MockPipes } from 'ng-mocks';

import { DatePipe } from '@angular/common';
import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPaginatorComponent, IconComponent } from '@osf/shared/components';

import { PreprintRecentActivityListComponent } from './preprint-recent-activity-list.component';

describe('PreprintRecentActivityListComponent', () => {
  let component: PreprintRecentActivityListComponent;
  let componentRef: ComponentRef<PreprintRecentActivityListComponent>;
  let fixture: ComponentFixture<PreprintRecentActivityListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PreprintRecentActivityListComponent,
        ...MockComponents(IconComponent, CustomPaginatorComponent),
        MockPipes(TranslatePipe, DatePipe),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintRecentActivityListComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    componentRef.setInput('reviews', []);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
