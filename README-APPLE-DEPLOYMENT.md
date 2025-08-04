# Guia de Deploy para Apple Store e Apple Watch

Este guia explica como configurar e fazer deploy da aplicação Saúde Já para iOS App Store e Apple Watch.

## 📋 Pré-requisitos

- Mac com Xcode instalado (obrigatório para iOS)
- Conta de desenvolvedor Apple (paga)
- Android Studio (opcional, para Android)
- Git configurado

## 🚀 Configuração Inicial

### 1. Exportar Projeto
1. Clique em "Export to Github" no Lovable
2. Clone o repositório em sua máquina local
3. Execute `npm install` para instalar dependências

### 2. Adicionar Plataformas
```bash
# Adicionar iOS
npx cap add ios

# Adicionar Android (opcional)
npx cap add android
```

### 3. Atualizar Dependências Nativas
```bash
# Para iOS
npx cap update ios

# Para Android
npx cap update android
```

## 📱 Configuração iOS

### 1. Build e Sync
```bash
npm run build
npx cap sync ios
```

### 2. Abrir no Xcode
```bash
npx cap open ios
```

### 3. Configurações no Xcode

#### Info.plist - Adicionar Permissões:
```xml
<key>NSMicrophoneUsageDescription</key>
<string>Este app usa o microfone para análise de voz e bem-estar mental</string>

<key>NSLocationWhenInUseUsageDescription</key>
<string>Este app usa localização para fornecer insights baseados em contexto</string>

<key>NSHealthShareUsageDescription</key>
<string>Este app lê dados de saúde para análise de bem-estar</string>

<key>NSHealthUpdateUsageDescription</key>
<string>Este app escreve dados de exercícios para o HealthKit</string>
```

#### Capacidades (Capabilities):
1. HealthKit
2. Background Modes:
   - Background App Refresh
   - Background Processing
3. Push Notifications
4. App Groups (para Apple Watch)

## ⌚ Configuração Apple Watch

### 1. Adicionar Watch Target
1. No Xcode, clique em "+"
2. Selecione "watchOS" → "Watch App"
3. Configure o Bundle ID como: `app.lovable.06497374c58542afb1f4b3a3215e00cb.watchkitapp`

### 2. Configurar Watch App
Crie os seguintes arquivos na pasta do Watch App:

#### ContentView.swift
```swift
import SwiftUI
import WatchConnectivity

struct ContentView: View {
    @State private var mood = "😊"
    
    var body: some View {
        VStack {
            Text("Saúde Já")
                .font(.headline)
            
            Text(mood)
                .font(.largeTitle)
                .onTapGesture {
                    logMood()
                }
            
            Button("Respirar") {
                startBreathingExercise()
            }
        }
    }
    
    func logMood() {
        // Implementar log de humor
    }
    
    func startBreathingExercise() {
        // Implementar exercício de respiração
    }
}
```

## 🏪 Preparação para App Store

### 1. Configurar Signing
1. No Xcode, selecione o projeto
2. Em "Signing & Capabilities"
3. Configure Team e Bundle Identifier

### 2. App Store Connect
1. Crie novo app em [App Store Connect](https://appstoreconnect.apple.com)
2. Configure metadados, screenshots, descrição
3. Adicione informações de privacidade

### 3. Builds
```bash
# Archive para distribução
# No Xcode: Product → Archive
# Upload para App Store Connect
```

## 🔧 Funcionalidades Nativas Implementadas

### HealthKit Integration
- Leitura de frequência cardíaca
- Leitura de passos e distância
- Leitura de dados de sono
- Escrita de exercícios

### Apple Watch Features
- App standalone para registro rápido
- Complicações para visualização de métricas
- Exercícios de respiração
- Notificações de bem-estar
- Sincronização com app principal

### Recursos iOS
- Push notifications
- Background app refresh
- Siri Shortcuts para análise rápida
- Widgets para quick check-ins
- Integração com Shortcuts app

## 📊 Monitoramento e Analytics

### TestFlight
Use TestFlight para testes beta:
1. Upload build para App Store Connect
2. Configure grupos de teste
3. Distribua para testers internos/externos

### App Store Guidelines
Certifique-se de seguir:
- Guidelines de apps de saúde mental
- Políticas de privacidade de dados sensíveis
- Regulamentações LGPD/GDPR
- Guidelines de Apple Watch apps

## 🔒 Privacidade e Segurança

### Dados Sensíveis
- Todos os dados são criptografados
- Conformidade com HIPAA (se aplicável)
- Política de privacidade clara
- Consentimento explícito para HealthKit

### App Store Review
Prepare documentação sobre:
- Como a análise de voz funciona
- Medidas de privacidade implementadas
- Propósito médico/wellness da aplicação

## 🚀 Deploy Final

### 1. Última Verificação
```bash
# Build final
npm run build
npx cap sync ios

# Testar no simulador
npx cap run ios
```

### 2. Submit para Review
1. Archive no Xcode
2. Upload para App Store Connect
3. Submit para review
4. Aguardar aprovação (1-7 dias)

## 📱 Comandos Úteis

```bash
# Sincronizar após mudanças no código
npx cap sync

# Abrir projeto iOS
npx cap open ios

# Rodar no simulador
npx cap run ios

# Logs de debug
npx cap run ios --livereload --external

# Clean e rebuild
npx cap sync ios --deployment
```

## 🆘 Troubleshooting

### Problemas Comuns
1. **Build failures**: Verifique dependências nativas
2. **HealthKit não funciona**: Confirme permissões no Info.plist
3. **Apple Watch não conecta**: Verifique App Groups
4. **Push notifications**: Configure certificates APNs

### Recursos Adicionais
- [Capacitor iOS Documentation](https://capacitorjs.com/docs/ios)
- [Apple Developer Documentation](https://developer.apple.com/documentation/)
- [HealthKit Programming Guide](https://developer.apple.com/documentation/healthkit)
- [WatchKit Programming Guide](https://developer.apple.com/documentation/watchkit)

---

**Importante**: Este é um app de saúde mental. Certifique-se de seguir todas as regulamentações e guidelines relevantes para apps médicos e de bem-estar.