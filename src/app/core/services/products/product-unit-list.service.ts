import { Injectable } from "@angular/core";
import { PageConfiguration } from "src/app/page-configurations";

@Injectable({
    providedIn: 'root'
})
export class ProductUnitListService extends PageConfiguration {

    public list(productId: number): Promise<any> {
        return this.rustService.call(async (bridge) => {
            return await bridge.get(`/product/units/list?productId=${productId}`);
        });
    }

    public create(productId: number, idUnit: number): Promise<any> {
        return this.rustService.call(async (bridge) => {
            return await bridge.get(`/product/units/list/add?productId=${productId}&idUnit=${idUnit}`);
        });
    }

    public delete(id: number): Promise<any> {
        return this.rustService.call(async (bridge) => {
            return await bridge.patch(`/product/units/list/delete?id=${id}`);
        });
    }

}