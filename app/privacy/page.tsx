import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full px-[5%] py-6 flex items-center gap-10 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <Link href="/" className="flex items-center gap-3 text-white/70 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Voltar</span>
        </Link>
        <div className="flex items-center gap-2">
          <img 
            src="/Logo.png" 
            alt="ZIG" 
            className="h-8 w-auto"
            style={{ objectFit: 'contain' }}
          />
          <span className="text-white font-bold text-xl tracking-wide">ZIG</span>
        </div>
      </header>

      {/* Content */}
      <main className="pt-32 pb-20 px-[5%]">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Política de Privacidade</h1>
          <p className="text-white/50 mb-12">Última atualização: Março de 2026</p>

          <div className="space-y-10 text-white/80">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Introdução</h2>
              <p className="leading-relaxed">
                A ZIG ("nós", "nosso" ou "empresa") está comprometida em proteger sua privacidade. 
                Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos 
                suas informações quando você usa nosso serviço de streaming de música.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Informações que Coletamos</h2>
              <p className="leading-relaxed mb-4">Podemos coletar as seguintes informações:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Informações de conta: nome, e-mail, nome de usuário e senha</li>
                <li>Informações de perfil: foto, preferências musicais e playlists</li>
                <li>Dados de uso: músicas ouvidas, tempo de reprodução e interações</li>
                <li>Informações do dispositivo: tipo de dispositivo, sistema operacional e IP</li>
                <li>Dados de localização: país e região (com sua permissão)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Como Usamos suas Informações</h2>
              <p className="leading-relaxed mb-4">Utilizamos suas informações para:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Fornecer e manter nosso serviço</li>
                <li>Personalizar sua experiência musical</li>
                <li>Criar recomendações baseadas em suas preferências</li>
                <li>Processar transações e enviar notificações</li>
                <li>Melhorar nosso serviço e desenvolver novos recursos</li>
                <li>Proteger contra fraudes e uso não autorizado</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Compartilhamento de Informações</h2>
              <p className="leading-relaxed">
                Não vendemos suas informações pessoais. Podemos compartilhar dados com parceiros de 
                confiança apenas para operar nosso serviço, cumprir obrigações legais ou proteger 
                nossos direitos. Quando compartilhamos dados, exigimos que esses parceiros mantenham 
                sua confidencialidade.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Segurança dos Dados</h2>
              <p className="leading-relaxed">
                Implementamos medidas de segurança técnicas e organizacionais para proteger suas 
                informações contra acesso não autorizado, alteração, divulgação ou destruição. 
                Isso inclui criptografia, controles de acesso e auditorias regulares de segurança.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Seus Direitos</h2>
              <p className="leading-relaxed mb-4">Você tem o direito de:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Acessar e obter uma cópia de seus dados pessoais</li>
                <li>Corrigir informações imprecisas</li>
                <li>Solicitar a exclusão de seus dados</li>
                <li>Retirar seu consentimento a qualquer momento</li>
                <li>Exportar seus dados em formato portátil</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Retenção de Dados</h2>
              <p className="leading-relaxed">
                Mantemos suas informações pelo tempo necessário para fornecer nossos serviços ou 
                conforme exigido por lei. Quando você exclui sua conta, removemos seus dados pessoais 
                em até 30 dias, exceto quando a retenção for legalmente necessária.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Alterações nesta Política</h2>
              <p className="leading-relaxed">
                Podemos atualizar esta política periodicamente. Notificaremos você sobre mudanças 
                significativas por e-mail ou através de um aviso em nosso serviço. Recomendamos 
                revisar esta página regularmente.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Contato</h2>
              <p className="leading-relaxed">
                Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco:
              </p>
              <p className="mt-4">
                <span className="text-[#FF4532]">E-mail:</span> privacidade@zig.com<br />
                <span className="text-[#FF4532]">Endereço:</span> São Paulo, Brasil
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-[5%]">
        <div className="max-w-3xl mx-auto flex flex-wrap gap-6 justify-center text-sm text-white/50">
          <Link href="/privacy" className="hover:text-white transition-colors">Privacidade</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Termos</Link>
          <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
        </div>
      </footer>
    </div>
  )
}
