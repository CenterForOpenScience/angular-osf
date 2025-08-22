import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { LoaderServiceMock } from '@shared/mocks';
import { LoaderService } from '@shared/services';

import { FullScreenLoaderComponent } from './full-screen-loader.component';

describe('FullScreenLoaderComponent', () => {
  let component: FullScreenLoaderComponent;
  let fixture: ComponentFixture<FullScreenLoaderComponent>;
  let loaderService: LoaderServiceMock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullScreenLoaderComponent],
      providers: [
        {
          provide: LoaderService,
          useClass: LoaderServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FullScreenLoaderComponent);
    component = fixture.componentInstance;
    loaderService = TestBed.inject(LoaderService) as unknown as LoaderServiceMock;
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
