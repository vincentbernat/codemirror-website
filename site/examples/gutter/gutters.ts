//!emptyLineGutter

import {EditorView, gutter, GutterMarker} from "@codemirror/view"

const emptyMarker = new class extends GutterMarker {
  toDOM() { return document.createTextNode("ø") }
}

const emptyLineGutter = gutter({
  lineMarker(view, line) {
    return line.from == line.to ? emptyMarker : null
  },
  initialSpacer: () => emptyMarker
})

//!breakpointState

import {StateField, StateEffect, RangeSet} from "@codemirror/state"

const breakpointEffect = StateEffect.define<{pos: number, on: boolean}>({
  map: (val, mapping) => ({pos: mapping.mapPos(val.pos), on: val.on})
})

const breakpointState = StateField.define<RangeSet<GutterMarker>>({
  create() { return RangeSet.empty },
  update(set, transaction) {
    set = set.map(transaction.changes)
    for (let e of transaction.effects) {
      if (e.is(breakpointEffect)) {
        if (e.value.on)
          set = set.update({add: [breakpointMarker.range(e.value.pos)]})
        else
          set = set.update({filter: from => from != e.value.pos})
      }
    }
    return set
  }
})

function toggleBreakpoint(view: EditorView, pos: number) {
  let breakpoints = view.state.field(breakpointState)
  let hasBreakpoint = false
  breakpoints.between(pos, pos, () => {hasBreakpoint = true})
  view.dispatch({
    effects: breakpointEffect.of({pos, on: !hasBreakpoint})
  })
}

//!breakpointGutter

const breakpointMarker = new class extends GutterMarker {
  toDOM() { return document.createTextNode("💔") }
}

const breakpointGutter = [
  breakpointState,
  gutter({
    class: "cm-breakpoint-gutter",
    markers: v => v.state.field(breakpointState),
    initialSpacer: () => breakpointMarker,
    domEventHandlers: {
      mousedown(view, line) {
        toggleBreakpoint(view, line.from)
        return true
      }
    }
  }),
  EditorView.baseTheme({
    ".cm-breakpoint-gutter .cm-gutterElement": {
      color: "red",
      paddingLeft: "5px",
      cursor: "default"
    }
  })
]

//!show

import {EditorState, basicSetup} from "@codemirror/basic-setup"
import {lineNumbers} from "@codemirror/view"

new EditorView({
  state: EditorState.create({
    doc: "Some\ntext\nwith\n\nblank\n\nlines\n.\n",
    extensions: [breakpointGutter, basicSetup, emptyLineGutter]
  }),
  parent: document.querySelector("#editor")
})

