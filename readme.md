# Playing Cards



## Honour Card SVG formatting

Each honour card needs to be formatted in a specific way for the svg.js to extract the correct information, i have been using inkscape to edit any files with the following process

All Clones are first unlinked (this allows direct editing of the paths). Edit -> Clone -> Unlink Clone or Shift + Alt + D

Then some paths are merged together (for example groups of the same paths in different locations), this is done using Path -> Combine or Ctrl + K while all layers are selected

All paths are then transformed to remove the matrix transform, this is done using https://github.com/Klowner/inkscape-applytransforms

Paths are then manually simplified or split into different layers as needed, this is done by just duplicating the path and removing any points not needed.

All these paths are then named `layer-#` with the following being the coloring standard

| #  | Purpose   |
|----|-----------|
| 0  | Rotate    |
| 1  | Yellow    |
| 2  | Yellow    |
| 3  | Yellow    |
| 4  | Red       |
| 5  | Red       |
| 6  | Red       |
| 7  | Blue      |
| 8  | Blue      |
| 9  | Blue      |
| 10 | Black     |
| 11 | Black     |
| 12 | Black     |
| 13 | Blue Trim |
| 14 | Blue Trim |
| 15 | Blue Trim |

Layer 0 is optional and defaults to the center of all paths

All svg files should be pushed with all layers visible