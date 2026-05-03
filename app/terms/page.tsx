import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Termos de Serviço</h1>
          <p className="text-white/50 mb-12">Última atualização: Março de 2026</p>

          <div className="space-y-10 text-white/80">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Aceitação dos Termos</h2>
              <p className="leading-relaxed">
                Ao acessar ou usar o serviço ZIG, você concorda em ficar vinculado a estes Termos de 
                Serviço. Se você não concordar com qualquer parte dos termos, não poderá acessar o serviço.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Descrição do Serviço</h2>
              <p className="leading-relaxed">
                A ZIG é uma plataforma de streaming de música que permite aos usuários ouvir músicas, 
                criar playlists, seguir artistas e compartilhar experiências musicais com amigos. 
                Nosso serviço é oferecido gratuitamente, podendo incluir recursos premium no futuro.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Elegibilidade</h2>
              <p className="leading-relaxed mb-4">Para usar nosso serviço, você deve:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Ter pelo menos 13 anos de idade</li>
                <li>Fornecer informações precisas e completas no cadastro</li>
                <li>Manter a segurança de sua conta e senha</li>
                <li>Não compartilhar suas credenciais com terceiros</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Conta do Usuário</h2>
              <p className="leading-relaxed">
                Você é responsável por manter a confidencialidade de sua conta e senha. Você concorda 
                em notificar imediatamente a ZIG sobre qualquer uso não autorizado de sua conta. A ZIG 
                não será responsável por perdas decorrentes do uso não autorizado de sua conta.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Uso Aceitável</h2>
              <p className="leading-relaxed mb-4">Ao usar o serviço, você concorda em NÃO:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Violar leis ou direitos de terceiros</li>
                <li>Fazer upload de conteúdo ilegal, ofensivo ou prejudicial</li>
                <li>Tentar hackear, modificar ou comprometer o serviço</li>
                <li>Usar bots, scrapers ou ferramentas automatizadas</li>
                <li>Redistribuir ou comercializar o conteúdo sem autorização</li>
                <li>Criar contas falsas ou se passar por outra pessoa</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Propriedade Intelectual</h2>
              <p className="leading-relaxed">
                Todo o conteúdo disponível através do serviço ZIG, incluindo músicas, artes, logotipos 
                e marcas registradas, são propriedade da ZIG ou de seus licenciadores. Você recebe uma 
                licença limitada, não exclusiva e revogável para acessar e usar o serviço apenas para 
                fins pessoais e não comerciais.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Conteúdo do Usuário</h2>
              <p className="leading-relaxed">
                Ao enviar conteúdo para o serviço (como playlists, comentários ou fotos de perfil), 
                você concede à ZIG uma licença mundial, não exclusiva, livre de royalties para usar, 
                reproduzir e exibir esse conteúdo em conexão com o serviço. Você mantém a propriedade 
                de seu conteúdo original.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Limitação de Responsabilidade</h2>
              <p className="leading-relaxed">
                O serviço é fornecido "como está" e "conforme disponível". A ZIG não garante que o 
                serviço será ininterrupto, seguro ou livre de erros. Em nenhuma circunstância a ZIG 
                será responsável por danos indiretos, incidentais, especiais ou consequentes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Modificações do Serviço</h2>
              <p className="leading-relaxed">
                A ZIG reserva-se o direito de modificar ou descontinuar o serviço, temporária ou 
                permanentemente, a qualquer momento, com ou sem aviso prévio. Não seremos responsáveis 
                perante você ou terceiros por qualquer modificação, suspensão ou descontinuação.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Rescisão</h2>
              <p className="leading-relaxed">
                Podemos encerrar ou suspender sua conta imediatamente, sem aviso prévio, por violação 
                destes Termos. Após a rescisão, seu direito de usar o serviço cessará imediatamente. 
                Você pode excluir sua conta a qualquer momento através das configurações.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Lei Aplicável</h2>
              <p className="leading-relaxed">
                Estes Termos serão regidos e interpretados de acordo com as leis do Brasil, sem 
                consideração a conflitos de disposições legais. Qualquer disputa será resolvida nos 
                tribunais competentes de São Paulo, Brasil.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">12. Alterações nos Termos</h2>
              <p className="leading-relaxed">
                Reservamo-nos o direito de modificar estes termos a qualquer momento. Mudanças 
                significativas serão comunicadas por e-mail ou notificação no serviço. O uso 
                continuado após as alterações constitui aceitação dos novos termos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">13. Contato</h2>
              <p className="leading-relaxed">
                Para questões sobre estes Termos de Serviço, entre em contato:
              </p>
              <p className="mt-4">
                <span className="text-[#FF4532]">E-mail:</span> legal@zig.com<br />
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
