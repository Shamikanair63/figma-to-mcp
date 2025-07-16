# Figma MCP Server

A comprehensive Model Context Protocol (MCP) server for design-to-code workflows, enabling AI assistants to analyze Figma designs and generate production-ready code.

## 🚀 Features

This MCP server provides tools, resources, and prompts specifically designed for converting Figma designs into production-ready code:

### 🔧 Tools
- **`analyze_design`** - Analyze Figma designs and extract components, styles, and structure
- **`generate_code`** - Generate framework-specific code from design specifications
- **`extract_design_tokens`** - Extract design tokens (colors, typography, spacing) from Figma
- **`optimize_code`** - Optimize generated code for performance, accessibility, and maintainability
- **`create_design_token`** - Create and manage design tokens in the system

### 📚 Resources
- **Design Tokens** - Access design system tokens via `design-token://` URIs
- **Code Templates** - Reusable code templates for different frameworks via `template://` URIs
- **Design System Documentation** - Comprehensive design system overview and guidelines

### 💡 Prompts
- **`analyze_design_system`** - Get analysis and recommendations for your design system
- **`generate_component_docs`** - Generate comprehensive component documentation
- **`design_review_checklist`** - Get review checklists for design-to-code implementations

## 🛠️ Supported Frameworks & Languages

### Frameworks
- React
- Vue
- Svelte
- Angular
- HTML/CSS

### Languages
- TypeScript
- JavaScript
- CSS
- SCSS

### Styling Approaches
- CSS Modules
- Styled Components
- Tailwind CSS
- Traditional CSS/SCSS

## 🏗️ Development

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation
```bash
npm install
```

### Build the server
```bash
npm run build
```

### Development with auto-rebuild
```bash
npm run watch
```

### Testing with MCP Inspector
```bash
npm run inspector
```

## 📋 Usage

### Configuration for Claude Desktop

**MacOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "figma-mcp-server": {
      "command": "node",
      "args": ["/path/to/figma-mcp-server/build/index.js"]
    }
  }
}
```

### Configuration for Cursor

Create a `.cursor/mcp.json` file in your project root:

```json
{
  "mcpServers": {
    "figma-mcp-server": {
      "command": "node",
      "args": ["/path/to/figma-mcp-server/build/index.js"]
    }
  }
}
```

### Example Usage

#### Analyzing a Figma Design
```javascript
// Tool: analyze_design
{
  "figma_url": "https://www.figma.com/design/your-design-id",
  "analysis_type": "full"
}
```

#### Generating React Code
```javascript
// Tool: generate_code
{
  "component_spec": "{\"name\":\"Button\",\"properties\":{\"text\":\"Click me\",\"variant\":\"primary\"},\"styles\":{\"backgroundColor\":\"#3B82F6\",\"color\":\"#FFFFFF\"}}",
  "framework": "react",
  "language": "typescript",
  "style_approach": "css"
}
```

#### Extracting Design Tokens
```javascript
// Tool: extract_design_tokens
{
  "figma_url": "https://www.figma.com/design/your-design-id",
  "token_types": ["colors", "typography", "spacing"]
}
```

## 🎨 Design System Integration

The server comes with built-in design tokens and can be extended with your own:

### Default Design Tokens
- **Colors**: Primary (#3B82F6), Secondary (#6B7280)
- **Typography**: Large Heading (32px/1.2), Body Text (16px/1.5)
- **Spacing**: Standard spacing units (4px, 8px, 16px, 24px)

### Adding Custom Design Tokens
Use the `create_design_token` tool to add your own tokens:

```javascript
{
  "name": "Brand Primary",
  "type": "color",
  "value": "#FF6B6B",
  "description": "Primary brand color for CTAs"
}
```

## 📖 API Reference

### Resources

#### Design Tokens
- **URI**: `design-token:///{token-id}`
- **Type**: application/json
- **Description**: Access individual design tokens

#### Code Templates
- **URI**: `template:///{template-id}`
- **Type**: text/plain
- **Description**: Reusable code templates

#### Design System Overview
- **URI**: `design-system:///overview`
- **Type**: text/markdown
- **Description**: Complete design system documentation

### Tools

#### analyze_design
Analyze a Figma design and extract components, styles, and structure.

**Parameters:**
- `figma_url` (required): Figma design URL
- `analysis_type` (optional): "full" | "components" | "styles" | "layout"

#### generate_code
Generate framework-specific code from design specifications.

**Parameters:**
- `component_spec` (required): JSON specification of the component
- `framework` (required): Target framework
- `language` (optional): Programming language
- `style_approach` (optional): Styling approach

#### extract_design_tokens
Extract design tokens from a Figma design.

**Parameters:**
- `figma_url` (required): Figma design URL
- `token_types` (optional): Array of token types to extract

#### optimize_code
Optimize generated code for performance and best practices.

**Parameters:**
- `code` (required): Code to optimize
- `optimization_type` (optional): "performance" | "accessibility" | "maintainability" | "all"

#### create_design_token
Create a new design token in the system.

**Parameters:**
- `name` (required): Token name
- `type` (required): Token type
- `value` (required): Token value
- `description` (optional): Token description

## 🔧 Extending the Server

### Adding New Frameworks
1. Extend the `CodeTemplate` type with your framework
2. Add template definitions to `codeTemplates`
3. Update the code generation logic in `generate_code`

### Adding New Design Token Types
1. Extend the `DesignToken` type
2. Update the validation in `create_design_token`
3. Add handling in the resource generators

### Connecting to Real Figma API
Replace the mock implementations with actual Figma API calls:

```typescript
// Install figma-api package
npm install figma-api

// Use in your tools
import { Api } from 'figma-api';
const api = new Api({ personalAccessToken: process.env.FIGMA_TOKEN });
```

## 🐛 Debugging

Since MCP servers communicate over stdio, debugging can be challenging. Use the MCP Inspector for easier debugging:

```bash
npm run inspector
```

This will provide a web interface for testing your MCP server.

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📞 Support

For questions and support:
- Create an issue in the repository
- Check the [Model Context Protocol documentation](https://modelcontextprotocol.io)
- Join the MCP community discussions
