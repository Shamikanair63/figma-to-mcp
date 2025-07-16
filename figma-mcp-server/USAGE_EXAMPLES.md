# Usage Examples

This document provides comprehensive examples of how to use the Figma MCP Server with various AI assistants and development environments.

## Table of Contents

- [Basic Setup](#basic-setup)
- [Tool Usage Examples](#tool-usage-examples)
- [Resource Access Examples](#resource-access-examples)
- [Prompt Examples](#prompt-examples)
- [Real-World Workflows](#real-world-workflows)

## Basic Setup

### Claude Desktop Configuration

1. Locate your Claude Desktop configuration file:
   - **MacOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

2. Add the server configuration:
```json
{
  "mcpServers": {
    "figma-mcp-server": {
      "command": "node",
      "args": ["/absolute/path/to/figma-mcp-server/build/index.js"]
    }
  }
}
```

3. Restart Claude Desktop

### Cursor Configuration

1. Create a `.cursor/mcp.json` file in your project root:
```json
{
  "mcpServers": {
    "figma-mcp-server": {
      "command": "node",
      "args": ["/absolute/path/to/figma-mcp-server/build/index.js"]
    }
  }
}
```

2. Restart Cursor

## Tool Usage Examples

### 1. analyze_design

**Purpose**: Analyze a Figma design and extract components, styles, and structure.

**Basic Usage**:
```
Please analyze this Figma design and extract all components:
- Figma URL: https://www.figma.com/design/1uCQ2MsGCssu6ZwdkQY6xS/MCP-demo
- Analysis type: full
```

**Advanced Usage**:
```
Can you analyze just the components from this Figma design?
- Figma URL: https://www.figma.com/design/1uCQ2MsGCssu6ZwdkQY6xS/MCP-demo
- Analysis type: components

Focus on extracting:
- Component hierarchy
- Properties and variants
- Styling information
```

### 2. generate_code

**Purpose**: Generate framework-specific code from design specifications.

**React Component Example**:
```
Generate a React TypeScript component from this design specification:

Component Spec:
{
  "name": "PrimaryButton",
  "properties": {
    "text": "Get Started",
    "variant": "primary",
    "size": "large",
    "disabled": false
  },
  "styles": {
    "backgroundColor": "#3B82F6",
    "color": "#FFFFFF",
    "padding": "16px 32px",
    "borderRadius": "8px",
    "fontSize": "16px",
    "fontWeight": "600"
  }
}

Framework: react
Language: typescript
Style approach: css
```

**Vue Component Example**:
```
Generate a Vue component with the following specifications:

Component Spec:
{
  "name": "UserCard",
  "properties": {
    "name": "John Doe",
    "role": "Developer",
    "avatar": "/path/to/avatar.jpg",
    "isOnline": true
  },
  "styles": {
    "backgroundColor": "#FFFFFF",
    "padding": "24px",
    "borderRadius": "12px",
    "boxShadow": "0 4px 6px rgba(0, 0, 0, 0.1)"
  }
}

Framework: vue
Language: javascript
Style approach: scss
```

### 3. extract_design_tokens

**Purpose**: Extract design tokens from a Figma design.

**Basic Extraction**:
```
Extract all design tokens from this Figma design:
- Figma URL: https://www.figma.com/design/1uCQ2MsGCssu6ZwdkQY6xS/MCP-demo
- Token types: ["colors", "typography", "spacing"]
```

**Specific Token Types**:
```
Extract only color tokens from this design:
- Figma URL: https://www.figma.com/design/1uCQ2MsGCssu6ZwdkQY6xS/MCP-demo
- Token types: ["colors"]

Please organize them by:
- Primary colors
- Secondary colors
- Semantic colors (success, warning, error)
- Neutral colors
```

### 4. optimize_code

**Purpose**: Optimize generated code for performance and best practices.

**Performance Optimization**:
```
Optimize this React component for better performance:

```jsx
import React from 'react';

const HeavyComponent = ({ data, onUpdate }) => {
  return (
    <div>
      {data.map(item => (
        <div key={item.id} onClick={() => onUpdate(item)}>
          {item.name}
        </div>
      ))}
    </div>
  );
};

export default HeavyComponent;
```

Optimization type: performance
```

**Accessibility Optimization**:
```
Improve the accessibility of this component:

```jsx
import React from 'react';

const Button = ({ text, onClick }) => {
  return (
    <div onClick={onClick}>
      {text}
    </div>
  );
};

export default Button;
```

Optimization type: accessibility
```

### 5. create_design_token

**Purpose**: Create a new design token in the system.

**Color Token**:
```
Create a new color token for our primary brand color:
- Name: Primary Brand Blue
- Type: color
- Value: #1E40AF
- Description: Primary brand color used for main CTAs and interactive elements
```

**Typography Token**:
```
Create a typography token for our heading style:
- Name: Heading Medium
- Type: typography
- Value: font-size: 24px; font-weight: 600; line-height: 1.3; font-family: 'Inter', sans-serif;
- Description: Medium heading style for section titles
```

## Resource Access Examples

### Design Tokens

**View All Design Tokens**:
```
Show me all available design tokens in the system.
```

**Access Specific Token**:
```
Get details for the primary-color design token.
```

### Code Templates

**View Available Templates**:
```
What code templates are available?
```

**Access React Template**:
```
Show me the React component template.
```

### Design System Documentation

**View Design System Overview**:
```
Show me the complete design system documentation.
```

## Prompt Examples

### 1. analyze_design_system

**Basic Analysis**:
```
Analyze the current design system and provide recommendations for improvement.
```

**Focused Analysis**:
```
Analyze the current design system with focus on: typography

Provide specific recommendations for:
- Type scale consistency
- Font weight usage
- Line height standards
- Responsive typography
```

### 2. generate_component_docs

**Component Documentation**:
```
Generate comprehensive documentation for the Button component.

Include:
- Usage examples
- Props documentation
- Accessibility guidelines
- Design token usage
```

### 3. design_review_checklist

**General Checklist**:
```
Create a design review checklist for general components.
```

**Specific Component Type**:
```
Create a design review checklist for form components.

Focus on:
- Form validation patterns
- Input states and feedback
- Accessibility requirements
- Mobile responsiveness
```

## Real-World Workflows

### Workflow 1: Design to React Component

1. **Start with design analysis**:
```
Analyze this Figma design for a card component:
- Figma URL: https://www.figma.com/design/example
- Analysis type: components
```

2. **Extract design tokens**:
```
Extract design tokens from the same design:
- Focus on colors, typography, and spacing
```

3. **Generate React component**:
```
Generate a React component using the extracted information:
- Framework: react
- Language: typescript
- Style approach: css-modules
```

4. **Optimize the generated code**:
```
Optimize the generated component for:
- Performance
- Accessibility
- Maintainability
```

5. **Create documentation**:
```
Generate comprehensive documentation for the Card component.
```

### Workflow 2: Design System Audit

1. **Analyze current design system**:
```
Analyze the current design system with focus on: overall
```

2. **Create missing design tokens**:
```
Create design tokens for any missing values identified in the analysis.
```

3. **Generate review checklist**:
```
Create a design review checklist for the updated design system.
```

### Workflow 3: Multi-Framework Code Generation

1. **Extract design specifications**:
```
Extract components and tokens from the Figma design.
```

2. **Generate React version**:
```
Generate React TypeScript component with CSS modules.
```

3. **Generate Vue version**:
```
Generate Vue component with SCSS styling.
```

4. **Generate HTML/CSS version**:
```
Generate vanilla HTML/CSS implementation.
```

## Tips for Better Results

1. **Be specific with URLs**: Always provide the exact Figma URL for best results.

2. **Use structured component specifications**: When generating code, provide detailed JSON specifications.

3. **Leverage design tokens**: Reference existing design tokens in your requests for consistency.

4. **Iterate and refine**: Use the optimize_code tool to improve generated code.

5. **Document everything**: Use the documentation prompts to create comprehensive guides.

6. **Test thoroughly**: Use the review checklists to ensure quality implementations.

## Troubleshooting

### Common Issues

**Server not responding**:
- Check that the server is properly built (`npm run build`)
- Verify the configuration file path is correct
- Restart your AI assistant

**Invalid Figma URLs**:
- Ensure the URL is accessible and public
- Check that the design contains the expected components

**Code generation errors**:
- Verify the component specification is valid JSON
- Check that the framework and language combination is supported

### Getting Help

- Check the main README.md for detailed documentation
- Use the MCP Inspector for debugging: `npm run inspector`
- Review the server logs for error messages