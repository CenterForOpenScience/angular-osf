import { MockComponents, MockProvider } from 'ng-mocks';

import { Clipboard } from '@angular/cdk/clipboard';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { ToastService } from '@osf/shared/services/toast.service';

import { CitationItemComponent } from './citation-item.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('CitationItemComponent', () => {
  let component: CitationItemComponent;
  let fixture: ComponentFixture<CitationItemComponent>;
  let clipboard: jest.Mocked<Clipboard>;
  let toastService: jest.Mocked<ToastService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitationItemComponent, OSFTestingModule, ...MockComponents(IconComponent)],
      providers: [MockProvider(Clipboard), MockProvider(ToastService)],
    }).compileComponents();

    fixture = TestBed.createComponent(CitationItemComponent);
    component = fixture.componentInstance;
    clipboard = TestBed.inject(Clipboard) as jest.Mocked<Clipboard>;
    toastService = TestBed.inject(ToastService) as jest.Mocked<ToastService>;

    fixture.componentRef.setInput('citation', 'Test Citation');
    fixture.detectChanges();
  });

  it('should set citation input correctly', () => {
    const citation = 'Test Citation Text';
    fixture.componentRef.setInput('citation', citation);
    fixture.detectChanges();

    expect(component.citation()).toBe(citation);
  });

  it('should default itemUrl to empty string', () => {
    expect(component.itemUrl()).toBe('');
  });

  it('should set itemUrl input correctly', () => {
    const url = 'https://example.com/citation';
    fixture.componentRef.setInput('itemUrl', url);
    fixture.detectChanges();

    expect(component.itemUrl()).toBe(url);
  });

  it('should default level to 0', () => {
    expect(component.level()).toBe(0);
  });

  it('should set level input correctly', () => {
    const level = 2;
    fixture.componentRef.setInput('level', level);
    fixture.detectChanges();

    expect(component.level()).toBe(level);
  });

  it('should copy citation to clipboard and show success toast', () => {
    const citation = 'Test Citation Text';
    fixture.componentRef.setInput('citation', citation);
    fixture.detectChanges();

    const copySpy = jest.spyOn(clipboard, 'copy');
    const showSuccessSpy = jest.spyOn(toastService, 'showSuccess');

    component.copyCitation();

    expect(copySpy).toHaveBeenCalledWith(citation);
    expect(showSuccessSpy).toHaveBeenCalledWith('settings.developerApps.messages.copied');
  });

  it('should copy long citation text', () => {
    const longCitation = 'A'.repeat(1000);
    fixture.componentRef.setInput('citation', longCitation);
    fixture.detectChanges();

    const copySpy = jest.spyOn(clipboard, 'copy');

    component.copyCitation();

    expect(copySpy).toHaveBeenCalledWith(longCitation);
  });

  it('should copy citation with special characters', () => {
    const specialCitation = 'Test Citation: "Quote" & <Special> Characters';
    fixture.componentRef.setInput('citation', specialCitation);
    fixture.detectChanges();

    const copySpy = jest.spyOn(clipboard, 'copy');

    component.copyCitation();

    expect(copySpy).toHaveBeenCalledWith(specialCitation);
  });
});
