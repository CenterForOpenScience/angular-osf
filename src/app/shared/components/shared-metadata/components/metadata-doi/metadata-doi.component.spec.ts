import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MOCK_PROJECT_OVERVIEW, TranslateServiceMock } from '@osf/shared/mocks';

import { MetadataDoiComponent } from './metadata-doi.component';

describe('MetadataDoiComponent', () => {
  let component: MetadataDoiComponent;
  let fixture: ComponentFixture<MetadataDoiComponent>;

  const mockDoi: string | undefined = MOCK_PROJECT_OVERVIEW.doi;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetadataDoiComponent],
      providers: [TranslateServiceMock],
    }).compileComponents();

    fixture = TestBed.createComponent(MetadataDoiComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set current input', () => {
    fixture.componentRef.setInput('doi', mockDoi);
    fixture.detectChanges();

    expect(component.doi()).toEqual(mockDoi);
  });

  it('should emit editDoi event when onCreateDoi is called', () => {
    const emitSpy = jest.spyOn(component.editDoi, 'emit');

    component.onCreateDoi();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit editDoi event when onEditDoi is called', () => {
    const emitSpy = jest.spyOn(component.editDoi, 'emit');

    component.onEditDoi();

    expect(emitSpy).toHaveBeenCalled();
  });
});
