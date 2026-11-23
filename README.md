# EmbedPDF: a Scrollbar thumb drag also pans the Stage

- **The bug**, on the published 3.3.0: https://lazycompiler.github.io/embedpdf-scrollbar-drag-demo/
- **With the fix**: https://lazycompiler.github.io/embedpdf-scrollbar-drag-demo/fixed/

A minimal reproduction for [embedpdf/embed-pdf-viewer#1137](https://github.com/embedpdf/embed-pdf-viewer/pull/1137). Both pages are the same code with only the stage and render plugins; they differ in the packages they are built on.

## The bug

1. Press the scrollbar thumb on the right edge of the viewer.
2. Drag it down, past the bottom of the viewer, and keep going.
3. Once the thumb stops at the end of its track, the page scrolls back up, following the pointer. The readout above the viewer turns red.

While the thumb is still inside its track, the view also scrolls a little less than the thumb asks for, so it never reaches the end of the document.

## Why

The `<Stage>` listens for `pointerdown` natively on an ancestor of the `<Scrollbar>`. React dispatches the bar's own `onPointerDown` from its root, after the Stage has already seen the press and begun a pan with it, so both follow the same pointer.

## The two builds

| | Page | Packages |
| --- | --- | --- |
| `source/` | the bug | `@embedpdf/react` and `@embedpdf/engine` 3.3.0 from npm |
| `source-fixed/` | with the fix | `@embedpdf/react` and `@embedpdf/web` built from the pull request's branch at `15143837c` (`pnpm --filter @embedpdf/web --filter @embedpdf/react build`, then `pnpm pack`), kept in `source-fixed/packages/`; everything else 3.3.0 from npm |

`source-fixed/` holds no code of its own: `pnpm sync` copies `source/src` into it before each build. The packed packages are Apache-2.0, as in the upstream repository.

## Run it locally

```sh
cd source        # or source-fixed
pnpm install
pnpm dev
```

`sample.pdf` is a plain five-page file generated for this demo.
