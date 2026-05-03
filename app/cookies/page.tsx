import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function CookiesPage() {
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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Política de Cookies</h1>
          <p className="text-white/50 mb-12">Última atualização: Março de 2026</p>

          <div className="space-y-10 text-white/80">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. O que são Cookies?</h2>
              <p className="leading-relaxed">
                Cookies são pequenos arquivos de texto armazenados no seu dispositivo (computador, 
                tablet ou celular) quando você visita nosso site. Eles nos ajudam a lembrar suas 
                preferências, entender como você usa nosso serviço e melhorar sua experiência geral.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Tipos de Cookies que Usamos</h2>
              
              <div className="space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-[#FF4532] mb-2">Cookies Essenciais</h3>
                  <p className="text-sm leading-relaxed">
                    Necessários para o funcionamento básico do site. Permitem navegar e usar recursos 
                    essenciais como áreas seguras e carrinho de compras. Sem eles, o site não funciona corretamente.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-[#FF4532] mb-2">Cookies de Desempenho</h3>
                  <p className="text-sm leading-relaxed">
                    Coletam informações sobre como você usa nosso site, quais páginas visita e se encontra 
                    erros. Esses dados são anônimos e usados apenas para melhorar o funcionamento do site.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-[#FF4532] mb-2">Cookies de Funcionalidade</h3>
                  <p className="text-sm leading-relaxed">
                    Lembram suas escolhas (como nome de usuário, idioma ou região) para proporcionar uma 
                    experiência mais personalizada. Também podem ser usados para lembrar configurações de reprodução.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-[#FF4532] mb-2">Cookies de Marketing</h3>
                  <p className="text-sm leading-relaxed">
                    Rastreiam sua atividade em diferentes sites para exibir anúncios relevantes. Também 
                    limitam o número de vezes que você vê um anúncio e medem a eficácia das campanhas.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Cookies de Terceiros</h2>
              <p className="leading-relaxed mb-4">
                Alguns cookies são colocados por serviços de terceiros que aparecem em nossas páginas. 
                Usamos cookies de terceiros para:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Google Analytics - análise de tráfego e comportamento</li>
                <li>Redes sociais - compartilhamento e integração</li>
                <li>Provedores de pagamento - processamento seguro</li>
                <li>CDNs - entrega rápida de conteúdo</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Duração dos Cookies</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-3 h-3 rounded-full bg-[#FF4532] mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium">Cookies de Sessão</h4>
                    <p className="text-sm">Temporários, excluídos quando você fecha o navegador.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-3 h-3 rounded-full bg-[#FF4532] mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium">Cookies Persistentes</h4>
                    <p className="text-sm">Permanecem no dispositivo por um período definido (dias a anos).</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Como Gerenciar Cookies</h2>
              <p className="leading-relaxed mb-4">
                Você pode controlar e gerenciar cookies de várias maneiras. Lembre-se de que remover 
                ou bloquear cookies pode afetar sua experiência e partes do site podem não funcionar corretamente.
              </p>
              
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                <h4 className="text-white font-medium">Configurações do Navegador</h4>
                <p className="text-sm leading-relaxed mb-4">
                  A maioria dos navegadores permite controlar cookies através das configurações:
                </p>
                <ul className="text-sm space-y-2">
                  <li>• <span className="text-white">Chrome:</span> Configurações → Privacidade e segurança → Cookies</li>
                  <li>• <span className="text-white">Firefox:</span> Opções → Privacidade e Segurança → Cookies</li>
                  <li>• <span className="text-white">Safari:</span> Preferências → Privacidade → Cookies</li>
                  <li>• <span className="text-white">Edge:</span> Configurações → Cookies e permissões do site</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Tecnologias Similares</h2>
              <p className="leading-relaxed">
                Além de cookies, podemos usar tecnologias similares como web beacons, pixels de 
                rastreamento e armazenamento local (localStorage). Essas tecnologias funcionam de 
                maneira similar aos cookies e estão sujeitas às mesmas políticas descritas aqui.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Atualizações desta Política</h2>
              <p className="leading-relaxed">
                Podemos atualizar esta Política de Cookies periodicamente para refletir mudanças em 
                nossas práticas ou por outras razões operacionais, legais ou regulatórias. Recomendamos 
                verificar esta página regularmente para se manter informado.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Contato</h2>
              <p className="leading-relaxed">
                Se você tiver dúvidas sobre nosso uso de cookies, entre em contato:
              </p>
              <p className="mt-4">
                <span className="text-[#FF4532]">E-mail:</span> cookies@zig.com<br />
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
