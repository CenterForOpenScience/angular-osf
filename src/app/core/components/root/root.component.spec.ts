import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RootComponent } from './root.component';

describe('RootComponent', () => {
  let component: RootComponent;
  let fixture: ComponentFixture<RootComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RootComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should detect portrait mode correctly', () => {
    spyOnProperty(window, 'innerHeight').and.returnValue(1000);
    spyOnProperty(window, 'innerWidth').and.returnValue(800);
    expect(component.isPortrait()).toBeTrue();

    spyOnProperty(window, 'innerHeight').and.returnValue(800);
    spyOnProperty(window, 'innerWidth').and.returnValue(1000);
    expect(component.isPortrait()).toBeFalse();
  });
});
