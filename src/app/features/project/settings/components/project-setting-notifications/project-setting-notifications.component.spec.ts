import { MockComponent, MockPipe } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDetailSettingAccordionComponent } from '@osf/features/project/settings/components';
import { NotificationDescriptionPipe } from '@osf/features/project/settings/pipes';
import { SubscriptionEvent, SubscriptionFrequency } from '@osf/shared/enums';
import { MOCK_NOTIFICATION_SUBSCRIPTIONS } from '@osf/shared/mocks';

import { ProjectSettingNotificationsComponent } from './project-setting-notifications.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('ProjectSettingNotificationsComponent', () => {
  let component: ProjectSettingNotificationsComponent;
  let fixture: ComponentFixture<ProjectSettingNotificationsComponent>;

  const mockNotifications = MOCK_NOTIFICATION_SUBSCRIPTIONS;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProjectSettingNotificationsComponent,
        OSFTestingModule,
        MockComponent(ProjectDetailSettingAccordionComponent),
        MockPipe(NotificationDescriptionPipe),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectSettingNotificationsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty accordion data', () => {
    expect(component.allAccordionData).toEqual([]);
  });

  it('should have correct subscription frequency options', () => {
    const expectedOptions = [
      { label: 'Never', value: SubscriptionFrequency.Never },
      { label: 'Daily', value: SubscriptionFrequency.Daily },
      { label: 'Instant', value: SubscriptionFrequency.Instant },
    ];

    expect(component.subscriptionFrequencyOptions).toEqual(expectedOptions);
  });

  it('should update accordion data when notifications input changes', () => {
    fixture.componentRef.setInput('notifications', mockNotifications);
    fixture.detectChanges();

    expect(component.allAccordionData).toBeDefined();
    expect(component.allAccordionData?.length).toBe(4);

    if (component.allAccordionData) {
      expect(component.allAccordionData[0]).toEqual({
        label: 'settings.notifications.notificationPreferences.items.files',
        value: SubscriptionFrequency.Instant,
        type: 'dropdown',
        options: component.subscriptionFrequencyOptions,
        event: SubscriptionEvent.FileUpdated,
      });

      expect(component.allAccordionData[1]).toEqual({
        label: 'settings.notifications.notificationPreferences.items.files',
        value: SubscriptionFrequency.Daily,
        type: 'dropdown',
        options: component.subscriptionFrequencyOptions,
        event: SubscriptionEvent.GlobalFileUpdated,
      });
    }
  });

  it('should emit notification value change when changeEmittedValue is called', () => {
    jest.spyOn(component.notificationEmitValue, 'emit');
    fixture.componentRef.setInput('notifications', mockNotifications);
    fixture.detectChanges();

    const emittedValue = { index: 0, value: SubscriptionFrequency.Never };
    component.changeEmittedValue(emittedValue);

    expect(component.notificationEmitValue.emit).toHaveBeenCalledWith({
      id: mockNotifications[0].id,
      event: SubscriptionEvent.FileUpdated,
      frequency: SubscriptionFrequency.Never,
    });
  });

  it('should not emit when allAccordionData is undefined', () => {
    jest.spyOn(component.notificationEmitValue, 'emit');
    component.allAccordionData = undefined;

    const emittedValue = { index: 0, value: SubscriptionFrequency.Never };
    component.changeEmittedValue(emittedValue);

    expect(component.notificationEmitValue.emit).not.toHaveBeenCalled();
  });

  it('should handle multiple notifications correctly', () => {
    const multipleNotifications = MOCK_NOTIFICATION_SUBSCRIPTIONS.slice(0, 3);

    fixture.componentRef.setInput('notifications', multipleNotifications);
    fixture.detectChanges();

    expect(component.allAccordionData?.length).toBe(3);

    if (component.allAccordionData) {
      expect(component.allAccordionData[0].event).toBe(SubscriptionEvent.FileUpdated);
      expect(component.allAccordionData[1].event).toBe(SubscriptionEvent.GlobalFileUpdated);
      expect(component.allAccordionData[2].event).toBe(SubscriptionEvent.GlobalMentions);
    }
  });
});
