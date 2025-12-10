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
        name: "generate_from_prompt",
        description: "Generate 3D objects from natural language descriptions. The AI will parse the prompt and create appropriate geometry.",
        inputSchema: {
          type: "object",
          properties: {
            prompt: {
              type: "string",
              description: "Natural language description of what to create (e.g., 'a person with a head, two arms, two legs')"
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
print(f"Created ${building_type} with {${floors}} floors")
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
print(f"Created ${body_part} with ${detail_level} detail")
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
