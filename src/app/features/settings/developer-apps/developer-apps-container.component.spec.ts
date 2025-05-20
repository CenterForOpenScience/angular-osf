import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MockPipe, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeveloperAppsContainerComponent } from './developer-apps-container.component';

describe('DeveloperAppsComponent', () => {
  let component: DeveloperAppsContainerComponent;
  let fixture: ComponentFixture<DeveloperAppsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeveloperAppsContainerComponent, MockPipe(TranslatePipe)],
      providers: [MockProvider(TranslateService)],
    }).compileComponents();

    fixture = TestBed.createComponent(DeveloperAppsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
