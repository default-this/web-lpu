import { EnvironmentProviders, isDevMode, makeEnvironmentProviders } from '@angular/core';
import { provideTransloco } from '@ngneat/transloco';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslocoMessageformat } from '@ngneat/transloco-messageformat';

import { I18nLoaderService } from './i18n-loader.service';
import { Language } from './language';
import { getEnumValues } from '../get-enum-values';

export function provideI18n(): EnvironmentProviders {
    return makeEnvironmentProviders([
        provideTransloco({
            config: {
                availableLangs: getEnumValues(Language),
                defaultLang: Language.English,
                reRenderOnLangChange: true,
                prodMode: !isDevMode()
            },
            loader: I18nLoaderService
        }),
        provideTranslocoMessageformat({
            locales: getEnumValues(Language)
        }),
        provideHttpClient()
    ]);
}