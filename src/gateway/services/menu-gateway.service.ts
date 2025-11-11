import { Injectable } from '@nestjs/common';
import { MenuService } from '../../modules/menu/menu.service';

@Injectable()
export class MenuGatewayService {
  constructor(private readonly menuService: MenuService) {}

  async getFullMenu() {
    return this.menuService.findAll();
  }

  async getItemById(id: number) {
    return this.menuService.findById(id);
  }

  async searchByCategory(category: string) {
    return this.menuService.findByCategory(category);
  }
}
