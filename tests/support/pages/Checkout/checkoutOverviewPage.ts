import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { HeaderComponent } from '@components/headerComponent';
import { ROUTES } from '@constants/routes.constants';
import { TEXTS } from '@constants/texts.constants';

// Checkout, etapa 2: resumo do pedido (/checkout-step-two.html)
export class CheckoutOverviewPage {
  private readonly page: Page;
  readonly header: HeaderComponent;

  constructor(page: Page) {
    this.page = page;
    this.header = new HeaderComponent(page);
  }

  get itensResumo() {
    return this.page.locator('[data-test="cart-list"] [data-test="inventory-item"]');
  }

  get subtotal() {
    return this.page.locator('[data-test="subtotal-label"]');
  }

  get imposto() {
    return this.page.locator('[data-test="tax-label"]');
  }

  get total() {
    return this.page.locator('[data-test="total-label"]');
  }

  get botaoFinalizar() {
    return this.page.locator('[data-test="finish"]');
  }

  // Confirma que a tela aberta é o resumo do Checkout: URL, título e componentes
  async validarTela(): Promise<void> {
    await expect(this.page).toHaveURL(ROUTES.CHECKOUT_STEP_TWO);
    await expect(this.page).toHaveTitle(TEXTS.BROWSER_TITLE);
    await expect(this.header.tituloTela).toHaveText(TEXTS.CHECKOUT.OVERVIEW_TITLE);
    await this.header.validar();
    await expect(this.subtotal).toHaveText(/^Item total: \$\d+\.\d{2}$/);
    await expect(this.imposto).toHaveText(/^Tax: \$\d+\.\d{2}$/);
    await expect(this.total).toHaveText(/^Total: \$\d+\.\d{2}$/);
    await expect(this.botaoFinalizar).toBeVisible();
  }

  async verificarQuantidadeItens(esperado: number): Promise<void> {
    await expect(this.itensResumo).toHaveCount(esperado);
  }

  async finalizarCompra(): Promise<void> {
    await this.botaoFinalizar.click();
  }
}
