# CLAUDE.md

## Project: Sargam Transposer

A React + TypeScript frontend app for transposing Sargam (Indian classical music) notation for bansuri.

## Commands

```bash
npm run dev        # Start development server
npm run build      # Production build
npm test           # Run tests once
npm run test:watch # Run tests in watch mode
npx tsc --noEmit   # Type check
```

## Architecture

```
src/
├── core/           # Core transposition logic
│   ├── types.ts    # Note enum, StandardizedNote, ValidationError
│   ├── transpose.ts # Transpose by semitones with octave wrapping
│   └── validate.ts  # Bansuri range validation (configurable)
├── parsers/        # Notation parsers (one per website format)
│   ├── parser.types.ts      # Parser interface, ParsedLine discriminated union
│   └── genericDotsParser.ts # Handles "S..G..M.." style notation
└── components/     # React UI components
```

## Key Concepts

1. **Parser Layer**: Each parser handles a specific notation format. Edit `NOTE_MAPPING` in parser files to change how tokens are recognized.

2. **Core Operator**: Uses internal `Note` enum (12 semitones). Parsers convert to/from this format.

3. **Validation**: `BANSURI_RANGE` in `validate.ts` defines allowed notes per octave. Not baked into logic—edit to change limits.

## Note Mappings (genericDotsParser)

| Input | Meaning |
|-------|---------|
| `p`, `d`, `n` | Low octave Pa, Dha, Ni |
| `S`, `R`, `G`, `P`, `D`, `N` | Middle octave shudh |
| `m` | Shudh Ma |
| `M` | Tivra Ma |
| `X(k)` | Komal notes (e.g., `D(k)`, `G(k)`) |
| `X'` | Upper octave (e.g., `S'`, `R'`) |

## Adding a New Parser

1. Create `src/parsers/newParser.ts`
2. Implement `Parser` interface from `parser.types.ts`
3. Define your own `NOTE_MAPPING` for input recognition
4. Export from `src/parsers/index.ts`
