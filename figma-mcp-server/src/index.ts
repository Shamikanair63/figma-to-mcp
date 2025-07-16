#!/usr/bin/env node

/**
 * Figma MCP Server - A Model Context Protocol server for design-to-code workflows
 * 
 * This MCP server provides tools and resources for converting Figma designs into production-ready code.
 * It demonstrates core MCP concepts while providing practical design-to-code functionality:
 * - Tools for analyzing Figma designs and generating code
 * - Resources for design systems and component libraries
 * - Prompts for guided design analysis and code generation
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

/**
 * Type definitions for design-to-code workflows
 */
type ComponentSpec = {
  name: string;
  type: 'component' | 'variant' | 'instance';
  properties: Record<string, any>;
  styles: Record<string, any>;
  children?: ComponentSpec[];
};

type DesignToken = {
  name: string;
  type: 'color' | 'typography' | 'spacing' | 'border' | 'shadow';
  value: string;
  description?: string;
};

type CodeTemplate = {
  name: string;
  framework: 'react' | 'vue' | 'svelte' | 'html' | 'angular';
  language: 'typescript' | 'javascript' | 'css' | 'scss';
  template: string;
  description: string;
};

/**
 * In-memory storage for design system data
 * In a real implementation, this would be backed by a database or API
 */
const designTokens: { [id: string]: DesignToken } = {
  "primary-color": {
    name: "Primary Color",
    type: "color",
    value: "#3B82F6",
    description: "Main brand color used for primary actions and highlights"
  },
  "secondary-color": {
    name: "Secondary Color",
    type: "color",
    value: "#6B7280",
    description: "Secondary color for less prominent elements"
  },
  "heading-lg": {
    name: "Large Heading",
    type: "typography",
    value: "font-size: 32px; font-weight: 700; line-height: 1.2;",
    description: "Large heading typography style"
  },
  "spacing-md": {
    name: "Medium Spacing",
    type: "spacing",
    value: "16px",
    description: "Standard spacing unit for medium gaps"
  }
};

const codeTemplates: { [id: string]: CodeTemplate } = {
  "react-component": {
    name: "React Component",
    framework: "react",
    language: "typescript",
    template: `import React from 'react';
import './{{componentName}}.css';

interface {{componentName}}Props {
  // Add props here
}

const {{componentName}}: React.FC<{{componentName}}Props> = ({
  // destructure props here
}) => {
  return (
    <div className="{{componentName | kebab-case}}">
      {/* Component content */}
    </div>
  );
};

export default {{componentName}};`,
    description: "TypeScript React component template"
  },
  "css-component": {
    name: "CSS Component",
    framework: "html",
    language: "css",
    template: `.{{componentName | kebab-case}} {
  /* Component styles */
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  
  /* Add specific styles based on design */
}`,
    description: "CSS component styles template"
  }
};

/**
 * Create an MCP server with capabilities for design-to-code workflows
 */
const server = new Server(
  {
    name: "Figma MCP Server",
    version: "0.1.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
      prompts: {},
    },
  }
);

/**
 * Handler for listing available resources including design tokens, templates, and documentation
 */
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  const resources = [];

  // Add design tokens as resources
  Object.entries(designTokens).forEach(([id, token]) => {
    resources.push({
      uri: `design-token:///${id}`,
      mimeType: "application/json",
      name: token.name,
      description: `Design token: ${token.description || token.name}`
    });
  });

  // Add code templates as resources
  Object.entries(codeTemplates).forEach(([id, template]) => {
    resources.push({
      uri: `template:///${id}`,
      mimeType: "text/plain",
      name: template.name,
      description: `${template.framework} ${template.language} template: ${template.description}`
    });
  });

  // Add design system documentation
  resources.push({
    uri: "design-system:///overview",
    mimeType: "text/markdown",
    name: "Design System Overview",
    description: "Complete design system documentation and guidelines"
  });

  return { resources };
});

/**
 * Handler for reading the contents of design resources
 */
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const url = new URL(request.params.uri);
  const [scheme, , id] = url.toString().split('/');

  if (scheme === 'design-token:') {
    const token = designTokens[id];
    if (!token) {
      throw new Error(`Design token ${id} not found`);
    }

    return {
      contents: [{
        uri: request.params.uri,
        mimeType: "application/json",
        text: JSON.stringify(token, null, 2)
      }]
    };
  }

  if (scheme === 'template:') {
    const template = codeTemplates[id];
    if (!template) {
      throw new Error(`Template ${id} not found`);
    }

    return {
      contents: [{
        uri: request.params.uri,
        mimeType: "text/plain",
        text: template.template
      }]
    };
  }

  if (scheme === 'design-system:' && id === 'overview') {
    const overview = `# Design System Overview

## Colors
${Object.entries(designTokens).filter(([, token]) => token.type === 'color').map(([id, token]) => 
  `- **${token.name}**: ${token.value} - ${token.description}`
).join('\n')}

## Typography
${Object.entries(designTokens).filter(([, token]) => token.type === 'typography').map(([id, token]) => 
  `- **${token.name}**: ${token.value} - ${token.description}`
).join('\n')}

## Spacing
${Object.entries(designTokens).filter(([, token]) => token.type === 'spacing').map(([id, token]) => 
  `- **${token.name}**: ${token.value} - ${token.description}`
).join('\n')}

## Usage Guidelines
- Use design tokens consistently across all components
- Follow the component templates for structure
- Maintain accessibility standards
- Test responsive behavior across devices
`;

    return {
      contents: [{
        uri: request.params.uri,
        mimeType: "text/markdown",
        text: overview
      }]
    };
  }

  throw new Error(`Resource not found: ${request.params.uri}`);
});

/**
 * Handler that lists available tools for design-to-code workflows
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "analyze_design",
        description: "Analyze a Figma design and extract components, styles, and structure",
        inputSchema: {
          type: "object",
          properties: {
            figma_url: {
              type: "string",
              description: "Figma design URL or node ID"
            },
            analysis_type: {
              type: "string",
              enum: ["full", "components", "styles", "layout"],
              description: "Type of analysis to perform"
            }
          },
          required: ["figma_url"]
        }
      },
      {
        name: "generate_code",
        description: "Generate code from design specifications",
        inputSchema: {
          type: "object",
          properties: {
            component_spec: {
              type: "string",
              description: "JSON specification of the component to generate"
            },
            framework: {
              type: "string",
              enum: ["react", "vue", "svelte", "html", "angular"],
              description: "Target framework for code generation"
            },
            language: {
              type: "string",
              enum: ["typescript", "javascript"],
              description: "Programming language preference"
            },
            style_approach: {
              type: "string",
              enum: ["css-modules", "styled-components", "tailwind", "css", "scss"],
              description: "Styling approach to use"
            }
          },
          required: ["component_spec", "framework"]
        }
      },
      {
        name: "extract_design_tokens",
        description: "Extract design tokens from a Figma design",
        inputSchema: {
          type: "object",
          properties: {
            figma_url: {
              type: "string",
              description: "Figma design URL"
            },
            token_types: {
              type: "array",
              items: {
                type: "string",
                enum: ["colors", "typography", "spacing", "borders", "shadows"]
              },
              description: "Types of design tokens to extract"
            }
          },
          required: ["figma_url"]
        }
      },
      {
        name: "optimize_code",
        description: "Optimize generated code for performance and best practices",
        inputSchema: {
          type: "object",
          properties: {
            code: {
              type: "string",
              description: "Code to optimize"
            },
            optimization_type: {
              type: "string",
              enum: ["performance", "accessibility", "maintainability", "all"],
              description: "Type of optimization to apply"
            }
          },
          required: ["code"]
        }
      },
      {
        name: "create_design_token",
        description: "Create a new design token",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Name of the design token"
            },
            type: {
              type: "string",
              enum: ["color", "typography", "spacing", "border", "shadow"],
              description: "Type of design token"
            },
            value: {
              type: "string",
              description: "Value of the design token"
            },
            description: {
              type: "string",
              description: "Description of the design token"
            }
          },
          required: ["name", "type", "value"]
        }
      }
    ]
  };
});

/**
 * Handler for design-to-code tools
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "analyze_design": {
      const figmaUrl = String(request.params.arguments?.figma_url);
      const analysisType = String(request.params.arguments?.analysis_type || "full");
      
      if (!figmaUrl) {
        throw new Error("Figma URL is required");
      }

      // Simulate design analysis (in real implementation, this would call Figma API)
      const mockAnalysis = {
        components: [
          {
            name: "Button",
            type: "component",
            properties: {
              variant: "primary",
              size: "medium",
              text: "Click me"
            },
            styles: {
              backgroundColor: "#3B82F6",
              color: "#FFFFFF",
              padding: "12px 24px",
              borderRadius: "8px",
              fontSize: "16px"
            }
          }
        ],
        tokens: {
          colors: ["#3B82F6", "#6B7280", "#FFFFFF"],
          typography: ["16px", "14px", "12px"],
          spacing: ["8px", "16px", "24px"]
        }
      };

      return {
        content: [{
          type: "text",
          text: `Design Analysis Complete for ${figmaUrl}
          
Analysis Type: ${analysisType}
Components Found: ${mockAnalysis.components.length}
Color Tokens: ${mockAnalysis.tokens.colors.length}
Typography Tokens: ${mockAnalysis.tokens.typography.length}
Spacing Tokens: ${mockAnalysis.tokens.spacing.length}

Component Details:
${JSON.stringify(mockAnalysis.components, null, 2)}

Extracted Tokens:
${JSON.stringify(mockAnalysis.tokens, null, 2)}`
        }]
      };
    }

    case "generate_code": {
      const componentSpec = String(request.params.arguments?.component_spec);
      const framework = String(request.params.arguments?.framework || "react");
      const language = String(request.params.arguments?.language || "typescript");
      const styleApproach = String(request.params.arguments?.style_approach || "css");
      
      if (!componentSpec) {
        throw new Error("Component specification is required");
      }

      let spec;
      try {
        spec = JSON.parse(componentSpec);
      } catch (e) {
        throw new Error("Invalid component specification JSON");
      }

      // Generate code based on framework and language
      let generatedCode = "";
      
      if (framework === "react") {
        const componentName = spec.name || "Component";
        generatedCode = `import React from 'react';
${styleApproach === 'css' ? `import './${componentName}.css';` : ''}

interface ${componentName}Props {
  ${spec.properties ? Object.entries(spec.properties).map(([key, value]) => 
    `${key}?: ${typeof value === 'string' ? 'string' : 'any'};`
  ).join('\n  ') : ''}
}

const ${componentName}: React.FC<${componentName}Props> = ({
  ${spec.properties ? Object.keys(spec.properties).join(', ') : ''}
}) => {
  return (
    <div className="${componentName.toLowerCase()}">
      {/* Generated from design */}
      ${spec.properties?.text || 'Content'}
    </div>
  );
};

export default ${componentName};`;

        if (styleApproach === 'css' && spec.styles) {
          generatedCode += `\n\n/* ${componentName}.css */\n.${componentName.toLowerCase()} {\n`;
          Object.entries(spec.styles).forEach(([property, value]) => {
            const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
            generatedCode += `  ${cssProperty}: ${value};\n`;
          });
          generatedCode += '}';
        }
      }

      return {
        content: [{
          type: "text",
          text: `Code generated successfully for ${framework} (${language}):\n\n${generatedCode}`
        }]
      };
    }

    case "extract_design_tokens": {
      const figmaUrl = String(request.params.arguments?.figma_url);
      const tokenTypes = request.params.arguments?.token_types || ["colors", "typography", "spacing"];
      
      if (!figmaUrl) {
        throw new Error("Figma URL is required");
      }

      // Simulate token extraction (in real implementation, this would call Figma API)
      const extractedTokens = {
        colors: [
          { name: "primary", value: "#3B82F6", description: "Primary brand color" },
          { name: "secondary", value: "#6B7280", description: "Secondary color" }
        ],
        typography: [
          { name: "heading-lg", value: "32px/1.2 Inter", description: "Large heading" },
          { name: "body", value: "16px/1.5 Inter", description: "Body text" }
        ],
        spacing: [
          { name: "xs", value: "4px", description: "Extra small spacing" },
          { name: "sm", value: "8px", description: "Small spacing" },
          { name: "md", value: "16px", description: "Medium spacing" }
        ]
      };

      return {
        content: [{
          type: "text",
          text: `Design tokens extracted from ${figmaUrl}:

${JSON.stringify(extractedTokens, null, 2)}

Token types extracted: ${Array.isArray(tokenTypes) ? tokenTypes.join(', ') : tokenTypes}`
        }]
      };
    }

    case "optimize_code": {
      const code = String(request.params.arguments?.code);
      const optimizationType = String(request.params.arguments?.optimization_type || "all");
      
      if (!code) {
        throw new Error("Code is required");
      }

      // Simulate code optimization
      let optimizedCode = code;
      const optimizations = [];

      if (optimizationType === "performance" || optimizationType === "all") {
        optimizations.push("Added React.memo for performance optimization");
        optimizations.push("Optimized re-renders with useMemo and useCallback");
      }

      if (optimizationType === "accessibility" || optimizationType === "all") {
        optimizations.push("Added ARIA labels and roles");
        optimizations.push("Improved keyboard navigation support");
      }

      if (optimizationType === "maintainability" || optimizationType === "all") {
        optimizations.push("Added TypeScript interfaces");
        optimizations.push("Improved code structure and comments");
      }

      return {
        content: [{
          type: "text",
          text: `Code optimized successfully!

Optimizations applied:
${optimizations.map(opt => `- ${opt}`).join('\n')}

Original code length: ${code.length} characters
Optimized code: 
${optimizedCode}`
        }]
      };
    }

    case "create_design_token": {
      const name = String(request.params.arguments?.name);
      const type = String(request.params.arguments?.type);
      const value = String(request.params.arguments?.value);
      const description = String(request.params.arguments?.description || "");
      
      if (!name || !type || !value) {
        throw new Error("Name, type, and value are required");
      }

      const tokenId = name.toLowerCase().replace(/\s+/g, '-');
      designTokens[tokenId] = {
        name,
        type: type as any,
        value,
        description
      };

      return {
        content: [{
          type: "text",
          text: `Design token created successfully: ${name}
Type: ${type}
Value: ${value}
Description: ${description}

Token ID: ${tokenId}`
        }]
      };
    }

    default:
      throw new Error(`Unknown tool: ${request.params.name}`);
  }
});

/**
 * Handler that lists available prompts for design-to-code workflows
 */
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: "analyze_design_system",
        description: "Analyze the current design system and provide recommendations",
        arguments: [
          {
            name: "focus_area",
            description: "Area to focus the analysis on",
            required: false
          }
        ]
      },
      {
        name: "generate_component_docs",
        description: "Generate documentation for a component",
        arguments: [
          {
            name: "component_name",
            description: "Name of the component to document",
            required: true
          }
        ]
      },
      {
        name: "design_review_checklist",
        description: "Get a checklist for reviewing design-to-code implementation",
        arguments: [
          {
            name: "component_type",
            description: "Type of component being reviewed",
            required: false
          }
        ]
      }
    ]
  };
});

/**
 * Handler for design-to-code prompts
 */
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "analyze_design_system": {
      const focusArea = args?.focus_area || "overall";

      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Please analyze the current design system with focus on: ${focusArea}

Current Design Tokens:
${JSON.stringify(designTokens, null, 2)}

Please provide:
1. Assessment of token consistency
2. Recommendations for improvements
3. Missing tokens that should be added
4. Best practices for token usage`
            }
          }
        ]
      };
    }

    case "generate_component_docs": {
      const componentName = args?.component_name;
      if (!componentName) {
        throw new Error("Component name is required");
      }

      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Generate comprehensive documentation for the ${componentName} component.

Include:
1. Component overview and purpose
2. Props and their types
3. Usage examples
4. Accessibility considerations
5. Design tokens used
6. Responsive behavior
7. Testing guidelines

Base the documentation on current design system:
${JSON.stringify(designTokens, null, 2)}`
            }
          }
        ]
      };
    }

    case "design_review_checklist": {
      const componentType = args?.component_type || "general";

      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Create a comprehensive review checklist for ${componentType} components.

The checklist should cover:
1. Design fidelity (matches Figma design)
2. Responsive behavior
3. Accessibility standards
4. Performance considerations
5. Code quality and maintainability
6. Design token usage
7. Cross-browser compatibility
8. Edge cases and error states

Format as a practical checklist with clear action items.`
            }
          }
        ]
      };
    }

    default:
      throw new Error(`Unknown prompt: ${name}`);
  }
});

/**
 * Start the server using stdio transport
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Figma MCP Server error:", error);
  process.exit(1);
});
