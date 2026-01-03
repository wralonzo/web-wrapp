import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '@shared/components/button/button.component';
import { RouterLink } from '@angular/router';
import { CheckboxComponent } from '@shared/components/checkbox/checkbox.component';
import { InputComponent } from '@shared/components/input/input.component';
import { CustomSelectComponent } from '@shared/components/select/select.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ButtonComponent,
    CustomSelectComponent,
    FormsModule,
    InputComponent,
    CheckboxComponent,
    RouterLink,
  ],
})
export class AddViewModule {}
