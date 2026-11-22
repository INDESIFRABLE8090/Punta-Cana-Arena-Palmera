import bpy, math, sys, os
argv = sys.argv[sys.argv.index('--')+1:]
OUT, W, H, FR0, FR1, SAMPLES = argv[0], int(argv[1]), int(argv[2]), int(argv[3]), int(argv[4]), int(argv[5])
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.engine = 'CYCLES'
cy = sc.cycles
cy.device = 'CPU'; cy.samples = SAMPLES; cy.use_denoising = False
cy.max_bounces = 4; cy.glossy_bounces = 3; cy.diffuse_bounces = 1; cy.transmission_bounces = 2
cy.use_adaptive_sampling = True; cy.adaptive_threshold = 0.03
sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage = W, H, 100
sc.render.fps = 24; sc.frame_start, sc.frame_end = FR0, FR1
sc.render.image_settings.file_format = 'PNG'; sc.render.image_settings.color_mode = 'RGB'; sc.render.image_settings.compression = 15
sc.render.filepath = OUT
sc.view_settings.view_transform = 'Filmic'
sc.view_settings.look = 'High Contrast'; sc.view_settings.exposure = -0.5

# ---- Cielo: atardecer rosado con degradado propio + sol con halo ----
w = bpy.data.worlds.new('W'); sc.world = w; w.use_nodes = True
nt = w.node_tree; nt.nodes.clear()
N = nt.nodes; L = nt.links
tc = N.new('ShaderNodeTexCoord')
norm = N.new('ShaderNodeVectorMath'); norm.operation = 'NORMALIZE'
L.new(tc.outputs['Generated'], norm.inputs[0])
sep = N.new('ShaderNodeSeparateXYZ'); L.new(norm.outputs[0], sep.inputs[0])
ramp = N.new('ShaderNodeValToRGB'); L.new(sep.outputs['Z'], ramp.inputs['Fac'])
cr = ramp.color_ramp; cr.interpolation = 'EASE'
cr.elements[0].position = 0.0; cr.elements[0].color = (1.0, 0.52, 0.20, 1)
cr.elements[1].position = 1.0; cr.elements[1].color = (0.10, 0.14, 0.42, 1)
for pos, col in [(0.05, (1.0, 0.36, 0.32, 1)), (0.17, (0.92, 0.24, 0.46, 1)), (0.42, (0.50, 0.20, 0.58, 1)), (0.7, (0.22, 0.20, 0.55, 1))]:
    e = cr.elements.new(pos); e.color = col
sunv = (math.sin(math.radians(5)) * math.cos(math.radians(2.6)), math.cos(math.radians(5)) * math.cos(math.radians(2.6)), math.sin(math.radians(2.6)))
dot = N.new('ShaderNodeVectorMath'); dot.operation = 'DOT_PRODUCT'; dot.inputs[1].default_value = sunv
L.new(norm.outputs[0], dot.inputs[0])
cl = N.new('ShaderNodeMath'); cl.operation = 'MAXIMUM'; cl.inputs[1].default_value = 0.0; L.new(dot.outputs['Value'], cl.inputs[0])
def powr(n, k, mul):
    a = N.new('ShaderNodeMath'); a.operation = 'POWER'; a.inputs[1].default_value = k; L.new(cl.outputs[0], a.inputs[0])
    b2 = N.new('ShaderNodeMath'); b2.operation = 'MULTIPLY'; b2.inputs[1].default_value = mul; L.new(a.outputs[0], b2.inputs[0]); return b2
halo = powr('h', 40, 0.9); core = powr('c', 9000, 40.0)
glow = N.new('ShaderNodeMath'); glow.operation = 'ADD'; L.new(halo.outputs[0], glow.inputs[0]); L.new(core.outputs[0], glow.inputs[1])
gcol = N.new('ShaderNodeMix'); gcol.data_type = 'RGBA'; gcol.blend_type = 'ADD'; gcol.inputs['Factor'].default_value = 1.0
tint = N.new('ShaderNodeMix'); tint.data_type = 'RGBA'; tint.blend_type = 'MULTIPLY'; tint.inputs['Factor'].default_value = 1.0
tint.inputs[6].default_value = (1.0, 0.62, 0.34, 1); L.new(glow.outputs[0], tint.inputs[7])
L.new(ramp.outputs['Color'], gcol.inputs[6]); L.new(tint.outputs[2], gcol.inputs[7])
bg = N.new('ShaderNodeBackground'); bg.inputs['Strength'].default_value = 1.15
out = N.new('ShaderNodeOutputWorld'); L.new(gcol.outputs[2], bg.inputs['Color']); L.new(bg.outputs[0], out.inputs[0])

# ---- Océano ----
bpy.ops.mesh.primitive_grid_add(x_subdivisions=8, y_subdivisions=8, size=900, location=(0,0,0))
sea = bpy.context.object; sea.name = 'Sea'; sea.location = (-480, -480, 0)
om = sea.modifiers.new('Ocean', 'OCEAN')
om.geometry_mode = 'GENERATE'; om.resolution = 10; om.spatial_size = 80
om.wave_scale = 1.15; om.wave_scale_min = 0.02; om.choppiness = 1.4; om.wind_velocity = 14; om.damping = 0.6
om.wave_alignment = 0.7; om.depth = 200; om.random_seed = 7
om.repeat_x = 12; om.repeat_y = 12
om.time = 0.0; om.keyframe_insert('time', frame=FR0 if False else 1)
om.time = 12.0; om.keyframe_insert('time', frame=240)
for fc in sea.animation_data.action.fcurves:
    for k in fc.keyframe_points: k.interpolation = 'LINEAR'
m = bpy.data.materials.new('Water'); m.use_nodes = True
b = m.node_tree.nodes['Principled BSDF']
b.inputs['Base Color'].default_value = (0.0, 0.42, 0.46, 1)
b.inputs['Roughness'].default_value = 0.05
b.inputs['Emission Color'].default_value = (0.0, 0.62, 0.66, 1)
b.inputs['Emission Strength'].default_value = 0.55
b.inputs['IOR'].default_value = 1.33
try: b.inputs['Transmission Weight'].default_value = 0.0
except Exception: pass
try: b.inputs['Specular IOR Level'].default_value = 0.8
except Exception: pass
sea.data.materials.append(m)

# ---- Cámara ----
cam = bpy.data.cameras.new('C'); cam.lens = 30 if W >= H else 26; cam.sensor_width = 36
co = bpy.data.objects.new('Cam', cam); sc.collection.objects.link(co); sc.camera = co
co.location = (0, -60, 1.35); co.rotation_euler = (math.radians(88.1), 0, 0)
co.keyframe_insert('location', frame=1); co.location = (1.2, -60 + 0, 1.5); co.keyframe_insert('location', frame=240)
sc.collection.objects.link(sea) if sea.name not in sc.collection.objects else None
bpy.ops.render.render(write_still=(FR0==FR1), animation=(FR0!=FR1))
