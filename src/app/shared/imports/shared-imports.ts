import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { ButtonDirective, CardBodyComponent, CardComponent, CardFooterComponent, CardHeaderComponent, CardModule, ColComponent, FormControlDirective, FormDirective, FormLabelDirective, FormModule, FormSelectDirective, FormTextDirective, RowComponent, TextColorDirective } from "@coreui/angular";
import { IconDirective } from "@coreui/icons-angular";

export const sharedImports = [
  CommonModule,
  RowComponent,
  ColComponent,
  TextColorDirective,
  CardModule,
  IconDirective
]

export const formImports = [
  CommonModule,
  RowComponent,
  ColComponent,
  ButtonDirective,
  ReactiveFormsModule,
  FormModule,
]
