import trimesh
import numpy as np

width = 1.0
thickness = 0.04
length = 1.7

# Base frame
frame = trimesh.creation.box(extents=(width, thickness, length))
for f in frame.visual.face_colors:
    f[:] = [192, 192, 192, 255] # Silver frame

# Solar cells
cells = trimesh.creation.box(extents=(width - 0.06, thickness, length - 0.06))
for f in cells.visual.face_colors:
    f[:] = [15, 25, 45, 255] # Dark blue/black cells

cells.apply_translation([0, 0.005, 0])

panel = trimesh.util.concatenate([frame, cells])
panel.export("public/solar_panel.glb")
print("GLB generated!")
