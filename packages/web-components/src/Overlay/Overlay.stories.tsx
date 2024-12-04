import assert from 'assert'
import {
  createSignal,
  onCleanup,
  onMount,
  For,
} from 'solid-js'
import type { StoryFn, Meta } from 'storybook-solidjs'
import { clsx } from 'clsx'
import {
  fromEvent,
  map,
  switchMap,
  takeUntil,
  tap,
  filter,
  Subject,
  EMPTY,
  finalize,
  distinctUntilChanged,
  merge,
} from 'rxjs'
import {
  Button,
  Card as CardContainer,
  CardHeader,
  CardContent,
  CardFooter,
} from '@stories/components'
import {
  type Rect,
  type BoxSizing,
  getBoundingRect,
} from '#floating'
import {
  InspectorOverlayRect,
} from './OverlayRect'
import {
  InspectorOverlayTip,
} from './OverlayTip'
import {
  Overlay,
} from './Overlay'
import {
  getElementDimensions,
} from './utils'


// https://storybook.js.org/docs/react/writing-stories/introduction#component-story-format
export default {
  title: 'Overlay',
} satisfies Meta


export const CornerItems = () => {
  const itemSize = 120

  type Positions = Array<{ x: number; y: number }>
  const [positions, setPositions] = createSignal<Positions>([])

  const createPositions = (): Positions => {
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight

    // Calculate the positions for the tips
    const positions: Positions = [
      // Top left corner
      {
        y: 0,
        x: 0,
      },
      // Top right corner
      {
        y: 0,
        x: screenWidth - itemSize,
      },
      // Bottom left corner
      {
        y: screenHeight - itemSize,
        x: 0,
      },
      // Bottom right corner
      {
        y: screenHeight - itemSize,
        x: screenWidth - itemSize,
      },
      // Center
      {
        y: (screenHeight - itemSize) / 2,
        x: (screenWidth - itemSize) / 2,
      },

      // Top-Center but outside the space
      {
        y: -2 * itemSize,
        x: (screenWidth - itemSize) / 2,
      },

      // Bottom-Center but outside the space
      {
        y: screenHeight + 2 * itemSize,
        x: (screenWidth - itemSize) / 2,
      },

      // Left-Center but outside the space
      {
        y: (screenHeight - itemSize) / 2,
        x: -2 * itemSize,
      },

      // Right-Center but outside the space
      {
        y: (screenHeight - itemSize) / 2,
        x: screenWidth + 2 * itemSize,
      },
    ]

    return positions
  }

  onMount(() => {
    const resizer = new ResizeObserver(() => {
      const positions = createPositions()
      setPositions(positions)
    })
    resizer.observe(document.body)

    onCleanup(() => resizer.disconnect())
  })


  const boxSizing: BoxSizing = {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    borderTop: 2,
    borderLeft: 2,
    borderRight: 2,
    borderBottom: 2,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
  }

  return (
    // https://stackoverflow.com/questions/70819075/solidjs-for-vs-index
    <For
      each={positions()}
    >
      {(position, index) => {
        const boundingRect: Rect = {
          ...position,
          width: itemSize,
          height: itemSize,
        }

        return (
          <>
            <InspectorOverlayRect
              boundingRect={boundingRect}
              boxSizing={boxSizing}
            />
            <InspectorOverlayTip
              title={(index() % 2) ? 'p' : 'div in <Card>'}
              boundingRect={boundingRect}
              boxSizing={boxSizing}
              showCornerHint
            />
          </>
        )
      }}
    </For>
  )
}


export const MoveableDragItem: StoryFn<{ itemSize: 'normal' | 'full' | 'large' }> = (props) => {
  let elementRef: HTMLDivElement | undefined

  const [position, setPosition] = createSignal({
    top: 0,
    left: 0,
  })

  const [sizing, setSizing] = createSignal<{
    /** target element bounding Rect */
    boundingRect?: Rect;
    /** target element margin/border/padding */
    boxSizing?: BoxSizing;
  }>({})

  const inspectOnElement = (element?: HTMLElement | null) => {
    if (!element)
      return

    const boxSizing = getElementDimensions(element)
    const boundingRect = getBoundingRect(element)

    setSizing({
      boundingRect,
      boxSizing,
    })
  }

  onMount(() => {
    const resizer = new ResizeObserver(() => {
      inspectOnElement(elementRef)
    })
    if (elementRef) {
      resizer.observe(elementRef)
    }
    resizer.observe(document.body)

    onCleanup(() => resizer.disconnect())
  })

  onMount(() => {
    const element = elementRef
    assert(element)
    inspectOnElement(element)

    const subscriber = fromEvent<PointerEvent>(element, 'pointerdown').pipe(
      switchMap(down => {
        const start = position()
        return fromEvent<PointerEvent>(document, 'pointermove').pipe(
          map(move => ({
            x: move.clientX - down.clientX,
            y: move.clientY - down.clientY,
          })),
          map(movement => ({
            left: movement.x + start.left,
            top: movement.y + start.top,
          })),
          takeUntil(fromEvent(document, 'pointerup')),
        )
      }),
      tap(position => {
        setPosition(position)
        inspectOnElement(element)
      }),
    ).subscribe()

    onCleanup(() => subscriber.unsubscribe())
  })

  return (
    <div>
      <div
        ref={elementRef}
        class={clsx(
          `
            relative flex justify-center items-center
            m-4 p-2
            border-2 border-slate-800 text-black
            select-none cursor-move
          `,
          props.itemSize === 'normal' && 'w-32 h-32',
          props.itemSize === 'full' && 'w-screen h-screen',
          props.itemSize === 'large' && 'w-[120vw] h-[120vh]',
        )}
        style={{
          transform: `translate(${position().left}px, ${position().top}px)`,
          'background-image': `
            radial-gradient(circle at center, #fff 30px, #fff0 100px),
            repeating-conic-gradient(#333 0 6deg, #fff 0 15deg)
          `,
        }}
      >
        <span>({position().top.toFixed(0)}, {position().left.toFixed(0)})</span>
      </div>

      <InspectorOverlayRect
        class='pointer-events-none'
        {...sizing()}
      />
      <InspectorOverlayTip
        title='div in <Card>'
        info='longlonglonglonglonglonglonglong/relative/path/to/packages/component.tsx'
        showCornerHint
        {...sizing()}
      />
    </div>
  )
}

/**
 * https://storybook.js.org/docs/api/arg-types
 */
MoveableDragItem.argTypes = {
  itemSize: {
    name: 'Item Size',
    type: {
      name: 'enum',
      value: ['normal', 'full', 'large'],
      required: true,
    },
  },
}

// https://storybook.js.org/docs/writing-stories/args
MoveableDragItem.args = {
  itemSize: 'normal',
}


export const OverlayHover = () => {
  const active$ = new Subject<boolean>()
  let contentRef: HTMLDivElement | undefined

  const overlay = new Overlay()

  const overlayInspect = (overlay: Overlay, element: HTMLElement) => {
    overlay.inspect({
      element,
      title: 'div in <Card>',
      info: 'relative/path/to/packages/component.tsx',
    })
  }

  const onStopEvent = (event: Event) => {
    event.preventDefault()
    event.stopPropagation()
    event.stopImmediatePropagation()
  }

  const subscription = active$.pipe(
    distinctUntilChanged(),
    switchMap(active => {
      if (!active) {
        return EMPTY
      }

      return merge(
        merge(
          fromEvent(document, 'mousedown'),
          fromEvent(document, 'mouseover'),
          fromEvent(document, 'mouseup'),
          fromEvent(document, 'pointerdown'),
          fromEvent(document, 'pointerup'),
        ).pipe(tap(onStopEvent)),

        fromEvent(document, 'click').pipe(
          tap(onStopEvent),
          tap(() => active$.next(false)),
        ),

        fromEvent(document, 'pointerover').pipe(
          tap(onStopEvent),
          filter(({ target }) => Boolean(target)),
          tap(({ target }) => overlayInspect(overlay, target as HTMLElement)),
          finalize(() => overlay.hide()),
        ),
      )
    }),
  ).subscribe()

  onCleanup(() => {
    subscription.unsubscribe()
  })

  return (
    <CardContainer class='w-96'>
      <CardHeader
        title='Overlay Hover Demo'
        description='control by Overlay class with Buttons ↓'
      />
      <CardContent>
        <div
          class='my-2 p-2'
          ref={contentRef}
        >
          Content article ...
        </div>
      </CardContent>
      <CardFooter class='flex justify-between'>
        <Button
          variant='outline'
          onClick={() => active$.next(false)}
        >
          Deactivate
        </Button>
        <Button
          onClick={() => active$.next(true)}
        >
          Activate
        </Button>
      </CardFooter>
    </CardContainer>
  )
}
