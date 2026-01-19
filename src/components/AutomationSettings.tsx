import { useState, useEffect } from 'react';
import { Settings, Mail, MessageCircle, Save, Clock } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface AutomationSettingsProps {
  accessToken: string;
}

export function AutomationSettings({ accessToken }: AutomationSettingsProps) {
  const [enabled, setEnabled] = useState(false);
  const [frequency, setFrequency] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [email, setEmail] = useState('');
  const [sendEmail, setSendEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7f44b203/automation-settings`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        const settings = data.settings;
        setEnabled(settings.enabled || false);
        setFrequency(settings.frequency || 'monthly');
        setEmail(settings.email || '');
        setSendEmail(settings.sendEmail || false);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setSuccess(false);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7f44b203/automation-settings`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            enabled,
            frequency,
            email,
            sendEmail
          })
        }
      );

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings size={20} className="text-gray-700" />
        <h2 className="text-gray-900">Automação de Relatórios</h2>
      </div>

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          Configurações salvas com sucesso!
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Clock className="text-gray-600" size={20} />
            <div>
              <div className="text-gray-900">Ativar envio automático</div>
              <div className="text-sm text-gray-500">Receba relatórios periodicamente</div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {enabled && (
          <>
            <div>
              <label className="block text-gray-700 text-sm mb-2">Frequência de Envio</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as 'weekly' | 'monthly' | 'yearly')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensal</option>
                <option value="yearly">Anual</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">
                {frequency === 'weekly' && 'Relatórios enviados toda segunda-feira'}
                {frequency === 'monthly' && 'Relatórios enviados no primeiro dia do mês'}
                {frequency === 'yearly' && 'Relatórios enviados no primeiro dia do ano'}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="sendEmail"
                  checked={sendEmail}
                  onChange={(e) => setSendEmail(e.target.checked)}
                  className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                />
                <label htmlFor="sendEmail" className="flex items-center gap-2 text-gray-700">
                  <Mail size={18} />
                  Enviar por E-mail
                </label>
              </div>

              {sendEmail && (
                <div>
                  <label className="block text-gray-700 text-sm mb-2">E-mail para envio</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="seu@email.com"
                  />
                </div>
              )}
            </div>
          </>
        )}

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Save size={18} />
          {loading ? 'Salvando...' : 'Salvar Configurações'}
        </button>

        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Nota:</strong> Os envios de e-mail são simulados nesta versão. 
            Para ativar o envio real, configure um serviço de e-mail (SendGrid, Resend, etc).
          </p>
        </div>
      </div>
    </div>
  );
}