import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistryRevisionsComponent } from './registry-revisions.component';

describe('RegistryRevisionsComponent', () => {
  let component: RegistryRevisionsComponent;
  let fixture: ComponentFixture<RegistryRevisionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistryRevisionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistryRevisionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
