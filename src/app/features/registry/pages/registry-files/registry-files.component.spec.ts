import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistryFilesComponent } from './registry-files.component';

describe('RegistryFilesComponent', () => {
  let component: RegistryFilesComponent;
  let fixture: ComponentFixture<RegistryFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistryFilesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistryFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
