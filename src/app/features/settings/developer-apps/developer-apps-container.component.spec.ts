import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeveloperAppsContainerComponent } from './developer-apps-container.component';

describe('DeveloperAppsComponent', () => {
  let component: DeveloperAppsContainerComponent;
  let fixture: ComponentFixture<DeveloperAppsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeveloperAppsContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeveloperAppsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
