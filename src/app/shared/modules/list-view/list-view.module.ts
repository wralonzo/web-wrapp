import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '@shared/components/button/button.component';
import { TableListComponent } from '@shared/components/table-list/table-list.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, FormsModule, ButtonComponent, TableListComponent],
})
export class ListViewModule {}
