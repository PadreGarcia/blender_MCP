# Example Prompts for Blender MCP Server

This file contains example prompts you can use with the Blender MCP server.

## Geometric Shapes

### English
- "Create a red cube of size 2"
- "Generate a blue sphere at location [0, 0, 5]"
- "Make a yellow cylinder with size 1.5"
- "Create a green cone"
- "Generate a torus"

### Spanish
- "Crea un cubo rojo de tamaño 2"
- "Genera una esfera azul"
- "Haz un cilindro amarillo"

## Buildings

### Houses
- "Create a house with windows and a door"
- "Generate a two-story house"
- "Make a house with a pyramidal roof"
- "Crea una casa con ventanas"

### Buildings
- "Create a 5-story modern building"
- "Generate a 10-floor office building"
- "Build a skyscraper with 20 floors"
- "Crea un edificio de 7 pisos"

### Churches
- "Generate a church with a tower and spire"
- "Create a church with a cross on top"
- "Make a gothic church"
- "Genera una iglesia con torre"

## Human Body Parts

### Individual Parts
- "Create a human head with eyes, nose, and mouth"
- "Generate a hand with five fingers"
- "Make a foot with toes"
- "Create an arm with elbow"
- "Generate a leg"
- "Make a torso"

### Spanish
- "Crea una cabeza humana"
- "Genera una mano con dedos"
- "Haz un pie"
- "Crea un brazo"

### Complete Body
- "Create a person with a head, two arms, two legs, and two hands"
- "Generate a complete human body"
- "Make a full human figure with all body parts"
- "Persona con una cabeza, dos brazos, dos piernas y dos pies"
- "Crea una persona completa"

### Detailed Bodies
- "Create a person with:
  - One head with eyes, nose, and mouth
  - Two arms with hands
  - Two legs with feet
  - A torso connecting everything"

## Textures

- "Apply wood texture to the house walls"
- "Make the sphere metallic"
- "Apply glass material to the windows"
- "Give the floor a stone texture"
- "Apply skin material to the head"
- "Make it look like brick"
- "Apply fabric texture"

## Complex Scenes

### Scene 1: Simple Person
```
Create a person with a head, two arms with hands, two legs with feet, standing upright
```

### Scene 2: House with Details
```
Generate a house with:
- A foundation
- Four walls
- A pyramidal roof
- A front door
- Four windows
Apply wood texture to the walls and stone to the foundation
```

### Scene 3: City Building
```
Create a 10-story modern building with:
- Windows on each floor
- A flat roof
- Located at the center
Apply glass texture to the windows
```

### Scene 4: Church
```
Generate a church with:
- A main building
- A tall tower
- A spire with a cross
- An entrance door
Apply stone texture to the walls
```

## Combination Examples

### Multiple Objects
1. "Create three cubes in a row"
2. "Generate a person standing next to a house"
3. "Make a church and a building next to each other"

### With Specifications
1. "Create a red cube of size 3 at position [0, 0, 0] and a blue sphere of size 2 at position [5, 0, 0]"
2. "Generate a 5-story building with modern style and apply glass texture to the windows"
3. "Create a complete person with high detail level"

## Testing Prompts

Use these to test the natural language processing:

### English + Spanish Mix
- "Create a persona with dos arms and two legs"
- "Genera una person with cabeza and hands"

### Implicit Full Body
- "Create a person" (should detect and create full body)
- "Generate a human" (should create full body)
- "Make a complete person" (should create full body)

### Count Detection
- "Person with two arms" (should create 2 arms)
- "Building with 5 floors" (should create 5-story building)
- "Hand with five fingers" (creates fingers)

## Advanced Usage

### Custom Detail Levels
- "Create a head with low detail"
- "Generate a hand with high detail"
- "Make a full body with medium detail"

### Precise Positioning
- "Create a cube at location [10, 5, 3]"
- "Generate a sphere at position [0, 0, 10] with size 2"
- "Place a building at coordinates [-5, -5, 0]"

### Style Variations
- "Create a modern style building"
- "Generate a classic house"
- "Make a medieval castle"

## Tips for Best Results

1. **Be Specific**: "Create a red cube of size 2" is better than "make a cube"
2. **Use Quantities**: "two arms", "five floors", "ten windows"
3. **Specify Details**: "with eyes, nose, and mouth" helps the AI understand
4. **Combine Features**: You can request multiple attributes in one prompt
5. **Natural Language**: The system understands both English and Spanish
6. **Full Descriptions**: For complex objects, describe all components

## Common Patterns

### Pattern 1: Object + Properties
```
Create a [object] with [properties]
Example: "Create a sphere with red color and size 3"
```

### Pattern 2: Object + Location
```
Generate a [object] at [location]
Example: "Generate a building at position [10, 10, 0]"
```

### Pattern 3: Complex Object + Components
```
Make a [object] with [component1], [component2], and [component3]
Example: "Make a person with a head, arms, and legs"
```

### Pattern 4: Object + Texture
```
Create a [object] and apply [texture]
Example: "Create a cube and apply wood texture"
```
