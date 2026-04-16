import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { LoaderService } from '@osf/shared/services/loader.service';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { LoaderServiceMock } from '@testing/providers/loader-service.mock';

import { FullScreenLoaderComponent } from './full-screen-loader.component';

describe('FullScreenLoaderComponent', () => {
  let component: FullScreenLoaderComponent;
  let fixture: ComponentFixture<FullScreenLoaderComponent>;
  let loaderService: LoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FullScreenLoaderComponent],
      providers: [
        provideOSFCore(),
        {
          provide: LoaderService,
          useClass: LoaderServiceMock,
        },
      ],
    });

    fixture = TestBed.createComponent(FullScreenLoaderComponent);
    component = fixture.componentInstance;
    loaderService = TestBed.inject(LoaderService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject LoaderService', () => {
    expect(TestBed.inject(LoaderService)).toBe(component.loaderService);
  });

  it('should not display loader when isLoading is false', () => {
    fixture.detectChanges();

    const loaderContainer = fixture.debugElement.query(By.css('.container'));
    expect(loaderContainer).toBeFalsy();
  });

  it('should display loader when isLoading is true', () => {
    loaderService.show();
    fixture.detectChanges();

    const loaderContainer = fixture.debugElement.query(By.css('.container'));
    expect(loaderContainer).toBeTruthy();
  });
});
