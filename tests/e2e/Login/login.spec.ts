import { test } from '@playwright/test';
import { LoginPage } from '@pages/Login/loginPage';
import { InventoryPage } from '@pages/Inventory/inventoryPage';
import { getCredentials } from '@helpers/credentials';
import { ROUTES } from '@constants/routes.constants';
import { TEXTS } from '@constants/texts.constants';
import { loadTestData } from '@support/schemas';

test.describe('Login', () => {
  // Regra de convenção: suites deslogadas devem sobrescrever o storageState do projeto
  test.use({ storageState: { cookies: [], origins: [] } });

  test('Deve exibir a Home de Login com todos os componentes', async ({ page }) => {
    const login = new LoginPage(page);

    await login.abrir();
    await login.validarTela();
    await login.verificarCamposVazios();
    await login.verificarSemMensagemErro();
  });

  test('Deve fazer login com sucesso (standard_user)', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);

    await login.abrir();
    await login.validarTela();
    await login.logarComo('standard');

    await inventory.validarTela();
  });

  test('Deve bloquear login de usuário bloqueado (locked_out_user)', async ({ page }) => {
    const login = new LoginPage(page);

    await login.abrir();
    await login.validarTela();
    await login.logarComo('lockedOut');

    await login.verificarMensagemErro(TEXTS.ERRORS.LOCKED_OUT);
  });

  test('Deve exibir erro com senha inválida', async ({ page }) => {
    const login = new LoginPage(page);
    const { username } = getCredentials('standard');
    const { login: dadosLogin } = loadTestData();

    await login.abrir();
    await login.validarTela();
    await login.preencherCredenciais(username, dadosLogin.senhaInvalida);

    await login.verificarMensagemErro(TEXTS.ERRORS.INVALID_CREDENTIALS);
  });

  test('Deve exigir usuário e senha preenchidos', async ({ page }) => {
    const login = new LoginPage(page);

    await login.abrir();
    await login.validarTela();
    await login.enviarSemCredenciais();

    await login.verificarMensagemErro(TEXTS.ERRORS.USERNAME_REQUIRED);
  });

  test('Deve fechar a mensagem de erro', async ({ page }) => {
    const login = new LoginPage(page);

    await login.abrir();
    await login.validarTela();
    await login.enviarSemCredenciais();
    await login.verificarMensagemErro(TEXTS.ERRORS.USERNAME_REQUIRED);

    await login.fecharMensagemErro();
    await login.verificarSemMensagemErro();
  });

  test('Deve bloquear o acesso à Home sem login', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);

    await inventory.abrir();

    await login.validarTela();
    await login.verificarMensagemErro(TEXTS.ERRORS.LOGIN_REQUIRED(ROUTES.INVENTORY));
  });
});
