# 🌍 CityOrbit Mobile

> Monitorando a Terra do Espaço — FIAP Global Solution 2026

Aplicativo mobile desenvolvido em **React Native + Expo SDK 55 + TypeScript** que utiliza dados espaciais da NASA e dados climáticos em tempo real para monitorar objetos próximos à Terra e condições climáticas.

---

## 👥 Integrantes

| Nome | RM |
|---|---|
| João Vitor Carotta Ribeiro | RM 555187 |
| Arthur Bueno de Oliveira | RM 558396 |
| Victor Magdaleno Marcos | RM 556729 |

---

## 📱 Funcionalidades

### 🏠 Início (Home)
- Imagem Astronômica do Dia (NASA APOD) com título e descrição
- Dados climáticos em tempo real via satélite (Open-Meteo)
- Indicadores de monitoramento orbital (NEOs próximos à Terra)
- Pull-to-refresh para atualizar dados

### 🛰️ Satélites (NEOs)
- Listagem de objetos próximos à Terra nos próximos 7 dias
- Busca por nome do objeto
- Filtros: Todos / Risco Potencial / Seguros
- Ordenação: Data / Distância / Velocidade / Magnitude
- Dados: distância, velocidade, diâmetro estimado e data de aproximação

### ⭐ Favoritos
- Salvar imagens APOD e asteroides localmente (AsyncStorage)
- Filtrar por tipo (APOD / NEO)
- Remover itens individualmente ou em lote

### ⚙️ Configurações
- Alternância Dark Mode / Light Mode
- Seleção de cidade padrão para dados climáticos
- Informações sobre as APIs utilizadas
- Limpeza de dados locais

---

## 🛰️ Relação com a Indústria Espacial

- **NASA APOD**: imagens astronômicas capturadas por satélites e telescópios espaciais
- **NASA NEO Feed**: monitoramento de asteroides e objetos próximos à Terra
- **Open-Meteo**: dados climáticos derivados de satélites meteorológicos
- Alinhado às **ODS 9, 11 e 13** da ONU

---

## 🧱 Arquitetura

```
src/
├── components/     # Card, Badge, SearchBar, StatCard, SkeletonLoader, Header, EmptyState
├── screens/        # HomeScreen, SatellitesScreen, FavoritesScreen, SettingsScreen, ApodDetailScreen
├── navigation/     # RootNavigator (Stack + BottomTabs), types
├── services/       # nasaService, weatherService, api (axios instances)
├── hooks/          # useApod, useNeoFeed, useWeather
├── contexts/       # ThemeContext (dark/light), FavoritesContext
├── storage/        # StorageService (AsyncStorage wrapper)
├── types/          # nasa.ts, weather.ts
├── theme/          # Colors, Spacing, FontSize, BorderRadius
└── utils/          # formatters
```

---

## 🌍 APIs Utilizadas

| API | Descrição | Autenticação |
|---|---|---|
| [NASA APOD](https://api.nasa.gov/) | Imagem Astronômica do Dia | `DEMO_KEY` (gratuita) |
| [NASA NEO Feed](https://api.nasa.gov/) | Objetos Próximos à Terra | `DEMO_KEY` (gratuita) |
| [Open-Meteo](https://open-meteo.com/) | Dados climáticos | Nenhuma (100% gratuita) |

---

## 🚀 Como Executar

### Pré-requisitos
- [Node.js](https://nodejs.org/) 18+
- [Expo Go](https://expo.dev/client) no celular (Android ou iOS)

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/cityorbit-mobile.git
cd cityorbit-mobile

# 2. Instale as dependências
npm install

# 3. Inicie o projeto
npm start
```

### Executar nas plataformas

```bash
npm run android   # Android (emulador ou dispositivo físico)
npm run ios       # iOS (somente macOS)
npm run web       # Navegador web
```

Ou escaneie o QR Code com o app **Expo Go**.


Link do site publicado no Render:

https://cityorbit-mobile.onrender.com/

---

## 📦 Principais Dependências

| Biblioteca | Versão | Uso |
|---|---|---|
| expo | ~55.0.0 | Framework base |
| react-native | 0.76.7 | UI mobile |
| @react-navigation/native | ^6.1.18 | Navegação |
| @react-navigation/bottom-tabs | ^6.6.1 | Tab bar |
| @react-navigation/native-stack | ^6.11.0 | Stack navigation |
| axios | ^1.7.9 | Consumo de APIs |
| @react-native-async-storage/async-storage | 2.1.2 | Persistência local |

---

## 🧠 Conceitos Aplicados

- **React Native** — componentes, props, state, hooks, FlatList, ScrollView, Modal
- **TypeScript** — tipagem forte, interfaces, generics, types
- **Context API** — estado global (tema e favoritos)
- **Custom Hooks** — useApod, useNeoFeed, useWeather
- **Service Layer** — nasaService, weatherService com Axios + interceptors
- **AsyncStorage** — favoritos e preferências persistidos localmente
- **Dark/Light Mode** — sistema de cores via ThemeContext
- **Skeleton Loading** — feedback visual durante carregamento
- **Navegação** — Stack + Bottom Tabs tipados com React Navigation v6

---

## 🎨 Design System

- **Paleta Espacial**: Navy profundo `#0A0E1A` + Ciano `#00D4FF`
- **Tema Escuro/Claro**: alternância dinâmica
- **Componentização**: Card, Badge, StatCard, EmptyState, SkeletonLoader
- **Tipografia**: pesos variados para hierarquia visual
- **Feedback**: loading states, pull-to-refresh, alertas de confirmação
