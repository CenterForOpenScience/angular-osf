import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from '@osf/app.component';
import { appConfig } from '@osf/app.config';

import 'cedar-embeddable-editor';
import 'cedar-artifact-viewer';

// eslint-disable-next-line no-console
bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
