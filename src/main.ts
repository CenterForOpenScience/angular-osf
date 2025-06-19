import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from '@osf/app.component';
import { appConfig } from '@osf/app.config';

// Import CEDAR Embeddable Editor web component
import 'cedar-embeddable-editor';

bootstrapApplication(AppComponent, {
  providers: [...appConfig.providers],
}).catch((err) => console.error(err));
