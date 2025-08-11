import { TranslatePipe } from '@ngx-translate/core';
import { MockComponents, MockPipes } from 'ng-mocks';

import { DatePipe } from '@angular/common';
import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPaginatorComponent, IconComponent } from '@shared/components';

import { RecentActivityListComponent } from './recent-activity-list.component';

describe('RecentActivityListComponent', () => {
  let component: RecentActivityListComponent;
  let componentRef: ComponentRef<RecentActivityListComponent>;
  let fixture: ComponentFixture<RecentActivityListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RecentActivityListComponent,
        ...MockComponents(IconComponent, CustomPaginatorComponent),
        MockPipes(TranslatePipe, DatePipe),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RecentActivityListComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    componentRef.setInput('reviews', []);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
