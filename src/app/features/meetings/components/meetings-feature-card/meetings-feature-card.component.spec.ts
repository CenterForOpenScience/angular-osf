import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe } from 'ng-mocks';

import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingsFeatureCardComponent } from './meetings-feature-card.component';

describe('MeetingsFeatureCardComponent', () => {
  let component: MeetingsFeatureCardComponent;
  let componentRef: ComponentRef<MeetingsFeatureCardComponent>;
  let fixture: ComponentFixture<MeetingsFeatureCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetingsFeatureCardComponent, MockPipe(TranslatePipe)],
    }).compileComponents();

    fixture = TestBed.createComponent(MeetingsFeatureCardComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    componentRef.setInput('iconSrc', 'meeting-icon.svg');
    componentRef.setInput('iconAlt', 'Meeting icon');
    componentRef.setInput('titleKey', 'meetings.title');
    componentRef.setInput('descriptionKey', 'meetings.description');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render icon with correct src and alt attributes', () => {
    const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
    expect(img).toBeTruthy();
    expect(img.src).toContain('meeting-icon.svg');
    expect(img.alt).toBe('Meeting icon');
  });

  it('should update icon inputs when setInput is called again', () => {
    componentRef.setInput('iconAlt', 'New meeting icon');
    componentRef.setInput('iconSrc', 'new-meeting-icon.svg');
    fixture.detectChanges();

    const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
    expect(img.src).toContain('new-meeting-icon.svg');
    expect(img.alt).toBe('New meeting icon');
  });
});
