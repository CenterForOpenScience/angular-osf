import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldType } from '@osf/shared/enums/field-type.enum';
import { Question } from '@osf/shared/models/registration/page-schema.model';
import { ViewOnlyLinkHelperService } from '@osf/shared/services/view-only-link-helper.service';

import { MOCK_REVIEW } from '@testing/mocks/review.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideRouterMock, RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { ViewOnlyLinkHelperMock, ViewOnlyLinkHelperMockType } from '@testing/providers/view-only-link-helper.mock';

import { RegistrationBlocksDataComponent } from './registration-blocks-data.component';

const MOCK_QUESTIONS: Question[] = [
  { id: '1', displayText: 'Q1', required: true, responseKey: 'question1', fieldType: FieldType.Text },
  { id: '2', displayText: 'Q2', required: false, responseKey: 'question2', fieldType: FieldType.Checkbox },
];

interface SetupOverrides {
  routerUrl?: string;
  viewOnlyParam?: string | null;
}

describe('RegistrationBlocksDataComponent', () => {
  let component: RegistrationBlocksDataComponent;
  let fixture: ComponentFixture<RegistrationBlocksDataComponent>;
  let routerMock: RouterMockType;
  let viewOnlyHelper: ViewOnlyLinkHelperMockType;

  function setup(overrides: SetupOverrides = {}) {
    routerMock = RouterMockBuilder.create()
      .withUrl(overrides.routerUrl ?? '/')
      .build();
    viewOnlyHelper = ViewOnlyLinkHelperMock.simple();
    viewOnlyHelper.getViewOnlyParamFromUrl.mockReturnValue(
      overrides.viewOnlyParam !== undefined ? overrides.viewOnlyParam : null
    );

    TestBed.configureTestingModule({
      imports: [RegistrationBlocksDataComponent],
      providers: [
        provideOSFCore(),
        provideRouterMock(routerMock),
        MockProvider(ViewOnlyLinkHelperService, viewOnlyHelper),
      ],
    });

    fixture = TestBed.createComponent(RegistrationBlocksDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  beforeEach(() => setup());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute updatedKeysMap from updatedFields', () => {
    fixture.componentRef.setInput('updatedFields', ['question1', 'question3']);
    fixture.detectChanges();

    expect(component.updatedKeysMap()).toEqual({ question1: true, question3: true });
  });

  it('should return empty updatedKeysMap when updatedFields is empty', () => {
    fixture.componentRef.setInput('updatedFields', []);
    fixture.detectChanges();

    expect(component.updatedKeysMap()).toEqual({});
  });

  it('should render questions with review data', () => {
    fixture.componentRef.setInput('questions', MOCK_QUESTIONS);
    fixture.componentRef.setInput('reviewData', MOCK_REVIEW);
    fixture.detectChanges();

    const headings = fixture.nativeElement.querySelectorAll('h4');
    expect(headings.length).toBe(2);
    expect(headings[0].textContent).toContain('Q1');
  });

  it('should show required error when question is required and no data on non-overview page', () => {
    fixture.componentRef.setInput('questions', MOCK_QUESTIONS);
    fixture.componentRef.setInput('reviewData', {});
    fixture.componentRef.setInput('isOverviewPage', false);
    fixture.detectChanges();

    const errorMessages = fixture.nativeElement.querySelectorAll('p-message[severity="error"]');
    expect(errorMessages.length).toBe(1);
  });

  it('should not show required error on overview page', () => {
    fixture.componentRef.setInput('questions', MOCK_QUESTIONS);
    fixture.componentRef.setInput('reviewData', {});
    fixture.componentRef.setInput('isOverviewPage', true);
    fixture.detectChanges();

    const errorMessages = fixture.nativeElement.querySelectorAll('p-message[severity="error"]');
    expect(errorMessages.length).toBe(0);
  });

  it('should show updated tag when field is updated and not original revision', () => {
    fixture.componentRef.setInput('questions', MOCK_QUESTIONS);
    fixture.componentRef.setInput('reviewData', MOCK_REVIEW);
    fixture.componentRef.setInput('updatedFields', ['question1']);
    fixture.componentRef.setInput('isOriginalRevision', false);
    fixture.detectChanges();

    const tags = fixture.nativeElement.querySelectorAll('p-tag');
    expect(tags.length).toBe(1);
  });

  it('should not show updated tag on original revision', () => {
    fixture.componentRef.setInput('questions', MOCK_QUESTIONS);
    fixture.componentRef.setInput('reviewData', MOCK_REVIEW);
    fixture.componentRef.setInput('updatedFields', ['question1']);
    fixture.componentRef.setInput('isOriginalRevision', true);
    fixture.detectChanges();

    const tags = fixture.nativeElement.querySelectorAll('p-tag');
    expect(tags.length).toBe(0);
  });

  it('should return empty string when file url is missing', () => {
    expect(component.getFileUrl()).toBe('');
  });

  it('should return original file url when view_only param is absent', () => {
    const htmlUrl = 'https://osf.io/abc12/';

    expect(component.getFileUrl(htmlUrl)).toBe(htmlUrl);
  });

  it('should append view_only query param to file url', () => {
    viewOnlyHelper.getViewOnlyParamFromUrl.mockReturnValue('token');

    const htmlUrl = 'https://osf.io/abc12/';
    const result = component.getFileUrl(htmlUrl);

    expect(viewOnlyHelper.getViewOnlyParamFromUrl).toHaveBeenCalledWith('/');
    expect(result).toBe('https://osf.io/abc12/?view_only=token');
  });
});
