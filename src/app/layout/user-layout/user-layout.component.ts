import { Component } from '@angular/core';
import { DefaultLayoutComponent } from "../default-layout";
import { navUserItems } from "../default-layout/_nav";
import { INavData } from "@coreui/angular";

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    DefaultLayoutComponent
  ],
  template: `
    <app-default-layout
      [navPropsItems]="navUserItems"
    />
  `,
})
export class UserLayoutComponent {
  public navUserItems: INavData[] = navUserItems;

  constructor() {}
}
