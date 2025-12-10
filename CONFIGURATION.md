# MCP Configuration Guide for Blender MCP Server

This guide explains how to configure the Blender MCP Server with your AI assistant.

## Configuration for Claude Desktop

To use this MCP server with Claude Desktop, add the following configuration:

### macOS/Linux

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "blender": {
      "command": "node",
      "args": ["/path/to/blender_MCP/src/index.js"]
    }
  }
}
```

### Windows

Edit `%APPDATA%\Claude\claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "blender": {
      "command": "node",
      "args": ["C:\\path\\to\\blender_MCP\\src\\index.js"]
    }
  }
}
```

## Configuration for Other AI Assistants

The server uses the standard Model Context Protocol (MCP), so it can be integrated with any AI assistant that supports MCP.

### Generic Configuration

```json
{
  "name": "blender-mcp-server",
  "command": "node",
  "args": ["<path-to-repo>/src/index.js"],
  "transport": "stdio"
}
```

## Environment Variables

Currently, the server doesn't require environment variables. Future versions may support:

- `BLENDER_PATH`: Path to Blender executable for direct integration
- `BLENDER_PYTHON`: Path to Blender's Python for script validation
- `MCP_LOG_LEVEL`: Logging level (debug, info, warn, error)

## Verifying Installation

After configuration, restart your AI assistant and verify the server is working:

1. Ask: "List available MCP tools"
2. You should see tools like:
   - generate_geometric_shape
   - generate_building
   - generate_human_part
   - apply_texture
   - generate_from_prompt
   - execute_blender_script

## Testing the Connection

Try these test prompts:

1. **Simple Test**: "Create a red cube"
2. **Building Test**: "Generate a house"
3. **Human Test**: "Create a person with head and arms"
4. **Prompt Test**: "Generate from prompt: a person with two legs"

Each should return Blender Python scripts ready to execute.

## Troubleshooting

### Server Not Starting

**Problem**: AI assistant can't connect to the server

**Solutions**:
1. Verify Node.js is installed: `node --version`
2. Check the path in config is correct
3. Ensure dependencies are installed: `npm install`
4. Check logs in AI assistant

### No Tools Available

**Problem**: MCP server connects but no tools appear

**Solutions**:
1. Restart your AI assistant
2. Check server logs for errors
3. Verify the config file syntax is correct (valid JSON)

### Scripts Don't Generate

**Problem**: Tools are available but don't return scripts

**Solutions**:
1. Check Node.js console for errors
2. Verify the request format matches the schema
3. Try a simpler prompt first

## Advanced Configuration

### Custom Port (Future)

For network-based MCP (not stdio):

```json
{
  "blender": {
    "type": "http",
    "url": "http://localhost:3000/mcp"
  }
}
```

### Multiple Instances

Run multiple servers for different purposes:

```json
{
  "mcpServers": {
    "blender-dev": {
      "command": "node",
      "args": ["/path/to/blender_MCP/src/index.js"]
    },
    "blender-prod": {
      "command": "node",
      "args": ["/path/to/blender_MCP_production/src/index.js"]
    }
  }
}
```

## Integration with Blender

### Method 1: Manual Script Execution

1. Get script from AI response
2. Open Blender → Scripting workspace
3. Paste and run script

### Method 2: Clipboard Integration (Future)

The server could automatically copy scripts to clipboard:

```javascript
// Future feature
{
  "auto_clipboard": true
}
```

### Method 3: Direct Blender Connection (Future)

Direct integration with Blender via RPC:

```javascript
// Future feature
{
  "blender_connection": {
    "host": "localhost",
    "port": 8888,
    "auto_execute": true
  }
}
```

## Security Considerations

### Script Execution

- Scripts are **not automatically executed** in Blender
- User must manually run generated scripts
- Review scripts before execution for safety

### Network Security

- Current version uses stdio (no network exposure)
- Future network versions should use authentication
- Consider firewall rules for networked deployments

## Performance Tuning

### Script Generation

- Default detail level: medium
- Adjust for performance: use "low" for faster generation
- Use "high" only when necessary

### Caching (Future)

Future versions may cache common patterns:

```javascript
{
  "cache": {
    "enabled": true,
    "ttl": 3600
  }
}
```

## Logging

Enable detailed logging by setting environment variable:

```bash
# macOS/Linux
export MCP_DEBUG=1
node src/index.js

# Windows
set MCP_DEBUG=1
node src\index.js
```

## Updates

To update the server:

```bash
cd blender_MCP
git pull
npm install
```

Then restart your AI assistant.

## Support

For configuration issues:
1. Check this guide
2. Review example configurations
3. Test with simple prompts first
4. Check GitHub issues

## Example Complete Configuration

Here's a complete working configuration for Claude Desktop:

```json
{
  "mcpServers": {
    "blender": {
      "command": "node",
      "args": [
        "/Users/yourname/projects/blender_MCP/src/index.js"
      ],
      "env": {
        "NODE_ENV": "production"
      }
    }
  },
  "globalShortcut": "CommandOrControl+Shift+B"
}
```

This configuration:
- Sets up the Blender MCP server
- Uses absolute path to the script
- Sets production environment
- (Optional) Adds a global shortcut

## Next Steps

After configuration:
1. Restart your AI assistant
2. Verify tools are available
3. Try example prompts from `examples/PROMPTS.md`
4. Review generated scripts in Blender
5. Start creating your own 3D content!
