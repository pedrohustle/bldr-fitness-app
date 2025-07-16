# BLDR - Aplicativo Fitness

Um aplicativo fitness completo desenvolvido em React com funcionalidades de treinos personalizados, acompanhamento nutricional, sistema de progresso e gamificação.

## 🚀 Funcionalidades

- **Dashboard Personalizado**: Visão geral das atividades e progresso
- **Treinos Customizados**: Treinos adaptados ao biotipo, objetivo e nível
- **Acompanhamento Nutricional**: Planos alimentares e controle de macros
- **Sistema de Progresso**: Gráficos de evolução e fotos de progresso
- **Gamificação**: Conquistas, XP e níveis para motivação
- **Autenticação**: Login com Google e email
- **Interface Responsiva**: Funciona em desktop e mobile

## 🛠️ Tecnologias Utilizadas

- **React 18** - Biblioteca para interface do usuário
- **Vite** - Build tool e servidor de desenvolvimento
- **Tailwind CSS** - Framework CSS utilitário
- **Firebase** - Autenticação e banco de dados
- **Heroicons** - Biblioteca de ícones
- **React Router DOM** - Roteamento

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no Firebase (para autenticação)

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd bldr-fitness-app
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

4. Configure o Firebase:
   - Crie um projeto no [Firebase Console](https://console.firebase.google.com)
   - Ative Authentication (Google e Email/Password)
   - Ative Firestore Database
   - Copie as credenciais para o arquivo `.env.local`

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Navigation/      # Componentes de navegação
│   ├── UI/             # Componentes de interface básicos
│   ├── Workout/        # Componentes específicos de treino
│   └── Gamification/   # Componentes de gamificação
├── pages/              # Páginas principais da aplicação
├── contexts/           # Contextos React (estado global)
├── services/           # Integrações com APIs externas
├── data/              # Dados estáticos e de exemplo
└── utils/             # Utilitários e constantes
```

## 🚀 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Executa linting do código

## 📱 Funcionalidades Principais

### Dashboard
- Resumo de atividades do usuário
- Progresso semanal de treinos
- Acesso rápido às funcionalidades principais

### Treinos
- Biblioteca de treinos categorizados
- Filtros por dificuldade, objetivo e biotipo
- Player de treino com cronômetro
- Sistema de conquistas

### Nutrição
- Planos alimentares personalizados
- Controle de macronutrientes
- Receitas saudáveis
- Acompanhamento de refeições

### Progresso
- Gráficos de evolução de peso
- Galeria de fotos de progresso
- Recordes pessoais
- Análise de tendências

### Perfil
- Gerenciamento de dados pessoais
- Configurações de objetivos
- Histórico de conquistas
- Configurações de notificações

## 🔐 Autenticação

O aplicativo suporta autenticação via:
- Google OAuth
- Email e senha
- Criação de conta com dados do perfil fitness

## 🎮 Sistema de Gamificação

- **XP (Pontos de Experiência)**: Ganhos por completar treinos
- **Níveis**: Progressão baseada em XP acumulado
- **Conquistas**: Marcos específicos desbloqueáveis
- **Sequências**: Dias consecutivos de atividade

## 📊 Dados e Personalização

O aplicativo personaliza a experiência baseado em:
- **Biotipo**: Ectomorfo, Mesomorfo, Endomorfo
- **Objetivo**: Hipertrofia, Emagrecimento, Definição, Manutenção
- **Nível**: Iniciante, Intermediário, Avançado
- **Local**: Academia, Casa, Parque

## 🚀 Deploy

### Vercel (Recomendado)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
npx netlify deploy --prod --dir=dist
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte e dúvidas:
- Abra uma issue no GitHub
- Entre em contato via email: suporte@bldr.app

## 🙏 Agradecimentos

- [React](https://reactjs.org/) pela biblioteca incrível
- [Tailwind CSS](https://tailwindcss.com/) pelo framework CSS
- [Firebase](https://firebase.google.com/) pelos serviços de backend
- [Heroicons](https://heroicons.com/) pelos ícones
- Comunidade open source por todas as contribuições

---

Desenvolvido com ❤️ para a comunidade fitness

