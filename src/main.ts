import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from '@osf/app.component';
import { appConfig } from '@osf/app.config';

bootstrapApplication(AppComponent, {
  providers: [...appConfig.providers],
}).catch((err) => console.error(err));
