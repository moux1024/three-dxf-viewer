# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server on http://localhost:9009 (vanilla JS example)
- `npm run devr` - Start React development server with Vite
- `npm run devv` - Start Vue development server with Vite  
- `npm run build` - Build production version using Vite
- `npm run page` - Build documentation page
- `npm run docs` - Generate JSDoc documentation in `/api` folder
- `npm run lint` - Run ESLint with auto-fix

## Project Architecture

### Core Library Structure
The project is a DXF viewer library built on Three.js that parses DXF files and renders them as 3D scenes.

**Main Entry Point**: `main.js` exports the core classes:
- `DXFViewer` - Main class for parsing DXF files and creating Three.js objects
- `Merger` - Utility for merging geometries to optimize performance
- `SnapsHelper` - Vertex snapping functionality
- `Hover` - Mouse hover highlighting
- `Select` - Entity selection with click/box selection
- `UNITS` - DXF unit system constants

**Core DXF Processing Flow** (`src/dxfViewer.js`):
1. Load font file for text rendering
2. Parse DXF using `dxf` library helper
3. Process layers and extract metadata (units, layers)
4. Create entity-specific renderers for each DXF entity type
5. Generate Three.js geometries and materials
6. Apply viewport transformations

### Entity System
Each DXF entity type has its own renderer in `src/entities/`:
- `lineEntity.js` - Lines and polylines
- `circleEntity.js` - Circles and arcs  
- `textEntity.js` - Text rendering with font support
- `dimensionEntity.js` - Dimension annotations
- `insertEntity.js` - Block references/instances
- `splineEntity.js` - Spline curves
- `solidEntity.js` - Filled polygons
- `hatchEntity.js` - Hatch patterns
- `blockEntity.js` - Block definitions

All entities inherit from `baseEntity/baseEntity.js` which provides:
- Layer management (`layerHelper.js`)
- Color handling (`colorHelper.js`) 
- Geometry caching (`baseCache.js`)
- Material properties (`properties.js`)

### Utility Classes
Located in `src/utils/`:
- `merger.js` - Combines geometries for performance
- `select.js` - Entity selection with raycasting
- `hover.js` - Hover highlighting
- `snapsHelper.js` - Vertex snapping for CAD-like interaction

### Build Configuration
Multiple Vite configurations for different use cases:
- `vite.prod.config.js` - Production library build
- `vite.dev.config.js` - Vanilla JS development
- `vite.dev.react.config.js` - React development setup
- `vite.dev.vue.config.js` - Vue development setup
- `vite.page.config.js` - Documentation page build

## Code Style
ESLint configuration in `eslint.config.js` enforces:
- Tab indentation
- Single quotes
- Windows line endings
- Spaces inside parentheses, brackets, and braces
- React JSX rules for React examples

## Key Dependencies
- `three` - 3D rendering engine
- `dxf` - DXF file parsing library
- Font files required for text rendering (typically `.typeface.json` format)

## Caching System
The viewer implements geometry caching via `Properties.cache` to optimize performance when loading the same DXF files repeatedly. This can be disabled by setting `viewer.useCache = false`.