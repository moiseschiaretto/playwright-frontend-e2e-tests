import type { Page } from '@playwright/test';

/**
 * Monta o carrinho antes de abrir a tela, sem passar pela lista de produtos.
 * A SauceDemo guarda o carrinho no localStorage, na chave "cart-contents",
 * como lista de ids (ex.: [4] para o Sauce Labs Backpack).
 * O sessionStorage garante que o carrinho é montado só uma vez, mesmo se a página recarregar.
 */
export async function prepararCarrinho(page: Page, idsProdutos: number[]): Promise<void> {
  await page.addInitScript((ids) => {
    if (window.sessionStorage.getItem('carrinho-preparado')) return;
    window.localStorage.setItem('cart-contents', JSON.stringify(ids));
    window.sessionStorage.setItem('carrinho-preparado', 'true');
  }, idsProdutos);
}
