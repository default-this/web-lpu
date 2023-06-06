import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom, isDevMode } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DialogModule } from '@angular/cdk/dialog';

import { LayoutComponent } from './app/main/layout';
import { provideApplicationStore } from './app/store';
import { LOG_LEVEL, LogLevel } from './app/common/logging';
import { provideI18n } from './app/i18n';
import { provideRouting } from './app/routing';
import { provideControllersPlugins } from './app/plugins';

bootstrapApplication(LayoutComponent, {
    providers: [
        provideRouting(),
        provideI18n(),
        provideAnimations(),
        provideControllersPlugins(),
        importProvidersFrom(MatSnackBarModule),
        provideApplicationStore(),
        importProvidersFrom(DialogModule),
        { provide: LOG_LEVEL, useValue: isDevMode() ? LogLevel.Debug : LogLevel.Warning },
    ]
});
