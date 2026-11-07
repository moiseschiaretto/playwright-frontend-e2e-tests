import { test, expect } from '@playwright/test';
import { InventoryPage } from '@pages/Inventory/inventoryPage';
import { LoginPage } from '@pages/Login/loginPage';
import { PRODUCT_SLUGS } from '@constants/routes.constants';

test.describe('Inventário de produtos', () => {
  test('Deve exibir a Home após o login com todos os componentes', async ({ page }) => {
    const inventory = new InventoryPage(page);

    await inventory.abrir();
    await inventory.validarTela();
    await inventory.header.verificarQuantidadeNoBadge(0);
  });

  test('Deve adicionar produto ao carrinho e atualizar o badge', async ({ page }) => {
    const inventory = new InventoryPage(page);

    await inventory.abrir();
    await inventory.validarTela();
    await inventory.header.verificarQuantidadeNoBadge(0);

    await inventory.adicionarAoCarrinho(PRODUCT_SLUGS.BACKPACK);

    await inventory.verificarBotaoRemover(PRODUCT_SLUGS.BACKPACK);
    await inventory.header.verificarQuantidadeNoBadge(1);
  });

  test('Deve ordenar produtos por preço (menor para maior)', { tag: '@desktop-only' }, async ({ page }) => {
    const inventory = new InventoryPage(page);

    await inventory.abrir();
    await inventory.validarTela();
    await inventory.ordenarPor('lohi');

    const precos = await inventory.obterPrecos();
    const precosOrdenados = [...precos].sort((a, b) => a - b);
    expect(precos).toEqual(precosOrdenados);
  });

  test('Deve ordenar produtos por nome (A a Z)', { tag: '@desktop-only' }, async ({ page }) => {
    const inventory = new InventoryPage(page);

    await inventory.abrir();
    await inventory.validarTela();
    await inventory.ordenarPor('az');

    const nomes = await inventory.obterNomes();
    const nomesOrdenados = [...nomes].sort((a, b) => a.localeCompare(b));
    expect(nomes).toEqual(nomesOrdenados);
  });

  test('Deve exibir as opções do menu lateral', async ({ page }) => {
    const inventory = new InventoryPage(page);

    await inventory.abrir();
    await inventory.validarTela();
    await inventory.header.abrirMenu();

    await inventory.header.verificarItensMenu();
  });

  test('Deve fazer logout e voltar para a Home de Login', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const login = new LoginPage(page);

    await inventory.abrir();
    await inventory.validarTela();
    await inventory.header.fazerLogout();

    await login.validarTela();
    await login.verificarCamposVazios();
  });
});
