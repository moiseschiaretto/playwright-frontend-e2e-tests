import { test } from '@playwright/test';
import { CheckoutInformationPage } from '@pages/Checkout/checkoutInformationPage';
import { CheckoutOverviewPage } from '@pages/Checkout/checkoutOverviewPage';
import { CheckoutCompletePage } from '@pages/Checkout/checkoutCompletePage';
import { prepararCarrinho } from '@helpers/cart.helper';
import { PRODUCT_IDS } from '@constants/routes.constants';
import { TEXTS } from '@constants/texts.constants';
import { loadTestData } from '@support/schemas';

test.describe('Checkout', () => {
  test('Deve concluir a compra com dados válidos', async ({ page }) => {
    const information = new CheckoutInformationPage(page);
    const overview = new CheckoutOverviewPage(page);
    const complete = new CheckoutCompletePage(page);
    const { checkout: dadosCheckout } = loadTestData();
    await prepararCarrinho(page, [PRODUCT_IDS.BACKPACK]);

    await information.abrir();
    await information.validarTela();
    await information.preencherDadosEntrega(dadosCheckout);

    await overview.validarTela();
    await overview.verificarQuantidadeItens(1);
    await overview.finalizarCompra();

    await complete.validarTela();
  });

  test('Deve bloquear checkout sem preencher o nome', async ({ page }) => {
    const information = new CheckoutInformationPage(page);
    const { checkout: dadosCheckout } = loadTestData();
    await prepararCarrinho(page, [PRODUCT_IDS.BACKPACK]);

    await information.abrir();
    await information.validarTela();
    await information.preencherDadosEntrega({ ...dadosCheckout, nome: '' });

    await information.verificarErroValidacao(TEXTS.ERRORS.FIRST_NAME_REQUIRED);
  });
});
