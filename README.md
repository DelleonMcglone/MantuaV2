# Mantua - AI-Powered Blockchain Data Explorer

An advanced AI-powered blockchain data explorer for Uniswap v4 liquidity management, offering intelligent, conversational transaction execution on Base Sepolia blockchain with enhanced user interaction and dynamic swap capabilities.

## 🚀 Features

- **Conversational DeFi Interface**: Natural language processing for blockchain interactions
- **Uniswap v4 Integration**: Advanced liquidity management with hook support
- **Smart Swap Interface**: Intelligent token swapping with MEV protection
- **Liquidity Pool Management**: Create, manage, and optimize liquidity positions
- **Hook System**: Support for custom hooks including Dynamic Fee, TWAMM, Limit Orders, and MEV Protection
- **Real-time Analytics**: Live blockchain data and transaction monitoring
- **Base Sepolia Support**: Full integration with Base Sepolia testnet

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Framer Motion** for animations
- **Wagmi** for Ethereum interactions
- **OnchainKit** by Coinbase

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **Drizzle ORM** for database operations
- **PostgreSQL** for data persistence

### Blockchain
- **Base Sepolia** testnet
- **Uniswap v4** protocol integration
- **Custom hooks** for enhanced functionality
- **Wallet integration** via OnchainKit

## 📦 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd mantua
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your environment variables:
- Database connection details
- API keys for external services
- Blockchain RPC endpoints

5. Set up the database:
```bash
npm run db:push
```

6. Start the development server:
```bash
npm run dev
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL=your_postgresql_connection_string

# Blockchain
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_RPC_URL=https://sepolia.base.org

# API Keys (obtain from respective services)
COINBASE_API_KEY=your_coinbase_api_key
NEBULA_API_KEY=your_nebula_api_key

# Optional: Custom configurations
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
```

## 🎯 Usage

### Basic Operations

1. **Connect Wallet**: Click the connect button to link your Web3 wallet
2. **Natural Language Commands**: Use conversational language for DeFi operations
3. **Swap Tokens**: "Swap 0.01 ETH for USDC"
4. **Add Liquidity**: "Add liquidity to ETH/USDC pool"
5. **Manage Positions**: "Increase my liquidity position"

### Advanced Features

- **Hook Selection**: Choose from various Uniswap v4 hooks for enhanced functionality
- **Custom Hooks**: Deploy and use your own smart contract hooks
- **Batch Operations**: Execute multiple transactions efficiently
- **Analytics Dashboard**: Monitor your positions and performance

## 🔗 Supported Networks

- **Base Sepolia** (Primary testnet)
- Mainnet support coming soon

## 🏗 Architecture

```
mantua/
├── client/           # React frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── lib/         # Utilities and helpers
│   │   └── pages/       # Application pages
├── server/           # Express.js backend
│   ├── routes.ts    # API routes
│   └── storage.ts   # Database operations
├── shared/          # Shared types and schemas
│   └── schema.ts    # Drizzle database schema
└── docs/           # Documentation
```

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run specific test categories:
```bash
npm run test:unit
npm run test:integration
npm run test:e2e
```

## 🚀 Deployment

The application is optimized for deployment on:

- **Replit Deployments** (Recommended)
- **Vercel**
- **Netlify**
- **Railway**

### Deploy to Replit
1. Push your code to this repository
2. Connect to Replit Deployments
3. Configure environment variables
4. Deploy automatically

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write comprehensive tests
- Document new features
- Ensure accessibility compliance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Live Demo](https://your-app-url.replit.app)
- [Documentation](./docs/)
- [API Reference](./docs/api.md)
- [Contributing Guide](./CONTRIBUTING.md)

## 🙋‍♂️ Support

For support and questions:

- Create an [Issue](../../issues)
- Join our [Discord Community](#)
- Follow us on [Twitter](#)

## 🚧 Roadmap

- [ ] Mainnet deployment
- [ ] Additional DEX integrations
- [ ] Advanced analytics dashboard
- [ ] Mobile application
- [ ] Multi-chain support
- [ ] Advanced trading strategies

---

Built with ❤️ for the DeFi community