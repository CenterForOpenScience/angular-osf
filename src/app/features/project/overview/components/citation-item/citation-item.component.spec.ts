import { MockComponents, MockProvider } from 'ng-mocks';

import { Clipboard } from '@angular/cdk/clipboard';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconComponent } from '@shared/components';
import { TranslateServiceMock } from '@shared/mocks';
import { ToastService } from '@shared/services';

import { CitationItemComponent } from './citation-item.component';

describe('CitationItemComponent', () => {
  let component: CitationItemComponent;
  let fixture: ComponentFixture<CitationItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitationItemComponent, ...MockComponents(IconComponent)],
      providers: [TranslateServiceMock, MockProvider(Clipboard), MockProvider(ToastService)],
    }).compileComponents();

    fixture = TestBed.createComponent(CitationItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('citation', 'Test Citation');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
