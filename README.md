# EmbedPDF: a Scrollbar thumb drag also pans the Stage

Live demo: https://lazycompiler.github.io/embedpdf-scrollbar-drag-demo/

A minimal reproduction for [embedpdf/embed-pdf-viewer#1137](https://github.com/embedpdf/embed-pdf-viewer/pull/1137), built on the published `@embedpdf/react` and `@embedpdf/engine` 3.3.0 with only the stage and render plugins.

## The bug

1. Press the scrollbar thumb on the right edge of the viewer.
2. Drag it down, past the bottom of the viewer, and keep going.
3. Once the thumb stops at the end of its track, the page scrolls back up, following the pointer. The readout above the viewer turns red.

While the thumb is still inside its track, the view also scrolls a little less than the thumb asks for, so it never reaches the end of the document.

## Why

The `<Stage>` listens for `pointerdown` natively on an ancestor of the `<Scrollbar>`. React dispatches the bar's own `onPointerDown` from its root, after the Stage has already seen the press and begun a pan with it, so both follow the same pointer.

## Run it locally

```sh
cd source
pnpm install
pnpm dev
```

`sample.pdf` is a plain five-page file generated for this demo.
