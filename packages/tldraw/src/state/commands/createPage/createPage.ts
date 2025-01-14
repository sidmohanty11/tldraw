import type { TldrawCommand, TDPage } from '~types'
import { Utils, TLPageState } from '@tldraw/core'
import type { TldrawApp } from '~state'

export function createPage(
  app: TldrawApp,
  center: number[],
  pageId = Utils.uniqueId(),
  pageName = 'New page'
): TldrawCommand {
  const { currentPageId } = app

  const pages = Object.values(app.state.document.pages).sort(
    (a, b) => (a.childIndex ?? 0) - (b.childIndex ?? 0)
  )

  const topPage = pages[pages.length - 1]

  const nextChildIndex = topPage?.childIndex ? topPage?.childIndex + 1 : 1

  const page: TDPage = {
    id: pageId,
    name: Utils.getIncrementedName(
      pageName,
      pages.map((p) => p.name ?? '')
    ),
    childIndex: nextChildIndex,
    shapes: {},
    bindings: {},
  }

  const pageState: TLPageState = {
    id: pageId,
    selectedIds: [],
    camera: { point: center, zoom: 1 },
    editingId: undefined,
    bindingId: undefined,
    hoveredId: undefined,
    pointedId: undefined,
  }

  return {
    id: 'create_page',
    before: {
      appState: {
        currentPageId,
      },
      document: {
        pages: {
          [pageId]: undefined,
        },
        pageStates: {
          [pageId]: undefined,
        },
      },
    },
    after: {
      appState: {
        currentPageId: page.id,
      },
      document: {
        pages: {
          [pageId]: page,
        },
        pageStates: {
          [pageId]: pageState,
        },
      },
    },
  }
}
