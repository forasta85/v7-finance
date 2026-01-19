/**
 * 📧 Templates de Email - V7 Finance
 * 
 * Todos os templates de email em um só lugar para facilitar manutenção
 */

// 🎨 Configurações de Design
const COLORS = {
  primary: '#dc2626',
  primaryDark: '#991b1b',
  dark: '#1f2937',
  lightGray: '#f9fafb',
  border: '#e5e7eb',
  warning: '#f59e0b',
  warningBg: '#fef3c7',
  warningText: '#92400e',
  white: '#ffffff',
  textPrimary: '#1f2937',
  textSecondary: '#4b5563',
  textMuted: '#9ca3af',
};

// 📧 EMAIL: Bem-vindo com Senha Temporária
export function getWelcomeEmailSubject(): string {
  return '🔐 Bem-vindo ao V7 Finance - Suas credenciais de acesso';
}

export function getWelcomeEmailHtml(data: {
  email: string;
  tempPassword: string;
  name?: string;
  appUrl?: string;
}): string {
  const { email, tempPassword, name, appUrl = 'https://v7finance.figma.site' } = data;

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>V7 Finance</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, ${COLORS.dark} 0%, ${COLORS.primaryDark} 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
      <h1 style="color: ${COLORS.white}; margin: 0; font-size: 32px; font-weight: bold;">V7 Finance</h1>
      <p style="color: #e5e7eb; margin: 5px 0 0 0; font-size: 14px;">Gestão Financeira Inteligente</p>
    </div>
    
    <!-- Content -->
    <div style="background: ${COLORS.lightGray}; padding: 30px; border-radius: 0 0 10px 10px;">
      <h2 style="color: ${COLORS.textPrimary}; margin-top: 0; font-size: 24px;">
        ${name ? `Olá, ${name}!` : 'Bem-vindo ao V7 Finance!'}
      </h2>
      
      <p style="color: ${COLORS.textSecondary}; font-size: 16px; line-height: 1.6; margin: 20px 0;">
        Sua conta foi criada com sucesso! 🎉
      </p>
      
      <p style="color: ${COLORS.textSecondary}; font-size: 16px; line-height: 1.6;">
        Use as credenciais abaixo para fazer seu primeiro acesso à plataforma:
      </p>
      
      <!-- Credentials Box -->
      <div style="background: ${COLORS.white}; border: 2px solid ${COLORS.primary}; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <div style="margin: 10px 0;">
          <p style="margin: 0; color: ${COLORS.textSecondary}; font-size: 13px;">📧 Email</p>
          <p style="margin: 5px 0 0 0; color: ${COLORS.textPrimary}; font-size: 16px; font-weight: bold;">${email}</p>
        </div>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 10px 0;">
        <div style="margin: 10px 0;">
          <p style="margin: 0; color: ${COLORS.textSecondary}; font-size: 13px;">🔑 Senha Temporária</p>
          <p style="margin: 5px 0 0 0; color: ${COLORS.textPrimary}; font-size: 16px; font-weight: bold;">
            <code style="background: #fee2e2; padding: 8px 12px; border-radius: 4px; font-size: 16px; font-weight: bold; color: ${COLORS.primaryDark}; letter-spacing: 1px;">${tempPassword}</code>
          </p>
        </div>
      </div>
      
      <!-- Warning Box -->
      <div style="background: ${COLORS.warningBg}; border-left: 4px solid ${COLORS.warning}; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 0; color: ${COLORS.warningText}; font-size: 14px; line-height: 1.5;">
          ⚠️ <strong>Importante:</strong> Por segurança, você será solicitado a alterar sua senha no primeiro acesso.
        </p>
      </div>
      
      <!-- CTA Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="${appUrl}" 
           style="display: inline-block; background: ${COLORS.primary}; color: ${COLORS.white}; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(220, 38, 38, 0.2);">
          🚀 Acessar V7 Finance
        </a>
      </div>
      
      <!-- Tip Box -->
      <div style="background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.5;">
          💡 <strong>Dica:</strong> Copie sua senha temporária antes de clicar no botão acima.
        </p>
      </div>
      
      <!-- Footer -->
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid ${COLORS.border};">
        <p style="color: ${COLORS.textMuted}; font-size: 12px; margin: 0; text-align: center;">
          Este é um email automático, por favor não responda.
        </p>
        <p style="color: ${COLORS.textMuted}; font-size: 12px; margin: 5px 0 0 0; text-align: center;">
          Se você não solicitou esta ação, por favor ignore este email.
        </p>
        <p style="color: ${COLORS.textMuted}; font-size: 11px; margin: 15px 0 0 0; text-align: center;">
          © ${new Date().getFullYear()} V7 Finance. Todos os direitos reservados.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

// 🎯 Exportar objeto com todos os templates
export const emailTemplates = {
  welcome: {
    subject: getWelcomeEmailSubject,
    html: getWelcomeEmailHtml,
  },
};