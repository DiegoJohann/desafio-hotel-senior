import {ApplicationConfig, importProvidersFrom, LOCALE_ID, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {MAT_DATE_LOCALE} from "@angular/material/core";
import {REMOVE_STYLES_ON_COMPONENT_DESTROY} from "@angular/platform-browser";
import {provideLuxonDateAdapter} from "@angular/material-luxon-adapter";
import {provideHttpClient} from "@angular/common/http";
import {HttpClientInMemoryWebApiModule} from "angular-in-memory-web-api";
import {InMemoryDataService} from "./mock-api/in-memory-data.service";
import {provideNgxMask} from "ngx-mask";
import ptBr from '@angular/common/locales/pt';
import {registerLocaleData} from "@angular/common";

registerLocaleData(ptBr);

export const appConfig: ApplicationConfig = {
    providers: [
        provideHttpClient(),
        importProvidersFrom(HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {dataEncapsulation: false})),
        provideZoneChangeDetection({eventCoalescing: true}),
        provideRouter(routes),
        provideAnimationsAsync(),
        provideLuxonDateAdapter(),
        provideNgxMask(),
        {provide: LOCALE_ID, useValue: 'pt'},
        {
            provide: MAT_DATE_LOCALE,
            useValue: 'pt-BR'
        },
        {
            provide: REMOVE_STYLES_ON_COMPONENT_DESTROY,
            useValue: true
        }
    ]
};
