#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Server instance
const server = new Server(
  {
    name: "blender-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool definitions
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "generate_geometric_shape",
        description: "Generate basic geometric shapes in Blender (cube, sphere, cylinder, cone, torus, etc.)",
        inputSchema: {
          type: "object",
          properties: {
            shape_type: {
              type: "string",
              enum: ["cube", "sphere", "cylinder", "cone", "torus", "plane"],
              description: "Type of geometric shape to create"
            },
            size: {
              type: "number",
              description: "Size/scale of the shape",
              default: 1.0
            },
            location: {
              type: "array",
              items: { type: "number" },
              description: "3D location [x, y, z]",
              default: [0, 0, 0]
            },
            color: {
              type: "string",
              description: "Color for the object (hex or name)",
              default: "gray"
            }
          },
          required: ["shape_type"]
        }
      },
      {
        name: "generate_building",
        description: "Generate complex architectural structures (house, building, church, tower, etc.)",
        inputSchema: {
          type: "object",
          properties: {
            building_type: {
              type: "string",
              enum: ["house", "building", "church", "tower", "castle"],
              description: "Type of building to create"
            },
            floors: {
              type: "number",
              description: "Number of floors/levels",
              default: 2
            },
            style: {
              type: "string",
              description: "Architectural style (modern, classic, medieval, etc.)",
              default: "modern"
            },
            location: {
              type: "array",
              items: { type: "number" },
              description: "3D location [x, y, z]",
              default: [0, 0, 0]
            }
          },
          required: ["building_type"]
        }
      },
      {
        name: "generate_human_part",
        description: "Generate human body parts (head, hand, foot, leg, arm, torso, etc.)",
        inputSchema: {
          type: "object",
          properties: {
            body_part: {
              type: "string",
              enum: ["head", "hand", "foot", "leg", "arm", "torso", "full_body"],
              description: "Body part to create"
            },
            detail_level: {
              type: "string",
              enum: ["low", "medium", "high"],
              description: "Level of detail for the model",
              default: "medium"
            },
            location: {
              type: "array",
              items: { type: "number" },
              description: "3D location [x, y, z]",
              default: [0, 0, 0]
            }
          },
          required: ["body_part"]
        }
      },
      {
        name: "apply_texture",
        description: "Apply textures and materials to objects in Blender",
        inputSchema: {
          type: "object",
          properties: {
            object_name: {
              type: "string",
              description: "Name of the object to apply texture to"
            },
            texture_type: {
              type: "string",
              enum: ["wood", "metal", "stone", "brick", "glass", "plastic", "fabric", "skin"],
              description: "Type of texture/material"
            },
            color: {
              type: "string",
              description: "Base color for the texture",
              default: "default"
            }
          },
          required: ["object_name", "texture_type"]
        }
      },
      {
        name: "generate_creature",
        description: "Generate fantasy creatures, monsters, and animals (dragon, spider, octopus, alien, etc.)",
        inputSchema: {
          type: "object",
          properties: {
            creature_type: {
              type: "string",
              enum: ["dragon", "spider", "octopus", "alien", "monster", "serpent", "bird", "fish"],
              description: "Type of creature to create"
            },
            size: {
              type: "number",
              description: "Overall size scale of the creature",
              default: 2.0
            },
            detail_level: {
              type: "string",
              enum: ["low", "medium", "high"],
              description: "Level of detail for the model",
              default: "medium"
            },
            location: {
              type: "array",
              items: { type: "number" },
              description: "3D location [x, y, z]",
              default: [0, 0, 0]
            }
          },
          required: ["creature_type"]
        }
      },
      {
        name: "generate_from_prompt",
        description: "Generate 3D objects from natural language descriptions. The AI will parse the prompt and create appropriate geometry including creatures, monsters, complex structures, and designs.",
        inputSchema: {
          type: "object",
          properties: {
            prompt: {
              type: "string",
              description: "Natural language description of what to create (e.g., 'a person with a head, two arms, two legs', 'a dragon with wings', 'un monstruo con tentáculos')"
            },
            detail_level: {
              type: "string",
              enum: ["low", "medium", "high"],
              description: "Level of detail for the generation",
              default: "medium"
            }
          },
          required: ["prompt"]
        }
      },
      {
        name: "execute_blender_script",
        description: "Execute custom Python script in Blender for advanced operations",
        inputSchema: {
          type: "object",
          properties: {
            script: {
              type: "string",
              description: "Python script to execute in Blender"
            }
          },
          required: ["script"]
        }
      }
    ]
  };
});

// Tool execution handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "generate_geometric_shape":
        return await handleGeometricShape(args);
      
      case "generate_building":
        return await handleBuilding(args);
      
      case "generate_human_part":
        return await handleHumanPart(args);
      
      case "generate_creature":
        return await handleCreature(args);
      
      case "apply_texture":
        return await handleTexture(args);
      
      case "generate_from_prompt":
        return await handlePrompt(args);
      
      case "execute_blender_script":
        return await handleBlenderScript(args);
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`
        }
      ],
      isError: true
    };
  }
});

// Handler functions
async function handleGeometricShape(args) {
  const { shape_type, size = 1.0, location = [0, 0, 0], color = "gray" } = args;
  
  const script = generateGeometricShapeScript(shape_type, size, location, color);
  
  return {
    content: [
      {
        type: "text",
        text: `Generated ${shape_type} with size ${size} at location [${location.join(", ")}].\n\nBlender Python Script:\n\`\`\`python\n${script}\n\`\`\``
      }
    ]
  };
}

async function handleBuilding(args) {
  const { building_type, floors = 2, style = "modern", location = [0, 0, 0] } = args;
  
  const script = generateBuildingScript(building_type, floors, style, location);
  
  return {
    content: [
      {
        type: "text",
        text: `Generated ${building_type} with ${floors} floors in ${style} style at location [${location.join(", ")}].\n\nBlender Python Script:\n\`\`\`python\n${script}\n\`\`\``
      }
    ]
  };
}

async function handleHumanPart(args) {
  const { body_part, detail_level = "medium", location = [0, 0, 0] } = args;
  
  const script = generateHumanPartScript(body_part, detail_level, location);
  
  return {
    content: [
      {
        type: "text",
        text: `Generated ${body_part} with ${detail_level} detail at location [${location.join(", ")}].\n\nBlender Python Script:\n\`\`\`python\n${script}\n\`\`\``
      }
    ]
  };
}

async function handleCreature(args) {
  const { creature_type, size = 2.0, detail_level = "medium", location = [0, 0, 0] } = args;
  
  const script = generateCreatureScript(creature_type, size, detail_level, location);
  
  return {
    content: [
      {
        type: "text",
        text: `Generated ${creature_type} with ${detail_level} detail at location [${location.join(", ")}].\n\nBlender Python Script:\n\`\`\`python\n${script}\n\`\`\``
      }
    ]
  };
}

async function handleTexture(args) {
  const { object_name, texture_type, color = "default" } = args;
  
  const script = generateTextureScript(object_name, texture_type, color);
  
  return {
    content: [
      {
        type: "text",
        text: `Applied ${texture_type} texture to ${object_name}.\n\nBlender Python Script:\n\`\`\`python\n${script}\n\`\`\``
      }
    ]
  };
}

async function handlePrompt(args) {
  const { prompt, detail_level = "medium" } = args;
  
  // Parse the prompt and generate appropriate commands
  const analysis = analyzePrompt(prompt);
  const script = generateFromAnalysis(analysis, detail_level);
  
  return {
    content: [
      {
        type: "text",
        text: `Analyzed prompt: "${prompt}"\n\nGeneration plan:\n${analysis.description}\n\nBlender Python Script:\n\`\`\`python\n${script}\n\`\`\``
      }
    ]
  };
}

async function handleBlenderScript(args) {
  const { script } = args;
  
  return {
    content: [
      {
        type: "text",
        text: `Script ready to execute in Blender:\n\`\`\`python\n${script}\n\`\`\``
      }
    ]
  };
}

// Script generation functions
function generateGeometricShapeScript(shape_type, size, location, color) {
  const colorMap = {
    red: [1, 0, 0, 1],
    green: [0, 1, 0, 1],
    blue: [0, 0, 1, 1],
    yellow: [1, 1, 0, 1],
    gray: [0.5, 0.5, 0.5, 1],
    white: [1, 1, 1, 1],
    black: [0, 0, 0, 1]
  };
  
  const colorRGBA = colorMap[color.toLowerCase()] || colorMap.gray;
  
  return `import bpy

# Delete default cube if it exists
if "Cube" in bpy.data.objects:
    bpy.data.objects["Cube"].select_set(True)
    bpy.ops.object.delete()

# Create ${shape_type}
bpy.ops.mesh.primitive_${shape_type}_add(size=${size}, location=(${location.join(", ")}))
obj = bpy.context.active_object
obj.name = "${shape_type.charAt(0).toUpperCase() + shape_type.slice(1)}_Generated"

# Create and apply material
mat = bpy.data.materials.new(name="${shape_type}_Material")
mat.use_nodes = True
bsdf = mat.node_tree.nodes["Principled BSDF"]
bsdf.inputs["Base Color"].default_value = (${colorRGBA.join(", ")})

obj.data.materials.append(mat)

print(f"Created ${shape_type} at location ${location}")
`;
}

function generateBuildingScript(building_type, floors, style, location) {
  let script = `import bpy
import math

# Clear existing objects
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

def create_${building_type}(location, floors, style):
    """Generate a ${building_type} with ${floors} floors"""
    floor_height = 3.0
    
`;

  if (building_type === "house") {
    script += `    # Create base/foundation
    bpy.ops.mesh.primitive_cube_add(size=2, location=(location[0], location[1], location[2] + 0.5))
    base = bpy.context.active_object
    base.scale = (4, 4, 0.5)
    base.name = "House_Base"
    
    # Create walls
    bpy.ops.mesh.primitive_cube_add(size=2, location=(location[0], location[1], location[2] + 2))
    walls = bpy.context.active_object
    walls.scale = (3.5, 3.5, 1.5)
    walls.name = "House_Walls"
    
    # Create roof
    bpy.ops.mesh.primitive_cone_add(vertices=4, radius1=5, depth=2, location=(location[0], location[1], location[2] + 5))
    roof = bpy.context.active_object
    roof.rotation_euler[2] = math.radians(45)
    roof.name = "House_Roof"
    
    # Create door
    bpy.ops.mesh.primitive_cube_add(size=1, location=(location[0] + 3.5, location[1], location[2] + 1.5))
    door = bpy.context.active_object
    door.scale = (0.1, 1, 1.5)
    door.name = "House_Door"
    
    # Create windows
    for i, pos in enumerate([(-2, 2, 2.5), (2, 2, 2.5), (-2, -2, 2.5), (2, -2, 2.5)]):
        bpy.ops.mesh.primitive_cube_add(size=0.8, location=(location[0] + pos[0], location[1] + pos[1], location[2] + pos[2]))
        window = bpy.context.active_object
        window.scale = (0.1, 1, 1)
        window.name = f"House_Window_{i}"
`;
  } else if (building_type === "building") {
    script += `    # Create multi-story building
    for floor in range(floors):
        z_pos = location[2] + (floor * floor_height) + (floor_height / 2)
        
        # Floor structure
        bpy.ops.mesh.primitive_cube_add(size=2, location=(location[0], location[1], z_pos))
        floor_obj = bpy.context.active_object
        floor_obj.scale = (4, 4, floor_height / 2)
        floor_obj.name = f"Building_Floor_{floor + 1}"
        
        # Windows for each floor
        for x in [-3, 0, 3]:
            for y in [-3, 3]:
                bpy.ops.mesh.primitive_cube_add(size=0.6, location=(location[0] + x, location[1] + y, z_pos))
                window = bpy.context.active_object
                window.scale = (0.8, 0.1, 0.8)
                window.name = f"Window_Floor_{floor + 1}_{x}_{y}"
    
    # Create roof
    z_pos = location[2] + (floors * floor_height) + 0.5
    bpy.ops.mesh.primitive_cube_add(size=2, location=(location[0], location[1], z_pos))
    roof = bpy.context.active_object
    roof.scale = (4.2, 4.2, 0.5)
    roof.name = "Building_Roof"
`;
  } else if (building_type === "church") {
    script += `    # Create church base
    bpy.ops.mesh.primitive_cube_add(size=2, location=(location[0], location[1], location[2] + 2))
    base = bpy.context.active_object
    base.scale = (4, 6, 2)
    base.name = "Church_Base"
    
    # Create tower
    bpy.ops.mesh.primitive_cube_add(size=2, location=(location[0], location[1] - 5, location[2] + 5))
    tower = bpy.context.active_object
    tower.scale = (1.5, 1.5, 3)
    tower.name = "Church_Tower"
    
    # Create spire
    bpy.ops.mesh.primitive_cone_add(radius1=1.8, depth=4, location=(location[0], location[1] - 5, location[2] + 10))
    spire = bpy.context.active_object
    spire.name = "Church_Spire"
    
    # Create cross on top
    bpy.ops.mesh.primitive_cube_add(size=0.3, location=(location[0], location[1] - 5, location[2] + 13))
    cross_v = bpy.context.active_object
    cross_v.scale = (1, 1, 3)
    cross_v.name = "Cross_Vertical"
    
    bpy.ops.mesh.primitive_cube_add(size=0.3, location=(location[0], location[1] - 5, location[2] + 12.5))
    cross_h = bpy.context.active_object
    cross_h.scale = (2, 1, 1)
    cross_h.name = "Cross_Horizontal"
    
    # Create entrance
    bpy.ops.mesh.primitive_cube_add(size=1, location=(location[0] + 4, location[1] + 2, location[2] + 1.5))
    entrance = bpy.context.active_object
    entrance.scale = (0.1, 1.5, 2)
    entrance.name = "Church_Entrance"
`;
  }

  script += `
create_${building_type}((${location.join(", ")}), ${floors}, "${style}")
print(f"Created ${building_type} with {floors} floors")
`;

  return script;
}

function generateHumanPartScript(body_part, detail_level, location) {
  const subdivisions = { low: 1, medium: 2, high: 3 }[detail_level];
  
  let script = `import bpy
import math

def create_${body_part}(location, detail_level):
    """Generate a ${body_part} with ${detail_level} detail"""
    
`;

  if (body_part === "head") {
    script += `    # Create head (sphere)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=1, location=(location[0], location[1], location[2]))
    head = bpy.context.active_object
    head.scale = (1, 0.85, 1.1)
    head.name = "Head"
    
    # Apply subdivision for detail
    mod = head.modifiers.new(name="Subsurf", type='SUBSURF')
    mod.levels = ${subdivisions}
    
    # Create eyes
    for x_offset in [-0.3, 0.3]:
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.15, location=(location[0] + x_offset, location[1] + 0.6, location[2] + 0.2))
        eye = bpy.context.active_object
        eye.name = f"Eye_{'L' if x_offset < 0 else 'R'}"
    
    # Create nose
    bpy.ops.mesh.primitive_cone_add(radius1=0.12, radius2=0.08, depth=0.3, location=(location[0], location[1] + 0.7, location[2] - 0.1))
    nose = bpy.context.active_object
    nose.rotation_euler[0] = math.radians(90)
    nose.name = "Nose"
    
    # Create mouth
    bpy.ops.mesh.primitive_torus_add(major_radius=0.2, minor_radius=0.05, location=(location[0], location[1] + 0.65, location[2] - 0.4))
    mouth = bpy.context.active_object
    mouth.scale = (1, 0.5, 0.5)
    mouth.rotation_euler[0] = math.radians(90)
    mouth.name = "Mouth"
`;
  } else if (body_part === "hand") {
    script += `    # Create palm
    bpy.ops.mesh.primitive_cube_add(size=1, location=(location[0], location[1], location[2]))
    palm = bpy.context.active_object
    palm.scale = (0.4, 0.15, 0.6)
    palm.name = "Palm"
    
    # Create fingers
    finger_positions = [
        (-0.3, 0, 0.4, "Thumb"),
        (-0.15, 0, 0.7, "Index"),
        (0, 0, 0.75, "Middle"),
        (0.15, 0, 0.7, "Ring"),
        (0.3, 0, 0.6, "Pinky")
    ]
    
    for x, y, z, name in finger_positions:
        # Finger base
        bpy.ops.mesh.primitive_cube_add(size=0.15, location=(location[0] + x, location[1] + y, location[2] + z))
        finger = bpy.context.active_object
        finger.scale = (1, 1, 1.5)
        finger.name = f"Finger_{name}_Base"
        
        # Finger tip
        bpy.ops.mesh.primitive_cube_add(size=0.12, location=(location[0] + x, location[1] + y, location[2] + z + 0.25))
        tip = bpy.context.active_object
        tip.scale = (1, 1, 1.2)
        tip.name = f"Finger_{name}_Tip"
    
    # Apply subdivision
    mod = palm.modifiers.new(name="Subsurf", type='SUBSURF')
    mod.levels = ${subdivisions}
`;
  } else if (body_part === "foot") {
    script += `    # Create foot base
    bpy.ops.mesh.primitive_cube_add(size=1, location=(location[0], location[1], location[2]))
    foot = bpy.context.active_object
    foot.scale = (0.4, 1, 0.3)
    foot.name = "Foot"
    
    # Create toes
    for i in range(5):
        x_offset = -0.3 + (i * 0.15)
        bpy.ops.mesh.primitive_cube_add(size=0.12, location=(location[0] + x_offset, location[1] + 1.1, location[2]))
        toe = bpy.context.active_object
        toe.scale = (1, 0.8, 0.8)
        toe.name = f"Toe_{i + 1}"
    
    # Create heel
    bpy.ops.mesh.primitive_cube_add(size=0.5, location=(location[0], location[1] - 0.6, location[2] - 0.1))
    heel = bpy.context.active_object
    heel.scale = (0.8, 0.6, 0.5)
    heel.name = "Heel"
    
    mod = foot.modifiers.new(name="Subsurf", type='SUBSURF')
    mod.levels = ${subdivisions}
`;
  } else if (body_part === "arm") {
    script += `    # Create upper arm
    bpy.ops.mesh.primitive_cylinder_add(radius=0.15, depth=1.5, location=(location[0], location[1], location[2]))
    upper_arm = bpy.context.active_object
    upper_arm.name = "Upper_Arm"
    
    # Create elbow
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.18, location=(location[0], location[1], location[2] - 0.8))
    elbow = bpy.context.active_object
    elbow.name = "Elbow"
    
    # Create forearm
    bpy.ops.mesh.primitive_cylinder_add(radius=0.13, depth=1.3, location=(location[0], location[1], location[2] - 1.5))
    forearm = bpy.context.active_object
    forearm.name = "Forearm"
    
    mod = upper_arm.modifiers.new(name="Subsurf", type='SUBSURF')
    mod.levels = ${subdivisions}
`;
  } else if (body_part === "leg") {
    script += `    # Create thigh
    bpy.ops.mesh.primitive_cylinder_add(radius=0.2, depth=1.8, location=(location[0], location[1], location[2]))
    thigh = bpy.context.active_object
    thigh.name = "Thigh"
    
    # Create knee
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.22, location=(location[0], location[1], location[2] - 1))
    knee = bpy.context.active_object
    knee.name = "Knee"
    
    # Create calf
    bpy.ops.mesh.primitive_cylinder_add(radius=0.15, depth=1.6, location=(location[0], location[1], location[2] - 2))
    calf = bpy.context.active_object
    calf.name = "Calf"
    
    mod = thigh.modifiers.new(name="Subsurf", type='SUBSURF')
    mod.levels = ${subdivisions}
`;
  } else if (body_part === "torso") {
    script += `    # Create chest
    bpy.ops.mesh.primitive_cube_add(size=2, location=(location[0], location[1], location[2]))
    chest = bpy.context.active_object
    chest.scale = (0.8, 0.5, 1.2)
    chest.name = "Chest"
    
    # Create abdomen
    bpy.ops.mesh.primitive_cube_add(size=1.5, location=(location[0], location[1], location[2] - 1.5))
    abdomen = bpy.context.active_object
    abdomen.scale = (0.7, 0.45, 0.8)
    abdomen.name = "Abdomen"
    
    # Create pelvis
    bpy.ops.mesh.primitive_cube_add(size=1.2, location=(location[0], location[1], location[2] - 2.5))
    pelvis = bpy.context.active_object
    pelvis.scale = (0.9, 0.5, 0.6)
    pelvis.name = "Pelvis"
    
    mod = chest.modifiers.new(name="Subsurf", type='SUBSURF')
    mod.levels = ${subdivisions}
`;
  } else if (body_part === "full_body") {
    script += `    # Create full human body
    
    # Head
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.35, location=(location[0], location[1], location[2] + 6.5))
    head = bpy.context.active_object
    head.scale = (1, 0.85, 1.1)
    head.name = "Head"
    
    # Neck
    bpy.ops.mesh.primitive_cylinder_add(radius=0.15, depth=0.3, location=(location[0], location[1], location[2] + 6))
    neck = bpy.context.active_object
    neck.name = "Neck"
    
    # Torso
    bpy.ops.mesh.primitive_cube_add(size=2, location=(location[0], location[1], location[2] + 4.5))
    torso = bpy.context.active_object
    torso.scale = (0.8, 0.5, 1.5)
    torso.name = "Torso"
    
    # Arms
    for x_side in [-1.2, 1.2]:
        # Shoulder
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.2, location=(location[0] + x_side, location[1], location[2] + 5.5))
        shoulder = bpy.context.active_object
        shoulder.name = f"Shoulder_{'L' if x_side < 0 else 'R'}"
        
        # Upper arm
        bpy.ops.mesh.primitive_cylinder_add(radius=0.12, depth=1.2, location=(location[0] + x_side, location[1], location[2] + 4.5))
        upper_arm = bpy.context.active_object
        upper_arm.name = f"Upper_Arm_{'L' if x_side < 0 else 'R'}"
        
        # Forearm
        bpy.ops.mesh.primitive_cylinder_add(radius=0.1, depth=1, location=(location[0] + x_side, location[1], location[2] + 3.2))
        forearm = bpy.context.active_object
        forearm.name = f"Forearm_{'L' if x_side < 0 else 'R'}"
        
        # Hand
        bpy.ops.mesh.primitive_cube_add(size=0.3, location=(location[0] + x_side, location[1], location[2] + 2.5))
        hand = bpy.context.active_object
        hand.scale = (1.2, 0.5, 1.5)
        hand.name = f"Hand_{'L' if x_side < 0 else 'R'}"
    
    # Pelvis
    bpy.ops.mesh.primitive_cube_add(size=1, location=(location[0], location[1], location[2] + 3))
    pelvis = bpy.context.active_object
    pelvis.scale = (1, 0.6, 0.5)
    pelvis.name = "Pelvis"
    
    # Legs
    for x_side in [-0.4, 0.4]:
        # Thigh
        bpy.ops.mesh.primitive_cylinder_add(radius=0.15, depth=1.5, location=(location[0] + x_side, location[1], location[2] + 2))
        thigh = bpy.context.active_object
        thigh.name = f"Thigh_{'L' if x_side < 0 else 'R'}"
        
        # Calf
        bpy.ops.mesh.primitive_cylinder_add(radius=0.12, depth=1.3, location=(location[0] + x_side, location[1], location[2] + 0.5))
        calf = bpy.context.active_object
        calf.name = f"Calf_{'L' if x_side < 0 else 'R'}"
        
        # Foot
        bpy.ops.mesh.primitive_cube_add(size=0.3, location=(location[0] + x_side, location[1] + 0.15, location[2] - 0.3))
        foot = bpy.context.active_object
        foot.scale = (1, 2, 0.7)
        foot.name = f"Foot_{'L' if x_side < 0 else 'R'}"
    
    # Apply subdivision to main parts
    for obj_name in ["Head", "Torso"]:
        obj = bpy.data.objects.get(obj_name)
        if obj:
            mod = obj.modifiers.new(name="Subsurf", type='SUBSURF')
            mod.levels = ${subdivisions}
`;
  }

  script += `
create_${body_part}((${location.join(", ")}), "${detail_level}")
print(f"Created ${body_part} with {detail_level} detail")
`;

  return script;
}

function generateCreatureScript(creature_type, size, detail_level, location) {
  const subdivisions = { low: 1, medium: 2, high: 3 }[detail_level];
  
  let script = `import bpy
import math

def create_${creature_type}(location, size, detail_level):
    """Generate a ${creature_type} with ${detail_level} detail"""
    
`;

  if (creature_type === "dragon") {
    script += `    # Dragon body
    bpy.ops.mesh.primitive_uv_sphere_add(radius=size * 0.6, location=(location[0], location[1], location[2] + size * 0.8))
    body = bpy.context.active_object
    body.scale = (1.5, 1, 1)
    body.name = "Dragon_Body"
    
    # Dragon head
    bpy.ops.mesh.primitive_uv_sphere_add(radius=size * 0.4, location=(location[0] + size * 1.2, location[1], location[2] + size * 1))
    head = bpy.context.active_object
    head.scale = (1.3, 0.8, 0.9)
    head.name = "Dragon_Head"
    
    # Dragon neck
    bpy.ops.mesh.primitive_cylinder_add(radius=size * 0.25, depth=size * 0.8, location=(location[0] + size * 0.6, location[1], location[2] + size * 0.9))
    neck = bpy.context.active_object
    neck.rotation_euler[1] = math.radians(45)
    neck.name = "Dragon_Neck"
    
    # Dragon tail
    for i in range(5):
        tail_pos = (location[0] - size * (0.5 + i * 0.4), location[1], location[2] + size * (0.6 - i * 0.15))
        tail_size = size * (0.3 - i * 0.04)
        bpy.ops.mesh.primitive_uv_sphere_add(radius=tail_size, location=tail_pos)
        tail_seg = bpy.context.active_object
        tail_seg.scale = (1.5, 1, 1)
        tail_seg.name = f"Dragon_Tail_{i}"
    
    # Dragon wings
    for x_side in [-1, 1]:
        # Wing base
        bpy.ops.mesh.primitive_cube_add(size=size * 0.4, location=(location[0], location[1] + x_side * size * 0.8, location[2] + size))
        wing_base = bpy.context.active_object
        wing_base.scale = (0.3, 1, 0.5)
        wing_base.name = f"Dragon_Wing_Base_{'L' if x_side < 0 else 'R'}"
        
        # Wing membrane
        bpy.ops.mesh.primitive_cube_add(size=size * 0.8, location=(location[0] - size * 0.3, location[1] + x_side * size * 1.5, location[2] + size * 1.2))
        wing_mem = bpy.context.active_object
        wing_mem.scale = (0.05, 1.8, 1.5)
        wing_mem.rotation_euler[2] = math.radians(x_side * 20)
        wing_mem.name = f"Dragon_Wing_{'L' if x_side < 0 else 'R'}"
    
    # Dragon legs
    for x_side in [-0.5, 0.5]:
        for z_offset in [0.3, -0.3]:
            leg_pos = (location[0] + z_offset * size, location[1] + x_side * size * 0.8, location[2] + size * 0.3)
            bpy.ops.mesh.primitive_cylinder_add(radius=size * 0.15, depth=size * 0.6, location=leg_pos)
            leg = bpy.context.active_object
            leg.name = f"Dragon_Leg_{x_side}_{z_offset}"
    
    # Apply subdivision for smoothness
    for obj_name in ["Dragon_Body", "Dragon_Head"]:
        obj = bpy.data.objects.get(obj_name)
        if obj:
            mod = obj.modifiers.new(name="Subsurf", type='SUBSURF')
            mod.levels = ${subdivisions}
`;
  } else if (creature_type === "spider") {
    script += `    # Spider body
    bpy.ops.mesh.primitive_uv_sphere_add(radius=size * 0.4, location=(location[0], location[1], location[2] + size * 0.5))
    body = bpy.context.active_object
    body.scale = (0.8, 1.2, 0.7)
    body.name = "Spider_Body"
    
    # Spider head
    bpy.ops.mesh.primitive_uv_sphere_add(radius=size * 0.25, location=(location[0] + size * 0.5, location[1], location[2] + size * 0.55))
    head = bpy.context.active_object
    head.scale = (1.1, 0.9, 0.9)
    head.name = "Spider_Head"
    
    # Spider legs (8 legs)
    leg_angles = [0, 45, 90, 135, 180, 225, 270, 315]
    for i, angle in enumerate(leg_angles):
        angle_rad = math.radians(angle)
        
        # Upper leg segment
        x_offset = math.cos(angle_rad) * size * 0.6
        y_offset = math.sin(angle_rad) * size * 0.6
        bpy.ops.mesh.primitive_cylinder_add(
            radius=size * 0.06, 
            depth=size * 0.8,
            location=(location[0] + x_offset * 0.5, location[1] + y_offset * 0.5, location[2] + size * 0.6)
        )
        upper_leg = bpy.context.active_object
        upper_leg.rotation_euler[2] = angle_rad
        upper_leg.rotation_euler[1] = math.radians(-30)
        upper_leg.name = f"Spider_Leg_{i}_Upper"
        
        # Lower leg segment
        bpy.ops.mesh.primitive_cylinder_add(
            radius=size * 0.04, 
            depth=size * 0.7,
            location=(location[0] + x_offset, location[1] + y_offset, location[2] + size * 0.2)
        )
        lower_leg = bpy.context.active_object
        lower_leg.rotation_euler[2] = angle_rad
        lower_leg.rotation_euler[1] = math.radians(-60)
        lower_leg.name = f"Spider_Leg_{i}_Lower"
    
    # Spider eyes
    for i in range(8):
        eye_x = (i % 4 - 1.5) * size * 0.08
        eye_z = (i // 4) * size * 0.08
        bpy.ops.mesh.primitive_uv_sphere_add(
            radius=size * 0.05,
            location=(location[0] + size * 0.65, location[1] + eye_x, location[2] + size * 0.6 + eye_z)
        )
        eye = bpy.context.active_object
        eye.name = f"Spider_Eye_{i}"
    
    mod = body.modifiers.new(name="Subsurf", type='SUBSURF')
    mod.levels = ${subdivisions}
`;
  } else if (creature_type === "octopus") {
    script += `    # Octopus head/mantle
    bpy.ops.mesh.primitive_uv_sphere_add(radius=size * 0.6, location=(location[0], location[1], location[2] + size))
    head = bpy.context.active_object
    head.scale = (1, 1, 1.3)
    head.name = "Octopus_Head"
    
    # Octopus eyes
    for x_side in [-0.3, 0.3]:
        bpy.ops.mesh.primitive_uv_sphere_add(
            radius=size * 0.12,
            location=(location[0] + size * 0.4, location[1] + x_side * size, location[2] + size * 1.1)
        )
        eye = bpy.context.active_object
        eye.name = f"Octopus_Eye_{'L' if x_side < 0 else 'R'}"
    
    # Octopus tentacles (8 tentacles)
    tentacle_angles = [0, 45, 90, 135, 180, 225, 270, 315]
    for i, angle in enumerate(tentacle_angles):
        angle_rad = math.radians(angle)
        
        # Create tentacle with multiple segments
        for segment in range(6):
            segment_size = size * (0.15 - segment * 0.02)
            segment_length = size * 0.4
            
            x_base = math.cos(angle_rad) * size * (0.5 + segment * 0.3)
            y_base = math.sin(angle_rad) * size * (0.5 + segment * 0.3)
            z_pos = location[2] + size * 0.5 - segment * size * 0.15
            
            bpy.ops.mesh.primitive_cylinder_add(
                radius=segment_size,
                depth=segment_length,
                location=(location[0] + x_base, location[1] + y_base, z_pos)
            )
            tent_seg = bpy.context.active_object
            tent_seg.rotation_euler[2] = angle_rad
            tent_seg.rotation_euler[1] = math.radians(-15 - segment * 5)
            tent_seg.name = f"Octopus_Tentacle_{i}_Seg_{segment}"
            
            # Add suction cups
            if segment > 0 and segment % 2 == 0:
                for sucker in range(3):
                    sucker_offset = (sucker - 1) * segment_length * 0.25
                    sucker_x = x_base + math.cos(angle_rad) * sucker_offset
                    sucker_y = y_base + math.sin(angle_rad) * sucker_offset
                    
                    bpy.ops.mesh.primitive_cylinder_add(
                        radius=segment_size * 0.5,
                        depth=segment_size * 0.3,
                        location=(location[0] + sucker_x, location[1] + sucker_y, z_pos - segment_size)
                    )
                    sucker_obj = bpy.context.active_object
                    sucker_obj.rotation_euler = tent_seg.rotation_euler
                    sucker_obj.name = f"Octopus_Sucker_{i}_{segment}_{sucker}"
    
    mod = head.modifiers.new(name="Subsurf", type='SUBSURF')
    mod.levels = ${subdivisions}
`;
  } else if (creature_type === "alien") {
    script += `    # Alien head (large)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=size * 0.5, location=(location[0], location[1], location[2] + size * 1.5))
    head = bpy.context.active_object
    head.scale = (1.2, 0.9, 1.3)
    head.name = "Alien_Head"
    
    # Alien large eyes
    for x_side in [-0.35, 0.35]:
        bpy.ops.mesh.primitive_uv_sphere_add(
            radius=size * 0.18,
            location=(location[0] + size * 0.35, location[1] + x_side * size, location[2] + size * 1.6)
        )
        eye = bpy.context.active_object
        eye.scale = (1.5, 1, 1.2)
        eye.name = f"Alien_Eye_{'L' if x_side < 0 else 'R'}"
    
    # Alien thin neck
    bpy.ops.mesh.primitive_cylinder_add(radius=size * 0.15, depth=size * 0.3, location=(location[0], location[1], location[2] + size * 1.15))
    neck = bpy.context.active_object
    neck.name = "Alien_Neck"
    
    # Alien small body
    bpy.ops.mesh.primitive_uv_sphere_add(radius=size * 0.35, location=(location[0], location[1], location[2] + size * 0.8))
    body = bpy.context.active_object
    body.scale = (0.8, 0.7, 1.2)
    body.name = "Alien_Body"
    
    # Alien thin long arms
    for x_side in [-1, 1]:
        # Upper arm
        bpy.ops.mesh.primitive_cylinder_add(
            radius=size * 0.08,
            depth=size * 0.8,
            location=(location[0], location[1] + x_side * size * 0.4, location[2] + size * 0.7)
        )
        upper_arm = bpy.context.active_object
        upper_arm.rotation_euler[2] = math.radians(x_side * 15)
        upper_arm.name = f"Alien_Upper_Arm_{'L' if x_side < 0 else 'R'}"
        
        # Forearm
        bpy.ops.mesh.primitive_cylinder_add(
            radius=size * 0.06,
            depth=size * 0.9,
            location=(location[0] - size * 0.2, location[1] + x_side * size * 0.8, location[2] + size * 0.3)
        )
        forearm = bpy.context.active_object
        forearm.rotation_euler[2] = math.radians(x_side * 25)
        forearm.name = f"Alien_Forearm_{'L' if x_side < 0 else 'R'}"
        
        # Three-fingered hand
        for finger in range(3):
            finger_angle = (finger - 1) * 30
            bpy.ops.mesh.primitive_cylinder_add(
                radius=size * 0.03,
                depth=size * 0.25,
                location=(location[0] - size * 0.4, location[1] + x_side * (size * 1.1 + finger * 0.05), location[2] + size * 0.1)
            )
            finger_obj = bpy.context.active_object
            finger_obj.rotation_euler[2] = math.radians(x_side * (25 + finger_angle))
            finger_obj.name = f"Alien_Finger_{'L' if x_side < 0 else 'R'}_{finger}"
    
    # Alien thin legs
    for x_side in [-0.25, 0.25]:
        bpy.ops.mesh.primitive_cylinder_add(
            radius=size * 0.1,
            depth=size * 0.9,
            location=(location[0], location[1] + x_side * size, location[2] + size * 0.2)
        )
        leg = bpy.context.active_object
        leg.name = f"Alien_Leg_{'L' if x_side < 0 else 'R'}"
    
    mod = head.modifiers.new(name="Subsurf", type='SUBSURF')
    mod.levels = ${subdivisions}
`;
  } else if (creature_type === "monster") {
    script += `    # Monster body (bulky)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=size * 0.7, location=(location[0], location[1], location[2] + size))
    body = bpy.context.active_object
    body.scale = (1.3, 1, 1.5)
    body.name = "Monster_Body"
    
    # Monster head
    bpy.ops.mesh.primitive_uv_sphere_add(radius=size * 0.45, location=(location[0], location[1], location[2] + size * 1.8))
    head = bpy.context.active_object
    head.scale = (1.2, 0.9, 0.9)
    head.name = "Monster_Head"
    
    # Monster horns
    for x_side in [-0.35, 0.35]:
        bpy.ops.mesh.primitive_cone_add(
            radius1=size * 0.12,
            radius2=0.01,
            depth=size * 0.6,
            location=(location[0], location[1] + x_side * size, location[2] + size * 2.3)
        )
        horn = bpy.context.active_object
        horn.rotation_euler[2] = math.radians(x_side * 30)
        horn.name = f"Monster_Horn_{'L' if x_side < 0 else 'R'}"
    
    # Monster eyes (glowing)
    for x_side in [-0.25, 0.25]:
        bpy.ops.mesh.primitive_uv_sphere_add(
            radius=size * 0.1,
            location=(location[0] + size * 0.35, location[1] + x_side * size, location[2] + size * 1.9)
        )
        eye = bpy.context.active_object
        eye.name = f"Monster_Eye_{'L' if x_side < 0 else 'R'}"
    
    # Monster mouth with teeth
    bpy.ops.mesh.primitive_cube_add(
        size=size * 0.3,
        location=(location[0] + size * 0.4, location[1], location[2] + size * 1.65)
    )
    mouth = bpy.context.active_object
    mouth.scale = (0.5, 1.5, 0.3)
    mouth.name = "Monster_Mouth"
    
    # Teeth
    for tooth in range(10):
        tooth_y = (tooth - 4.5) * size * 0.08
        bpy.ops.mesh.primitive_cone_add(
            radius1=size * 0.04,
            radius2=0.01,
            depth=size * 0.15,
            location=(location[0] + size * 0.55, location[1] + tooth_y, location[2] + size * 1.7)
        )
        tooth_obj = bpy.context.active_object
        tooth_obj.rotation_euler[1] = math.radians(90)
        tooth_obj.name = f"Monster_Tooth_{tooth}"
    
    # Monster muscular arms
    for x_side in [-1, 1]:
        bpy.ops.mesh.primitive_cylinder_add(
            radius=size * 0.25,
            depth=size * 0.9,
            location=(location[0], location[1] + x_side * size * 0.8, location[2] + size * 1.2)
        )
        arm = bpy.context.active_object
        arm.rotation_euler[2] = math.radians(x_side * 15)
        arm.name = f"Monster_Arm_{'L' if x_side < 0 else 'R'}"
        
        # Clawed hand
        bpy.ops.mesh.primitive_uv_sphere_add(
            radius=size * 0.2,
            location=(location[0] - size * 0.2, location[1] + x_side * size * 1.2, location[2] + size * 0.7)
        )
        hand = bpy.context.active_object
        hand.name = f"Monster_Hand_{'L' if x_side < 0 else 'R'}"
        
        # Claws
        for claw in range(3):
            claw_angle = (claw - 1) * 25
            bpy.ops.mesh.primitive_cone_add(
                radius1=size * 0.06,
                radius2=0.01,
                depth=size * 0.35,
                location=(location[0] - size * 0.4, location[1] + x_side * (size * 1.3 + claw * 0.08), location[2] + size * 0.65)
            )
            claw_obj = bpy.context.active_object
            claw_obj.rotation_euler[2] = math.radians(x_side * (15 + claw_angle))
            claw_obj.name = f"Monster_Claw_{'L' if x_side < 0 else 'R'}_{claw}"
    
    # Monster legs
    for x_side in [-0.4, 0.4]:
        bpy.ops.mesh.primitive_cylinder_add(
            radius=size * 0.22,
            depth=size * 1.2,
            location=(location[0], location[1] + x_side * size, location[2] + size * 0.3)
        )
        leg = bpy.context.active_object
        leg.name = f"Monster_Leg_{'L' if x_side < 0 else 'R'}"
    
    mod = body.modifiers.new(name="Subsurf", type='SUBSURF')
    mod.levels = ${subdivisions}
`;
  } else if (creature_type === "serpent") {
    script += `    # Serpent head
    bpy.ops.mesh.primitive_uv_sphere_add(radius=size * 0.35, location=(location[0], location[1], location[2] + size * 0.8))
    head = bpy.context.active_object
    head.scale = (1.3, 0.8, 0.9)
    head.name = "Serpent_Head"
    
    # Serpent eyes
    for x_side in [-0.25, 0.25]:
        bpy.ops.mesh.primitive_uv_sphere_add(
            radius=size * 0.08,
            location=(location[0] + size * 0.35, location[1] + x_side * size * 0.5, location[2] + size * 0.9)
        )
        eye = bpy.context.active_object
        eye.name = f"Serpent_Eye_{'L' if x_side < 0 else 'R'}"
    
    # Serpent fangs
    for x_side in [-0.15, 0.15]:
        bpy.ops.mesh.primitive_cone_add(
            radius1=size * 0.05,
            radius2=0.01,
            depth=size * 0.25,
            location=(location[0] + size * 0.4, location[1] + x_side * size * 0.5, location[2] + size * 0.65)
        )
        fang = bpy.context.active_object
        fang.rotation_euler[1] = math.radians(90)
        fang.name = f"Serpent_Fang_{'L' if x_side < 0 else 'R'}"
    
    # Serpent body (coiled segments)
    num_segments = 15
    for i in range(num_segments):
        angle = i * 0.6
        radius_offset = size * (1.5 - i * 0.05)
        segment_size = size * (0.3 - i * 0.015)
        
        x_pos = location[0] + math.cos(angle) * radius_offset - i * size * 0.1
        y_pos = location[1] + math.sin(angle) * radius_offset
        z_pos = location[2] + size * 0.5 - i * size * 0.08
        
        bpy.ops.mesh.primitive_uv_sphere_add(
            radius=segment_size,
            location=(x_pos, y_pos, z_pos)
        )
        segment = bpy.context.active_object
        segment.scale = (1.5, 1, 1)
        segment.name = f"Serpent_Body_Seg_{i}"
    
    mod = head.modifiers.new(name="Subsurf", type='SUBSURF')
    mod.levels = ${subdivisions}
`;
  } else if (creature_type === "bird") {
    script += `    # Bird body
    bpy.ops.mesh.primitive_uv_sphere_add(radius=size * 0.4, location=(location[0], location[1], location[2] + size * 0.6))
    body = bpy.context.active_object
    body.scale = (1.2, 0.9, 1.3)
    body.name = "Bird_Body"
    
    # Bird head
    bpy.ops.mesh.primitive_uv_sphere_add(radius=size * 0.25, location=(location[0] + size * 0.4, location[1], location[2] + size * 1))
    head = bpy.context.active_object
    head.scale = (1.1, 0.9, 0.95)
    head.name = "Bird_Head"
    
    # Bird beak
    bpy.ops.mesh.primitive_cone_add(
        radius1=size * 0.12,
        radius2=0.01,
        depth=size * 0.35,
        location=(location[0] + size * 0.65, location[1], location[2] + size * 0.95)
    )
    beak = bpy.context.active_object
    beak.rotation_euler[1] = math.radians(90)
    beak.name = "Bird_Beak"
    
    # Bird eyes
    for x_side in [-0.15, 0.15]:
        bpy.ops.mesh.primitive_uv_sphere_add(
            radius=size * 0.06,
            location=(location[0] + size * 0.48, location[1] + x_side * size, location[2] + size * 1.05)
        )
        eye = bpy.context.active_object
        eye.name = f"Bird_Eye_{'L' if x_side < 0 else 'R'}"
    
    # Bird wings
    for x_side in [-1, 1]:
        # Wing base
        bpy.ops.mesh.primitive_cube_add(
            size=size * 0.3,
            location=(location[0] - size * 0.1, location[1] + x_side * size * 0.5, location[2] + size * 0.8)
        )
        wing_base = bpy.context.active_object
        wing_base.scale = (0.3, 1, 0.7)
        wing_base.name = f"Bird_Wing_Base_{'L' if x_side < 0 else 'R'}"
        
        # Wing feathers
        bpy.ops.mesh.primitive_cube_add(
            size=size * 0.6,
            location=(location[0] - size * 0.3, location[1] + x_side * size * 1.2, location[2] + size * 0.8)
        )
        wing_feathers = bpy.context.active_object
        wing_feathers.scale = (0.05, 1.5, 1)
        wing_feathers.rotation_euler[2] = math.radians(x_side * 15)
        wing_feathers.name = f"Bird_Wing_{'L' if x_side < 0 else 'R'}"
    
    # Bird tail
    bpy.ops.mesh.primitive_cube_add(
        size=size * 0.5,
        location=(location[0] - size * 0.6, location[1], location[2] + size * 0.5)
    )
    tail = bpy.context.active_object
    tail.scale = (0.05, 0.8, 1.2)
    tail.rotation_euler[1] = math.radians(-20)
    tail.name = "Bird_Tail"
    
    # Bird legs
    for x_side in [-0.2, 0.2]:
        bpy.ops.mesh.primitive_cylinder_add(
            radius=size * 0.05,
            depth=size * 0.5,
            location=(location[0], location[1] + x_side * size, location[2] + size * 0.15)
        )
        leg = bpy.context.active_object
        leg.name = f"Bird_Leg_{'L' if x_side < 0 else 'R'}"
        
        # Feet
        for toe in range(3):
            toe_angle = (toe - 1) * 40
            bpy.ops.mesh.primitive_cylinder_add(
                radius=size * 0.02,
                depth=size * 0.15,
                location=(location[0] + size * 0.08, location[1] + x_side * size + toe * 0.05, location[2] - size * 0.1)
            )
            toe_obj = bpy.context.active_object
            toe_obj.rotation_euler[2] = math.radians(toe_angle)
            toe_obj.name = f"Bird_Toe_{'L' if x_side < 0 else 'R'}_{toe}"
    
    mod = body.modifiers.new(name="Subsurf", type='SUBSURF')
    mod.levels = ${subdivisions}
`;
  } else if (creature_type === "fish") {
    script += `    # Fish body
    bpy.ops.mesh.primitive_uv_sphere_add(radius=size * 0.5, location=(location[0], location[1], location[2] + size * 0.5))
    body = bpy.context.active_object
    body.scale = (2, 0.8, 0.9)
    body.name = "Fish_Body"
    
    # Fish head
    bpy.ops.mesh.primitive_uv_sphere_add(radius=size * 0.35, location=(location[0] + size * 0.8, location[1], location[2] + size * 0.5))
    head = bpy.context.active_object
    head.scale = (1, 0.85, 0.9)
    head.name = "Fish_Head"
    
    # Fish eyes
    for x_side in [-0.25, 0.25]:
        bpy.ops.mesh.primitive_uv_sphere_add(
            radius=size * 0.08,
            location=(location[0] + size * 1, location[1] + x_side * size, location[2] + size * 0.6)
        )
        eye = bpy.context.active_object
        eye.name = f"Fish_Eye_{'L' if x_side < 0 else 'R'}"
    
    # Fish mouth
    bpy.ops.mesh.primitive_torus_add(
        major_radius=size * 0.15,
        minor_radius=size * 0.05,
        location=(location[0] + size * 1.1, location[1], location[2] + size * 0.45)
    )
    mouth = bpy.context.active_object
    mouth.rotation_euler[0] = math.radians(90)
    mouth.scale = (1, 0.5, 1)
    mouth.name = "Fish_Mouth"
    
    # Fish dorsal fin
    bpy.ops.mesh.primitive_cube_add(
        size=size * 0.6,
        location=(location[0], location[1], location[2] + size * 1.2)
    )
    dorsal_fin = bpy.context.active_object
    dorsal_fin.scale = (1, 0.05, 1.2)
    dorsal_fin.rotation_euler[0] = math.radians(10)
    dorsal_fin.name = "Fish_Dorsal_Fin"
    
    # Fish pectoral fins
    for x_side in [-1, 1]:
        bpy.ops.mesh.primitive_cube_add(
            size=size * 0.4,
            location=(location[0] + size * 0.3, location[1] + x_side * size * 0.6, location[2] + size * 0.4)
        )
        pec_fin = bpy.context.active_object
        pec_fin.scale = (0.05, 1.5, 0.8)
        pec_fin.rotation_euler[2] = math.radians(x_side * 45)
        pec_fin.name = f"Fish_Pectoral_Fin_{'L' if x_side < 0 else 'R'}"
    
    # Fish tail
    bpy.ops.mesh.primitive_cube_add(
        size=size * 0.7,
        location=(location[0] - size * 1.1, location[1], location[2] + size * 0.5)
    )
    tail = bpy.context.active_object
    tail.scale = (0.05, 1.2, 1.5)
    tail.rotation_euler[2] = math.radians(10)
    tail.name = "Fish_Tail"
    
    # Fish scales texture through subdivision
    mod = body.modifiers.new(name="Subsurf", type='SUBSURF')
    mod.levels = ${subdivisions}
`;
  }

  script += `
create_${creature_type}((${location.join(", ")}), ${size}, "${detail_level}")
print(f"Created ${creature_type} with size {size} and {detail_level} detail")
`;

  return script;
}

function generateTextureScript(object_name, texture_type, color) {
  const textures = {
    wood: { base_color: [0.4, 0.25, 0.1, 1], roughness: 0.8, metallic: 0 },
    metal: { base_color: [0.7, 0.7, 0.7, 1], roughness: 0.2, metallic: 1 },
    stone: { base_color: [0.5, 0.5, 0.5, 1], roughness: 0.9, metallic: 0 },
    brick: { base_color: [0.6, 0.2, 0.1, 1], roughness: 0.85, metallic: 0 },
    glass: { base_color: [1, 1, 1, 1], roughness: 0.0, metallic: 0, transmission: 0.95 },
    plastic: { base_color: [0.8, 0.8, 0.8, 1], roughness: 0.3, metallic: 0 },
    fabric: { base_color: [0.3, 0.3, 0.5, 1], roughness: 0.95, metallic: 0 },
    skin: { base_color: [0.9, 0.7, 0.6, 1], roughness: 0.4, metallic: 0, subsurface: 0.1 }
  };

  const texture = textures[texture_type] || textures.plastic;

  return `import bpy

# Get the object
obj = bpy.data.objects.get("${object_name}")

if obj is None:
    print(f"Error: Object '${object_name}' not found")
else:
    # Create material
    mat = bpy.data.materials.new(name="${texture_type}_Material")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    
    # Clear default nodes
    nodes.clear()
    
    # Create nodes
    output = nodes.new(type='ShaderNodeOutputMaterial')
    bsdf = nodes.new(type='ShaderNodeBsdfPrincipled')
    
    # Set material properties
    bsdf.inputs["Base Color"].default_value = (${texture.base_color.join(", ")})
    bsdf.inputs["Roughness"].default_value = ${texture.roughness}
    bsdf.inputs["Metallic"].default_value = ${texture.metallic}
    ${texture.transmission ? `bsdf.inputs["Transmission"].default_value = ${texture.transmission}` : ''}
    ${texture.subsurface ? `bsdf.inputs["Subsurface"].default_value = ${texture.subsurface}` : ''}
    
    # Link nodes
    mat.node_tree.links.new(bsdf.outputs["BSDF"], output.inputs["Surface"])
    
    # Assign material to object
    if obj.data.materials:
        obj.data.materials[0] = mat
    else:
        obj.data.materials.append(mat)
    
    print(f"Applied ${texture_type} texture to ${object_name}")
`;
}

function analyzePrompt(prompt) {
  const lowercasePrompt = prompt.toLowerCase();
  let description = "";
  let components = [];

  // Analyze for human body parts
  if (lowercasePrompt.includes("person") || lowercasePrompt.includes("human") || lowercasePrompt.includes("body") || lowercasePrompt.includes("persona")) {
    description += "Generating a human figure. Detected components: ";
    
    if (lowercasePrompt.includes("head") || lowercasePrompt.includes("cabeza")) {
      components.push({ type: "human_part", part: "head", location: [0, 0, 6.5] });
      description += "head, ";
    }
    
    if (lowercasePrompt.includes("arm") || lowercasePrompt.includes("brazo") || lowercasePrompt.includes("brazos")) {
      const count = lowercasePrompt.includes("two") || lowercasePrompt.includes("dos") ? 2 : 1;
      for (let i = 0; i < count; i++) {
        components.push({ 
          type: "human_part", 
          part: "arm", 
          location: [i === 0 ? -1.2 : 1.2, 0, 4.5] 
        });
      }
      description += `${count} arm(s), `;
    }
    
    if (lowercasePrompt.includes("hand") || lowercasePrompt.includes("mano")) {
      const count = lowercasePrompt.includes("two") || lowercasePrompt.includes("dos") ? 2 : 1;
      for (let i = 0; i < count; i++) {
        components.push({ 
          type: "human_part", 
          part: "hand", 
          location: [i === 0 ? -1.2 : 1.2, 0, 2.5] 
        });
      }
      description += `${count} hand(s), `;
    }
    
    if (lowercasePrompt.includes("leg") || lowercasePrompt.includes("pierna")) {
      const count = lowercasePrompt.includes("two") || lowercasePrompt.includes("dos") ? 2 : 1;
      for (let i = 0; i < count; i++) {
        components.push({ 
          type: "human_part", 
          part: "leg", 
          location: [i === 0 ? -0.4 : 0.4, 0, 1.5] 
        });
      }
      description += `${count} leg(s), `;
    }
    
    if (lowercasePrompt.includes("foot") || lowercasePrompt.includes("feet") || lowercasePrompt.includes("pie") || lowercasePrompt.includes("pies")) {
      const count = lowercasePrompt.includes("two") || lowercasePrompt.includes("dos") ? 2 : 1;
      for (let i = 0; i < count; i++) {
        components.push({ 
          type: "human_part", 
          part: "foot", 
          location: [i === 0 ? -0.4 : 0.4, 0.15, -0.3] 
        });
      }
      description += `${count} foot/feet, `;
    }
    
    if (lowercasePrompt.includes("torso") || lowercasePrompt.includes("body") || lowercasePrompt.includes("cuerpo")) {
      components.push({ type: "human_part", part: "torso", location: [0, 0, 4] });
      description += "torso, ";
    }
    
    // If comprehensive person description, use full_body
    if (components.length >= 4 || lowercasePrompt.includes("complete") || lowercasePrompt.includes("full") || lowercasePrompt.includes("completa")) {
      components = [{ type: "human_part", part: "full_body", location: [0, 0, 0] }];
      description = "Generating a complete human body with all parts";
    }
  }
  
  // Analyze for buildings
  if (lowercasePrompt.includes("house") || lowercasePrompt.includes("casa")) {
    components.push({ type: "building", building_type: "house", floors: 1, location: [0, 0, 0] });
    description += "house, ";
  }
  
  if (lowercasePrompt.includes("building") || lowercasePrompt.includes("edificio")) {
    const floors = parseInt(lowercasePrompt.match(/(\d+)\s*(floor|story|piso)/)?.[1]) || 3;
    components.push({ type: "building", building_type: "building", floors, location: [0, 0, 0] });
    description += `${floors}-story building, `;
  }
  
  if (lowercasePrompt.includes("church") || lowercasePrompt.includes("iglesia")) {
    components.push({ type: "building", building_type: "church", floors: 1, location: [0, 0, 0] });
    description += "church, ";
  }
  
  // Analyze for creatures and monsters
  const creatureKeywords = {
    dragon: ["dragon", "dragón"],
    spider: ["spider", "araña"],
    octopus: ["octopus", "pulpo", "octopodo"],
    alien: ["alien", "extraterrestre", "alienígena"],
    monster: ["monster", "monstruo", "bestia", "beast"],
    serpent: ["serpent", "snake", "serpiente", "víbora"],
    bird: ["bird", "ave", "pájaro"],
    fish: ["fish", "pez"]
  };
  
  for (const [creatureType, keywords] of Object.entries(creatureKeywords)) {
    if (keywords.some(keyword => lowercasePrompt.includes(keyword))) {
      const sizeMatch = lowercasePrompt.match(/size\s+(\d+\.?\d*)/i);
      const size = sizeMatch ? parseFloat(sizeMatch[1]) : 2.0;
      components.push({ type: "creature", creature_type: creatureType, size, location: [0, 0, 0] });
      description += `${creatureType}, `;
      break; // Only one creature type per prompt to avoid conflicts
    }
  }
  
  // Analyze for geometric shapes
  const shapes = ["cube", "sphere", "cylinder", "cone", "torus"];
  shapes.forEach(shape => {
    if (lowercasePrompt.includes(shape)) {
      components.push({ type: "shape", shape_type: shape, size: 2, location: [0, 0, 0] });
      description += `${shape}, `;
    }
  });
  
  return {
    description: description || "Generating objects based on prompt",
    components
  };
}

function generateFromAnalysis(analysis, detail_level) {
  let script = `import bpy
import math

# Clear scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# Generated from prompt analysis
# ${analysis.description}

`;

  analysis.components.forEach((component, index) => {
    if (component.type === "human_part") {
      script += `# Component ${index + 1}: ${component.part}\n`;
      script += generateHumanPartScript(component.part, detail_level, component.location);
      script += "\n";
    } else if (component.type === "building") {
      script += `# Component ${index + 1}: ${component.building_type}\n`;
      script += generateBuildingScript(component.building_type, component.floors, "modern", component.location);
      script += "\n";
    } else if (component.type === "creature") {
      script += `# Component ${index + 1}: ${component.creature_type}\n`;
      script += generateCreatureScript(component.creature_type, component.size, detail_level, component.location);
      script += "\n";
    } else if (component.type === "shape") {
      script += `# Component ${index + 1}: ${component.shape_type}\n`;
      script += generateGeometricShapeScript(component.shape_type, component.size, component.location, "gray");
      script += "\n";
    }
  });

  return script;
}

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Blender MCP Server running on stdio");
}

main();
