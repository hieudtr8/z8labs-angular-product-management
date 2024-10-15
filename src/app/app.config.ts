import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { provideCharts, withDefaultRegisterables } from "ng2-charts";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
    provideHttpClient(withFetch()),
    provideCharts(withDefaultRegisterables()),
    CommonModule
  ]
};
