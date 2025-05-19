import { TranslateModule } from '@ngx-translate/core';
import { MockModule } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { MeetingsLandingComponent } from './meetings-landing.component';

describe('MeetingsLandingComponent', () => {
  let component: MeetingsLandingComponent;
  let fixture: ComponentFixture<MeetingsLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetingsLandingComponent, MockModule(TranslateModule), MockModule(RouterModule)],
    }).compileComponents();

    fixture = TestBed.createComponent(MeetingsLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
