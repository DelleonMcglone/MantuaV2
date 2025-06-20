# Contributing to Mantua

We welcome contributions to Mantua! This guide will help you get started with contributing to our AI-powered blockchain data explorer.

## Development Setup

1. Fork the repository on GitHub
2. Clone your fork locally:
```bash
git clone https://github.com/YOUR_USERNAME/mantua.git
cd mantua
```

3. Install dependencies:
```bash
npm install
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. Start the development server:
```bash
npm run dev
```

## Project Structure

```
mantua/
├── client/src/
│   ├── components/     # React components
│   ├── lib/           # Utilities and helpers
│   ├── pages/         # Application pages
│   └── hooks/         # Custom React hooks
├── server/
│   ├── routes.ts      # API endpoints
│   └── storage.ts     # Database operations
├── shared/
│   └── schema.ts      # Database schemas
└── docs/              # Documentation
```

## Code Style

- Use TypeScript for all new code
- Follow the existing code formatting
- Use Tailwind CSS for styling
- Write descriptive component and function names
- Add comments for complex logic

## Making Changes

1. Create a new branch for your feature:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes following the code style guidelines
3. Test your changes thoroughly
4. Commit your changes with a descriptive message:
```bash
git commit -m "Add: new feature description"
```

## Pull Request Process

1. Push your branch to your fork:
```bash
git push origin feature/your-feature-name
```

2. Create a pull request on GitHub
3. Provide a clear description of your changes
4. Link any related issues
5. Wait for review and address any feedback

## Types of Contributions

### Bug Fixes
- Fix functionality issues
- Improve error handling
- Address security vulnerabilities

### Features
- New blockchain integrations
- Enhanced UI components
- Additional DeFi protocols
- Performance optimizations

### Documentation
- Improve README
- Add code comments
- Create tutorials
- Update API documentation

## Testing

Run tests before submitting:
```bash
npm test
```

## Reporting Issues

When reporting bugs:
- Describe the expected behavior
- Explain what actually happened
- Include steps to reproduce
- Provide browser and system information
- Add screenshots if helpful

## Questions?

- Open an issue for questions
- Join our community discussions
- Check existing documentation

Thank you for contributing to Mantua!