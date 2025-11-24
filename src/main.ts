import { bootstrapApplication, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppComponent } from '@osf/app.component';
import { appConfig } from '@osf/app.config';

bootstrapApplication(AppComponent, {
  providers: [...appConfig.providers, provideClientHydration(withEventReplay())],
}).catch((err) =>
  // eslint-disable-next-line no-console
  console.error(err)
);
