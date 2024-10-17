import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, FormControlDirective, FormDirective, FormLabelDirective, FormSelectDirective, FormTextDirective, RowComponent, TextColorDirective } from "@coreui/angular";

export const sharedImports = [
  CommonModule,
  RowComponent,
  ColComponent,
  TextColorDirective,
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
]

export const formImports = [
  CommonModule,
  RowComponent,
  ColComponent,
  ButtonDirective,
  ReactiveFormsModule,
  FormDirective,
  FormControlDirective,
  FormLabelDirective,
  FormTextDirective,
  FormSelectDirective
]
