import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '@core/services/user.service';
import { User } from '@shared/models/user/user.model';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { ModalComponent } from '@shared/components/modal-form/modal.component';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '@shared/components/input/input.component';
import { PageConfiguration } from 'src/app/page-configurations';
import { GenericHttpBridge } from '@assets/retail-shop/rust_retail';
import { IpService } from '@core/services/ip.service';

@Component({
  selector: 'app-view-user',
  standalone: true,
  imports: [CommonModule, RouterLink, ModalComponent, FormsModule, InputComponent],
  templateUrl: './view.component.html',
})
export class ViewUserComponent extends PageConfiguration implements OnInit {
  // Recibe el :id de la URL automáticamente gracias a withComponentInputBinding
  id = signal<number>(0);
  // Estado del componente
  user = signal<User | null>(null);
  isLoading = signal(true);
  isCopied = signal(false);

  // Datos para el formulario de la modal
  formData = signal({
    password: '',
    confirmPassword: '',
    reason: '',
  });

  showModal = signal(false);
  loading = signal(false);

  private readonly userService = inject(UserService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly ipService = inject(IpService);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.id.set(Number(id));
    this.loadUser();
  }

  async loadUser() {
    try {
      const response: User = await this.rustService.call(async (brige: GenericHttpBridge) => {
        return brige.get(`/user/${this.id()}/profile`);
      });
      const warehouse = await this.loadWarehouse(response.employee?.warehouseId!);
      response.employee!.warehouseName = warehouse.name ?? "";
      this.logger.info(this.loadUser.name, response);
      this.user.set(response);
      this.isLoading.set(false);
    } catch (error) {
      this.provideError(error);
    }
  }

  private async loadWarehouse(id: number) {
    try {
      const response = await this.rustService.call(async (brige: GenericHttpBridge) => {
        return brige.get(`/warehouse/${id}`);
      });
      this.logger.info(this.loadWarehouse.name, response);
      return response;
    } catch (error) {
      this.provideError(error);
    }
  }

  // MÉTODO: Activar / Desactivar
  async toggleStatus() {
    try {
      const currentUser = this.user();
      if (!currentUser) return;

      const newStatus = !currentUser.user.enabled;
      if (!newStatus) {
        await this.rustService.call(async (bridge: GenericHttpBridge) => {
          return await bridge.patch(`/user/${currentUser.user.id}/deactivate`, {});
        });
        this.user.update((u) => (u ? { ...u, user: { ...u.user, enabled: newStatus } } : null));
        return this.toast.show(`Usuario desactivado`, 'success');
      }
      await this.rustService.call(async (bridge: GenericHttpBridge) => {
        return await bridge.patch(`/user/${currentUser.user.id}/activate`, {});
      });
      this.user.update((u) => (u ? { ...u, user: { ...u.user, enabled: newStatus } } : null));
      return this.toast.show(`Usuario activado`, 'success');
    } catch (error) {
      this.provideError(error);
    }
  }

  // MÉTODO: Cambiar Contraseña
  async changePassword() {
    const currentUser = this.user();
    if (!currentUser) return;

    this.showModal.set(true);
  }

  getInitials(name: string): string {
    return name
      ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
      : '??';
  }

  onCancel() {
    this.showModal.set(false);
    this.formData.set({ password: '', confirmPassword: '', reason: '' });
  }

  async submitForm() {
    try {
      if (this.formData().password !== this.formData().confirmPassword) {
        this.toast.show('Las contraseñas no coinciden.', 'error');
        return;
      }
      if (this.formData().password.length < 8) {
        this.toast.show('La contraseña debe tener al menos 8 caracteres.', 'error');
        return;
      }
      if (!this.formData().reason.trim()) {
        this.toast.show('Debe proporcionar un motivo para el cambio de contraseña.', 'error');
        return;
      }
      this.logger.info(this.submitForm.name, 'Valores capturados:', this.formData());
      const currentUser = this.user();
      if (!currentUser) return;
      const newPassword = this.formData().password;
      if (newPassword && newPassword.length >= 8) {
        const localIp = await this.ipService.getLocalIp();
        this.logger.info(this.submitForm.name, 'IP local detectada:', localIp);

        await this.rustService.call(async (bridge: GenericHttpBridge) => {
          return bridge.patch(`/user/${currentUser.user.id}/password`, {
            newPassword,
            channel: 'App-Top-Fashion-Web',
            motive: this.formData().reason,
            ipLocal: localIp,
          });
        });
        this.formData.set({ password: '', confirmPassword: '', reason: '' });
        this.toast.show('Contraseña actualizada correctamente', 'success');
        this.showModal.set(false);
      }
    } catch (error) {
      this.provideError(error);
    }
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      this.isCopied.set(true);
      setTimeout(() => this.isCopied.set(false), 2000); // Vuelve al icono normal tras 2 seg
      this.toast.show('Copiado', 'success');
    });
  }

  editUser() {
    this.router.navigate(['/app/users/edit', this.user()?.user.id]);
  }
}
