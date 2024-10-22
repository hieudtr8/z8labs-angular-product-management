import { Component } from '@angular/core';
import { DefaultLayoutComponent } from "../default-layout";
import { navAdminItems } from "../default-layout/_nav";
import { INavData } from "@coreui/angular";

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    DefaultLayoutComponent
  ],
  template: `
    <app-default-layout
      [navPropsItems]="navAdminItems"
    />
  `,
})
export class AdminLayoutComponent {
  public navAdminItems: INavData[] = navAdminItems;

  constructor() {}
}
