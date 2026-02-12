import { Injectable } from '@angular/core';
import { RustService } from '@core/rust/rust.service';
import { PurchaseReceptionRequest, PurchaseReceptionResponse } from '@shared/models/purchase/purchase.interface';

@Injectable({
    providedIn: 'root'
})
export class PurchaseService {

    constructor(private rustService: RustService) { }

    async processPurchaseReception(request: PurchaseReceptionRequest): Promise<PurchaseReceptionResponse> {
        return await this.rustService.call(async (bridge) => {
            return await bridge.post('/purchases/reception', request);
        });
    }
}
