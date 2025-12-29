import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModalHostComponent } from '@shared/components/custom-modal/modal-host.component';
import { ToastComponent } from '@shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent, ModalHostComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  styles: [],
})
export class App {
  protected readonly title = signal('web-retail');
}
