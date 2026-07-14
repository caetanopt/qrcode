import { expect, test } from "@playwright/test";

test.describe("Gerador de QR Code", () => {
  test("cria um QR Code de URL e permite exportar em PNG", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("URL de destino").fill("https://caetano.pt");
    await expect(page.getByRole("img", { name: "Pré-visualização do QR Code gerado" }).locator("canvas:visible")).toBeVisible();

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Transferir" }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe("qrcode-caetano.png");
  });

  test("mostra erro de validação para um URL inválido", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("URL de destino").fill("ftp://exemplo.pt");
    await page.getByLabel("URL de destino").blur();
    await expect(page.getByText("Introduza um endereço válido")).toBeVisible();
  });

  test("cria um QR Code de Wi-Fi com palavra-passe mascarada", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("radio", { name: /Wi-Fi/ }).click();
    await page.getByLabel("Nome da rede (SSID)").fill("Rede Caetano");
    const passwordInput = page.getByRole("textbox", { name: "Palavra-passe" });
    await passwordInput.fill("segredo123");
    await expect(passwordInput).toHaveAttribute("type", "password");
    await expect(page.getByRole("img", { name: "Pré-visualização do QR Code gerado" }).locator("canvas:visible")).toBeVisible();
  });

  test("permite navegar pelo seletor de tipo apenas com o teclado", async ({ page }) => {
    await page.goto("/");
    const urlOption = page.getByRole("radio", { name: /^URL/ });
    await urlOption.focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("radio", { name: /^Texto/ })).toBeFocused();
  });

  test("funciona em viewport mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Escolha o tipo de QR Code" })).toBeVisible();
  });

  test("mantém o conteúdo de cada tipo ao trocar e voltar", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("URL de destino").fill("https://caetano.pt/nissan/");
    await page.getByLabel("Título interno").fill("Campanha Nissan");

    await page.getByRole("radio", { name: /^Texto/ }).click();
    await page.getByLabel("Texto").fill("Conteúdo temporário");

    await page.getByRole("radio", { name: /^URL/ }).click();
    await expect(page.getByLabel("URL de destino")).toHaveValue("https://caetano.pt/nissan/");
    await expect(page.getByLabel("Título interno")).toHaveValue("Campanha Nissan");

    await page.getByRole("radio", { name: /^Texto/ }).click();
    await expect(page.getByLabel("Texto")).toHaveValue("Conteúdo temporário");
  });

  test("mostra o estado vazio (não erro) ao trocar para um tipo nunca preenchido", async ({ page }) => {
    await page.goto("/");
    for (const type of ["Texto", "E-mail", "Telefone", "SMS", "WhatsApp", "Wi-Fi", "Contacto", "Localização", "Evento"]) {
      await page.getByRole("radio", { name: new RegExp(`^${type}`) }).click();
      await expect(page.getByText("Corrija os erros no formulário")).not.toBeVisible();
      await expect(page.getByText("Preencha o formulário para gerar o seu QR Code")).toBeVisible();
    }
  });

  test("mantém o QR fantasma visível ao voltar de um tipo com conteúdo válido", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("radio", { name: /^Localização/ }).click();
    await page.getByLabel("Latitude").fill("41.15");
    await page.getByLabel("Longitude").fill("-8.61");
    await expect(page.getByRole("img", { name: "Pré-visualização do QR Code gerado" }).locator("canvas:visible")).toBeVisible();

    await page.getByRole("radio", { name: /^URL/ }).click();
    await expect(page.getByText("Preencha o formulário para gerar o seu QR Code")).toBeVisible();
    await expect(page.getByRole("img", { name: "Pré-visualização do QR Code gerado" }).locator("canvas:visible")).toBeVisible();
  });

  test("exige palavra-passe em redes Wi-Fi protegidas", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("radio", { name: /Wi-Fi/ }).click();
    await page.getByLabel("Nome da rede (SSID)").fill("Rede Caetano");
    await expect(page.getByText("Introduza a palavra-passe da rede")).toBeVisible();
    await expect(page.getByText("Corrija os erros no formulário")).toBeVisible();

    await page.getByRole("textbox", { name: "Palavra-passe" }).fill("segredo123");
    await expect(page.getByRole("img", { name: "Pré-visualização do QR Code gerado" }).locator("canvas:visible")).toBeVisible();
  });

  test("volta ao estado vazio (sem erro, no campo nem na pré-visualização) ao limpar um campo obrigatório", async ({ page }) => {
    await page.goto("/");
    const urlInput = page.getByLabel("URL de destino");

    await urlInput.fill("https://caetano.pt");
    await urlInput.fill("");
    await expect(page.getByText("Introduza um endereço válido")).not.toBeVisible();
    await expect(page.getByText("Corrija os erros no formulário")).not.toBeVisible();
    await expect(page.getByText("Preencha o formulário para gerar o seu QR Code")).toBeVisible();

    // Genuinely invalid (non-empty) content must still show as an error.
    await urlInput.fill("ftp://exemplo.pt");
    await expect(page.getByText("Introduza um endereço válido")).toBeVisible();

    await urlInput.fill("");
    await expect(page.getByText("Introduza um endereço válido")).not.toBeVisible();
    await expect(page.getByText("Preencha o formulário para gerar o seu QR Code")).toBeVisible();
  });
});
