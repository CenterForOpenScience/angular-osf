import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { NotificationSettingsComponent } from './notification-settings.component';

describe('NotificationSettingsComponent', () => {
  let component: NotificationSettingsComponent;
  let fixture: ComponentFixture<NotificationSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationSettingsComponent, MockPipe(TranslatePipe)],
      providers: [MockProvider(ActivatedRoute, { params: of({}) })],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
