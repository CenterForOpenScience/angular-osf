import { TranslatePipe } from '@ngx-translate/core';
import { MockComponent, MockPipe, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { SocialShareService } from '@osf/shared/services/social-share.service';

import { provideOSFCore } from '@testing/osf.testing.provider';

import { IconComponent } from '../icon/icon.component';

import { SocialsShareButtonComponent } from './socials-share-button.component';

describe('SocialsShareButtonComponent', () => {
  let component: SocialsShareButtonComponent;
  let fixture: ComponentFixture<SocialsShareButtonComponent>;
  let service: SocialShareService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SocialsShareButtonComponent, MockComponent(IconComponent), MockPipe(TranslatePipe)],
      providers: [provideOSFCore(), MockProvider(SocialShareService)],
    });

    fixture = TestBed.createComponent(SocialsShareButtonComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(SocialShareService);

    vi.spyOn(service, 'createPreprintUrl').mockReturnValue('https://web/preprints/providerX/id123');
    vi.spyOn(service, 'createGuidUrl').mockReturnValue('https://web/guid-id999');
    vi.spyOn(service, 'generateSocialActionItems').mockReturnValue([]);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('uses createPreprintUrl when resourceType is Preprint', () => {
    fixture.componentRef.setInput('resourceId', 'id123');
    fixture.componentRef.setInput('resourceProvider', 'providerX');
    fixture.componentRef.setInput('resourceTitle', 'Title');
    fixture.componentRef.setInput('resourceType', ResourceType.Preprint);
    fixture.detectChanges();

    component.socialsActionItems();

    expect(service.createPreprintUrl).toHaveBeenCalledWith('id123', 'providerX');
    expect(service.createGuidUrl).not.toHaveBeenCalled();
  });

  it('uses createGuidUrl when resourceType is not Preprint', () => {
    fixture.componentRef.setInput('resourceId', 'id999');
    fixture.componentRef.setInput('resourceTitle', 'Another Title');
    fixture.componentRef.setInput('resourceType', ResourceType.Project);
    fixture.detectChanges();

    component.socialsActionItems();

    expect(service.createGuidUrl).toHaveBeenCalledWith('id999');
    expect(service.createPreprintUrl).not.toHaveBeenCalled();
  });
});
