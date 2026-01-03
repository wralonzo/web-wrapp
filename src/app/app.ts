import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModalHostComponent } from '@shared/components/custom-modal/modal-host.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { ToastComponent } from '@shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent, ModalHostComponent, LoaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  styles: [],
})
export class App {
  protected readonly title = signal('web-retail');
}
