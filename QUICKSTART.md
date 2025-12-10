# Quick Start Guide - Blender MCP Server

Get started with AI-powered 3D generation in Blender in under 5 minutes!

## Prerequisites

- Node.js 18 or higher
- Blender 2.8+ (for running generated scripts)
- An AI assistant that supports MCP (e.g., Claude Desktop)

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/PadreGarcia/blender_MCP.git
cd blender_MCP

# 2. Install dependencies
npm install

# 3. Test the installation
npm test
```

You should see:
```
============================================================
ALL TESTS PASSED! ✓
============================================================
```

## Configuration

### For Claude Desktop

**macOS/Linux:**
Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "blender": {
      "command": "node",
      "args": ["/absolute/path/to/blender_MCP/src/index.js"]
    }
  }
}
```

**Windows:**
Edit `%APPDATA%\Claude\claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "blender": {
      "command": "node",
      "args": ["C:\\absolute\\path\\to\\blender_MCP\\src\\index.js"]
    }
  }
}
```

**Important:** Replace the path with your actual installation path!

After editing, restart Claude Desktop.

## Basic Usage

### Step 1: Ask AI to Generate a Script

Try these example prompts in your AI assistant:

**Simple Shapes:**
```
Create a red cube of size 2
Generate a blue sphere
Make a yellow cylinder
```

**Buildings:**
```
Create a house with windows and a door
Generate a church with a tower
Build a 10-story modern building
```

**Human Parts:**
```
Create a human head with eyes, nose, and mouth
Generate a hand with five fingers
Make a complete human body
```

**Natural Language (The Magic!):**
```
Create a person with a head, two arms, two legs, and two hands
Generate a church with a tall tower and a cross on top
Build a house with a pyramidal roof and four windows
```

**Spanish Support:**
```
Crea una persona con una cabeza, dos brazos y dos piernas
Genera una casa con ventanas
Haz una iglesia con torre
```

### Step 2: Get the Blender Script

The AI will respond with a Python script like:

```python
import bpy

# Create cube
bpy.ops.mesh.primitive_cube_add(size=2, location=(0, 0, 0))
obj = bpy.context.active_object
obj.name = "Cube_Generated"

# Apply material
mat = bpy.data.materials.new(name="cube_Material")
mat.use_nodes = True
bsdf = mat.node_tree.nodes["Principled BSDF"]
bsdf.inputs["Base Color"].default_value = (1, 0, 0, 1)  # Red

obj.data.materials.append(mat)
```

### Step 3: Run in Blender

**Method A: Script Editor**
1. Open Blender
2. Switch to "Scripting" workspace (top menu)
3. Click "New" (or Text → New)
4. Paste the script
5. Click "Run Script" button (or press Alt+P)

**Method B: Copy from Test Output**
1. After running `npm test`, scripts are saved to `test_output/`
2. In Blender: Text → Open Text Block
3. Navigate to `test_output/test_cube.py` (or any other)
4. Click "Open Text Block"
5. Click "Run Script"

**Method C: Command Line**
```bash
blender --python test_output/test_cube.py
```

## Example Workflows

### Workflow 1: Create a Person

**Prompt:**
```
I want to create a person with a head, two arms with hands, two legs with feet, all properly positioned
```

**AI Response:**
The AI will analyze your request and generate a complete human body model with:
- Head (with eyes, nose, mouth)
- Neck
- Torso
- 2 Arms (upper arm, forearm, hand)
- Pelvis
- 2 Legs (thigh, calf, foot)

**In Blender:**
1. Copy the generated script
2. Run in Blender
3. You'll see a complete human figure!

### Workflow 2: Create a Scene

**Step 1:** Create a house
```
Create a house with a foundation, walls, pyramidal roof, a door, and four windows
```

**Step 2:** Add a person
```
Create a person standing at position [5, 0, 0]
```

**Step 3:** Apply textures
```
Apply wood texture to House_Walls
Apply skin texture to Head
```

### Workflow 3: Experiment with Prompts

Try combining elements:
```
Create a scene with:
- A church with a tall tower
- A person standing at position [10, 0, 0]
- A house at position [-10, 0, 0]
Apply stone texture to the church
Apply wood texture to the house
```

## Available Tools

The MCP server provides these tools:

### 1. `generate_geometric_shape`
Create basic 3D primitives
- Shapes: cube, sphere, cylinder, cone, torus, plane
- Customizable: size, location, color

### 2. `generate_building`
Create architectural structures
- Types: house, building, church, tower, castle
- Options: number of floors, style

### 3. `generate_human_part`
Create human body parts
- Parts: head, hand, foot, leg, arm, torso, full_body
- Detail levels: low, medium, high

### 4. `apply_texture`
Apply materials to objects
- Textures: wood, metal, stone, brick, glass, plastic, fabric, skin
- Customizable colors

### 5. `generate_from_prompt`
Natural language generation (most powerful!)
- English and Spanish support
- Automatically analyzes and creates complex scenes
- Detects quantities, positions, and relationships

### 6. `execute_blender_script`
Run custom Python code in Blender
- For advanced users
- Full Blender API access

## Tips & Tricks

### Tip 1: Be Specific
❌ "Create a cube"
✅ "Create a red cube of size 3 at position [5, 0, 0]"

### Tip 2: Use Natural Language
The `generate_from_prompt` tool is smart!
```
"I want a person" → Generates full body
"Person with two arms" → Detects quantity
"Persona con cabeza" → Supports Spanish
```

### Tip 3: Detail Levels
- **Low**: Fast, simple geometry (good for prototyping)
- **Medium**: Balanced (default, recommended)
- **High**: Detailed, smoother (slower in Blender)

### Tip 4: Positioning
Place objects at specific locations:
```
Create a house at [0, 0, 0]
Create a person at [5, 0, 0]
Create a tree at [-5, 0, 0]
```

### Tip 5: Test Scripts First
Run `npm test` to generate example scripts in `test_output/`
These are great references for learning!

## Troubleshooting

### Problem: Server not found
**Solution:** Check your config file path is correct and restart AI assistant

### Problem: Scripts don't work in Blender
**Solution:** 
- Ensure you're in Object Mode
- Check Blender version (2.8+)
- Look at Python console for errors

### Problem: "Object not found" when applying textures
**Solution:** Create the object first, note its name, then apply texture

### Problem: Natural language not working well
**Solution:** Be more specific, use keywords like "person", "building", "head", "arms"

## Learning Resources

### Example Scripts
Check `test_output/` after running `npm test`:
- `test_cube.py` - Simple shape
- `test_house.py` - House with details
- `test_church.py` - Complex building
- `test_full_body.py` - Complete human
- `test_prompt_person.py` - NL generated

### Example Prompts
See `examples/PROMPTS.md` for 50+ example prompts

### Blender Python API
- [Official Docs](https://docs.blender.org/api/current/)
- [Blender Python Tutorials](https://docs.blender.org/api/current/info_quickstart.html)

## Next Steps

1. ✅ Install and test the server
2. ✅ Configure with your AI assistant
3. ✅ Try basic prompts
4. 🎯 Create your first 3D model
5. 🎯 Experiment with complex scenes
6. 🎯 Share your creations!

## Support

- **Issues:** [GitHub Issues](https://github.com/PadreGarcia/blender_MCP/issues)
- **Examples:** Check `examples/` directory
- **Tests:** Run `npm test` to see what's possible

## Advanced Topics

### Custom Detail Levels
```javascript
// Low detail (fast)
{ "body_part": "head", "detail_level": "low" }

// High detail (slow but smooth)
{ "body_part": "head", "detail_level": "high" }
```

### Combining Multiple Objects
Create complex scenes by generating multiple objects:
1. Generate house
2. Generate person
3. Generate trees
4. Apply textures to each

### Scripting Best Practices
- Always clear scene first (the scripts do this)
- Name objects descriptively
- Use location parameters to position objects
- Apply textures after creating objects

---

**You're ready to create amazing 3D content with AI! 🎨🤖**

Have questions? Check the README.md for full documentation.
