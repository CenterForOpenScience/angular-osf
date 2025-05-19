import { TranslateModule } from '@ngx-translate/core';
import { MockModule } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { MeetingDetailsComponent } from './meeting-details.component';

describe('MeetingDetailsComponent', () => {
  let component: MeetingDetailsComponent;
  let fixture: ComponentFixture<MeetingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetingDetailsComponent, MockModule(TranslateModule), MockModule(RouterModule)],
    }).compileComponents();

    fixture = TestBed.createComponent(MeetingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
