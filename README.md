# Blender MCP Server - AI-Powered 3D Generation

An MCP (Model Context Protocol) server that connects your AI to Blender for intelligent 3D object generation. Generate geometric shapes, complex architectural structures, human body parts, fantasy creatures, monsters, and apply textures using natural language prompts.

## Features

- 🎨 **Geometric Shapes**: Create cubes, spheres, cylinders, cones, torus, and planes
- 🏗️ **Architectural Structures**: Generate houses, buildings, churches, towers with customizable floors and styles
- 👤 **Human Body Parts**: Create heads, hands, feet, arms, legs, torso, or complete human bodies
- 🐉 **Creatures & Monsters**: Generate dragons, spiders, octopuses, aliens, monsters, serpents, birds, and fish
- 🎭 **Textures & Materials**: Apply realistic materials like wood, metal, stone, brick, glass, plastic, fabric, and skin
- 💬 **Natural Language Processing**: Describe what you want in plain text, and the AI generates the appropriate Blender script
- 🔧 **Custom Scripts**: Execute custom Python scripts directly in Blender

## Installation

```bash
# Clone the repository
git clone https://github.com/PadreGarcia/blender_MCP.git
cd blender_MCP

# Install dependencies
npm install
```

## Usage

### Starting the Server

```bash
npm start
```

The server runs on stdio and communicates with your AI using the Model Context Protocol.

### Available Tools

#### 1. Generate Geometric Shape

Create basic geometric primitives:

```javascript
{
  "shape_type": "cube|sphere|cylinder|cone|torus|plane",
  "size": 1.0,
  "location": [0, 0, 0],
  "color": "red|green|blue|yellow|gray|white|black"
}
```

**Example:**
```
Create a red sphere of size 2 at location [0, 0, 5]
```

#### 2. Generate Building

Create architectural structures:

```javascript
{
  "building_type": "house|building|church|tower|castle",
  "floors": 2,
  "style": "modern|classic|medieval",
  "location": [0, 0, 0]
}
```

**Example:**
```
Create a modern 5-story building at the origin
```

#### 3. Generate Human Part

Create human body parts with varying detail levels:

```javascript
{
  "body_part": "head|hand|foot|leg|arm|torso|full_body",
  "detail_level": "low|medium|high",
  "location": [0, 0, 0]
}
```

**Example:**
```
Generate a human hand with high detail
```

#### 4. Generate Creature

Create fantasy creatures, monsters, and animals:

```javascript
{
  "creature_type": "dragon|spider|octopus|alien|monster|serpent|bird|fish",
  "size": 2.0,
  "detail_level": "low|medium|high",
  "location": [0, 0, 0]
}
```

**Examples:**
```
- "Create a dragon with wings and tail"
- "Generate a spider with 8 legs"
- "Make an octopus with tentacles"
- "Build an alien with large eyes"
- "Create a monster with horns and claws"
- "Genera un dragón" (Spanish)
- "Crea un monstruo con cuernos" (Spanish)
```

**Supported Creatures:**
- **Dragon** (dragón): Body, head, neck, tail, wings, legs
- **Spider** (araña): Body, head, 8 legs, 8 eyes
- **Octopus** (pulpo): Head/mantle, eyes, 8 tentacles with suction cups
- **Alien** (extraterrestre): Large head, big eyes, thin body, long arms, 3-fingered hands
- **Monster** (monstruo): Bulky body, horns, glowing eyes, teeth, claws, muscular arms
- **Serpent** (serpiente): Head, fangs, coiled body segments
- **Bird** (ave): Body, head, beak, wings, tail, legs
- **Fish** (pez): Body, head, fins, tail, mouth

#### 5. Apply Texture

Apply realistic materials to objects:

```javascript
{
  "object_name": "Cube",
  "texture_type": "wood|metal|stone|brick|glass|plastic|fabric|skin",
  "color": "default"
}
```

**Example:**
```
Apply wood texture to the house walls
```

#### 6. Generate from Prompt

The most powerful feature - describe what you want in natural language:

```javascript
{
  "prompt": "a person with a head, two arms, two legs, and two feet",
  "detail_level": "medium"
}
```

**Examples:**
```
- "Create a person with a head, two arms, two legs"
- "Generate a house with a red roof"
- "Make a church with a tall tower"
- "Create a complete human body"
- "Build a 10-story modern building"
- "Generate a dragon with large wings"
- "Create a monster with tentacles"
- "Un monstruo con cuernos y garras" (Spanish)
```

#### 7. Execute Blender Script

Run custom Python code in Blender:

```javascript
{
  "script": "import bpy\nbpy.ops.mesh.primitive_cube_add()"
}
```

## How It Works

### Architecture

```
┌─────────────┐         ┌─────────────┐         ┌──────────────┐
│     AI      │ ◄─MCP──►│ MCP Server  │ ◄──────►│   Blender    │
│  Assistant  │         │  (Node.js)  │         │  (Python)    │
└─────────────┘         └─────────────┘         └──────────────┘
```

1. **AI Assistant** sends requests through MCP protocol
2. **MCP Server** processes requests and generates Blender Python scripts
3. **Scripts** can be executed in Blender to create 3D objects

### Natural Language Processing

The server includes intelligent prompt analysis that:
- Detects body parts (head, arms, legs, hands, feet)
- Identifies buildings and architectural elements
- Recognizes geometric shapes
- Counts quantities (two arms, five floors, etc.)
- Supports both English and Spanish keywords

### Example Flow

When you say: *"Quiero una persona con una cabeza, dos brazos, dos piernas y dos pies"*

The server:
1. Analyzes the prompt
2. Detects: person + head + 2 arms + 2 legs + 2 feet
3. Generates a complete human body script
4. Returns Blender Python code ready to execute

## Blender Integration

To use the generated scripts in Blender:

### Method 1: Copy-Paste
1. Get the script from the AI response
2. Open Blender
3. Go to Scripting workspace
4. Paste and run the script

### Method 2: Text Editor
1. Save the script to a `.py` file
2. In Blender: Text → Open Text Block
3. Select your script and click Run Script

### Method 3: Command Line
```bash
blender --python your_script.py
```

## Example Prompts

### Basic Shapes
- "Create a blue sphere of size 3"
- "Generate a red cube at position [5, 5, 0]"
- "Make a yellow cylinder"

### Buildings
- "Generate a house with windows and a door"
- "Create a church with a tower and cross"
- "Build a 7-story modern building"

### Human Parts
- "Create a human head with eyes, nose, and mouth"
- "Generate two hands with fingers"
- "Make a complete human body with all parts"

### Complex Prompts
- "Create a person with a head, two arms, two legs, and hands" → Generates full body
- "Build a church with a spire and entrance" → Generates detailed church
- "Make a 5-story building with windows on each floor" → Multi-story building

## Configuration

The server can be configured in `package.json`:

```json
{
  "name": "blender-mcp-server",
  "version": "1.0.0",
  "main": "src/index.js"
}
```

## Technical Details

### Dependencies
- `@modelcontextprotocol/sdk`: MCP protocol implementation
- Node.js 18+ required

### Generated Scripts
All scripts use Blender's Python API (bpy):
- Mesh primitives for basic shapes
- Modifiers for detail levels (Subdivision Surface)
- Materials and shaders for textures
- Proper naming conventions for all objects

## Development

### Project Structure
```
blender_MCP/
├── src/
│   └── index.js          # Main MCP server
├── package.json          # Node.js configuration
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

### Adding New Features

To add new object types, extend the server:

1. Add new tool definition in `ListToolsRequestSchema`
2. Create handler function
3. Implement script generation logic
4. Update prompt analyzer for natural language support

## Troubleshooting

### Server won't start
- Check Node.js version (18+ required)
- Run `npm install` to ensure dependencies are installed

### Scripts don't work in Blender
- Verify Blender version (2.8+ recommended)
- Check console for Python errors
- Ensure script is run in Object Mode

### Natural language not working
- Try more specific descriptions
- Use supported keywords (person, building, house, etc.)
- Specify quantities explicitly (two arms, five floors)

## Contributing

Contributions are welcome! Areas for improvement:
- More architectural styles
- Additional body part details
- Advanced texture patterns
- Animation support
- Scene composition tools

## License

MIT License - Feel free to use and modify as needed.

## Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review example prompts

## Roadmap

- [ ] Animation generation
- [ ] Scene composition tools
- [ ] Material libraries
- [ ] Lighting setup automation
- [ ] Camera positioning
- [ ] Export format support
- [ ] Real-time preview integration