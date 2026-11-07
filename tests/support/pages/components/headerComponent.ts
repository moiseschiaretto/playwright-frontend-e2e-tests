import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { TEXTS } from '@constants/texts.constants';

// Cabeçalho comum às telas logadas: logo, menu lateral e carrinho
export class HeaderComponent {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get logo() {
    return this.page.locator('.app_logo');
  }

  get botaoMenu() {
    return this.page.locator('#react-burger-menu-btn');
  }

  get menuLateral() {
    return this.page.locator('.bm-menu-wrap');
  }

  get itensMenu() {
    return this.page.locator('.bm-item-list > a.menu-item');
  }

  get linkLogout() {
    return this.page.locator('[data-test="logout-sidebar-link"]');
  }

  get linkCarrinho() {
    return this.page.locator('[data-test="shopping-cart-link"]');
  }

  get badgeCarrinho() {
    return this.page.locator('[data-test="shopping-cart-badge"]');
  }

  get tituloTela() {
    return this.page.locator('[data-test="title"]');
  }

  async validar(): Promise<void> {
    await expect(this.logo).toHaveText(TEXTS.LOGO);
    await expect(this.botaoMenu).toBeVisible();
    await expect(this.linkCarrinho).toBeVisible();
  }

  async verificarQuantidadeNoBadge(esperado: number): Promise<void> {
    if (esperado === 0) {
      await expect(this.badgeCarrinho).toHaveCount(0);
      return;
    }
    await expect(this.badgeCarrinho).toHaveText(String(esperado));
  }

  // O menu lateral (react-burger-menu) termina de inicializar cerca de 500 ms depois
  // de a tela carregar, quando recebe o atributo hidden. Um clique antes disso abre o menu,
  // mas o atributo é aplicado em seguida e o menu fica oculto. Por isso, o clique só
  // acontece depois da inicialização, e o teste espera o fim da animação de abertura.
  async abrirMenu(): Promise<void> {
    await expect(this.menuLateral).toHaveAttribute('hidden');
    await this.botaoMenu.click();
    await expect(this.menuLateral).toHaveAttribute('aria-hidden', 'false');
    await expect(this.linkLogout).toBeInViewport({ ratio: 1 });
  }

  async verificarItensMenu(): Promise<void> {
    await expect(this.itensMenu).toHaveText([...TEXTS.MENU_ITEMS]);
  }

  async fazerLogout(): Promise<void> {
    await this.abrirMenu();
    await this.linkLogout.click();
  }

  async irParaCarrinho(): Promise<void> {
    await this.linkCarrinho.click();
  }
}
