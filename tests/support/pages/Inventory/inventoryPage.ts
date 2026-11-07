import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { HeaderComponent } from '@components/headerComponent';
import { FooterComponent } from '@components/footerComponent';
import { ROUTES } from '@constants/routes.constants';
import { TEXTS } from '@constants/texts.constants';

export interface DadosProduto {
  nome: string;
  descricao: string;
  preco: string;
}

// Home após o Login (/inventory.html)
export class InventoryPage {
  private readonly page: Page;
  readonly header: HeaderComponent;
  readonly footer: FooterComponent;

  constructor(page: Page) {
    this.page = page;
    this.header = new HeaderComponent(page);
    this.footer = new FooterComponent(page);
  }

  get listaProdutos() {
    return this.page.locator('[data-test="inventory-list"]');
  }

  get produtos() {
    return this.page.locator('[data-test="inventory-item"]');
  }

  get nomesProdutos() {
    return this.page.locator('[data-test="inventory-item-name"]');
  }

  get precosProdutos() {
    return this.page.locator('[data-test="inventory-item-price"]');
  }

  get seletorOrdenacao() {
    return this.page.locator('[data-test="product-sort-container"]');
  }

  get ordenacaoAtiva() {
    return this.page.locator('[data-test="active-option"]');
  }

  produto(nomeProduto: string) {
    return this.produtos.filter({ has: this.page.locator('[data-test="inventory-item-name"]', { hasText: nomeProduto }) });
  }

  botaoAdicionar(produtoSlug: string) {
    return this.page.locator(`[data-test="add-to-cart-${produtoSlug}"]`);
  }

  botaoRemover(produtoSlug: string) {
    return this.page.locator(`[data-test="remove-${produtoSlug}"]`);
  }

  async abrir(): Promise<void> {
    await this.page.goto(ROUTES.INVENTORY);
  }

  // Confirma que a tela aberta é a Home após o Login: URL, título e componentes
  async validarTela(): Promise<void> {
    await expect(this.page).toHaveURL(ROUTES.INVENTORY);
    await expect(this.page).toHaveTitle(TEXTS.BROWSER_TITLE);
    await expect(this.header.tituloTela).toHaveText(TEXTS.INVENTORY.TITLE);
    await this.header.validar();
    await expect(this.seletorOrdenacao.locator('option')).toHaveText([...TEXTS.INVENTORY.SORT_OPTIONS]);
    await expect(this.ordenacaoAtiva).toHaveText(TEXTS.INVENTORY.DEFAULT_SORT);
    await expect(this.listaProdutos).toBeVisible();
    await expect(this.produtos).toHaveCount(TEXTS.INVENTORY.TOTAL_PRODUCTS);
    await this.validarComponentesDosProdutos();
    await this.footer.validar();
  }

  // Cada produto precisa ter nome, descrição, preço no formato $00.00, imagem e botão
  async validarComponentesDosProdutos(): Promise<void> {
    const total = await this.produtos.count();
    for (let i = 0; i < total; i++) {
      const item = this.produtos.nth(i);
      const nome = (await item.locator('[data-test="inventory-item-name"]').textContent()) ?? '';
      expect(nome.trim()).not.toBe('');
      await expect(item.locator('[data-test="inventory-item-desc"]')).not.toBeEmpty();
      await expect(item.locator('[data-test="inventory-item-price"]')).toHaveText(/^\$\d+\.\d{2}$/);
      await expect(item.locator('img[data-test$="-img"]')).toHaveAttribute('alt', nome);
      await expect(item.locator('button[data-test^="add-to-cart-"]')).toHaveText(TEXTS.BUTTONS.ADD_TO_CART);
    }
  }

  async obterDadosProduto(nomeProduto: string): Promise<DadosProduto> {
    const item = this.produto(nomeProduto);
    return {
      nome: (await item.locator('[data-test="inventory-item-name"]').textContent()) ?? '',
      descricao: (await item.locator('[data-test="inventory-item-desc"]').textContent()) ?? '',
      preco: (await item.locator('[data-test="inventory-item-price"]').textContent()) ?? '',
    };
  }

  async abrirProduto(nomeProduto: string): Promise<void> {
    await this.produto(nomeProduto).locator('[data-test="inventory-item-name"]').click();
  }

  async adicionarAoCarrinho(produtoSlug: string): Promise<void> {
    await this.botaoAdicionar(produtoSlug).click();
  }

  async verificarBotaoRemover(produtoSlug: string): Promise<void> {
    await expect(this.botaoRemover(produtoSlug)).toHaveText(TEXTS.BUTTONS.REMOVE);
  }

  async ordenarPor(opcao: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.seletorOrdenacao.selectOption(opcao);
  }

  async obterPrecos(): Promise<number[]> {
    const textos = await this.precosProdutos.allTextContents();
    return textos.map((t) => Number(t.replace('$', '')));
  }

  async obterNomes(): Promise<string[]> {
    return this.nomesProdutos.allTextContents();
  }
}
