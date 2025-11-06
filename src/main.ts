import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from '@osf/app.component';
import { appConfig } from '@osf/app.config';

bootstrapApplication(AppComponent, {
  providers: [...appConfig.providers],
}).catch((err) =>
  // eslint-disable-next-line no-console
  console.error(err)
);
