import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { HeaderComponent } from '@components/headerComponent';
import { ROUTES } from '@constants/routes.constants';
import { TEXTS } from '@constants/texts.constants';

// Carrinho (/cart.html)
export class CartPage {
  private readonly page: Page;
  readonly header: HeaderComponent;

  constructor(page: Page) {
    this.page = page;
    this.header = new HeaderComponent(page);
  }

  get listaCarrinho() {
    return this.page.locator('[data-test="cart-list"]');
  }

  get itensCarrinho() {
    return this.page.locator('[data-test="cart-list"] [data-test="inventory-item"]');
  }

  get botaoCheckout() {
    return this.page.locator('[data-test="checkout"]');
  }

  get botaoContinuarComprando() {
    return this.page.locator('[data-test="continue-shopping"]');
  }

  botaoRemover(produtoSlug: string) {
    return this.page.locator(`[data-test="remove-${produtoSlug}"]`);
  }

  async abrir(): Promise<void> {
    await this.page.goto(ROUTES.CART);
  }

  // Confirma que a tela aberta é o Carrinho: URL, título e componentes
  async validarTela(): Promise<void> {
    await expect(this.page).toHaveURL(ROUTES.CART);
    await expect(this.page).toHaveTitle(TEXTS.BROWSER_TITLE);
    await expect(this.header.tituloTela).toHaveText(TEXTS.CART.TITLE);
    await this.header.validar();
    await expect(this.listaCarrinho).toBeVisible();
    await expect(this.botaoCheckout).toHaveText(TEXTS.CART.CHECKOUT_BUTTON);
    await expect(this.botaoContinuarComprando).toHaveText(TEXTS.CART.CONTINUE_SHOPPING_BUTTON);
  }

  async removerProduto(produtoSlug: string): Promise<void> {
    await this.botaoRemover(produtoSlug).click();
  }

  async iniciarCheckout(): Promise<void> {
    await this.botaoCheckout.click();
  }

  async verificarQuantidadeItens(esperado: number): Promise<void> {
    await expect(this.itensCarrinho).toHaveCount(esperado);
  }

  async verificarProdutoPresente(nomeProduto: string): Promise<void> {
    await expect(this.itensCarrinho.locator('[data-test="inventory-item-name"]', { hasText: nomeProduto })).toBeVisible();
  }
}
