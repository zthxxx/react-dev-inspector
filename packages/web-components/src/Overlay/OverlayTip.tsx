import {
  createSignal,
  createEffect,
  onCleanup,
  type JSX,
} from 'solid-js'
import {
  Subject,
  switchMap,
  tap,
} from 'rxjs'
import { css } from '#utils'
import {
  type Rect,
  type BoxSizing,
  getViewSpaceBox,
  restraintTipPosition,
} from '#floating'

/**
 * https://stackoverflow.com/questions/7944460/detect-safari-browser
 */
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

export const InspectorOverlayTip = (props: {
  class?: string;
  title: string;
  info?: string;
  /** target element bounding Rect */
  boundingRect?: Rect;
  /** target element margin/border/padding */
  boxSizing?: Pick<BoxSizing, `margin${'Top' | 'Left' | 'Right' | 'Bottom'}`>;
  /** viewport space box relative of client */
  spaceBox?: Rect;
  showCornerHint?: boolean;
  cornerHintText?: string;
}) => {
  const spaceBox = () => props.spaceBox ?? getViewSpaceBox()
  const hidden = () => !props.boundingRect || !props.boxSizing
  const infoDisplay = () => props.info ? 'block' : 'none'
  const width = () => Math.round(props.boundingRect?.width ?? 0)
  const height = () => Math.round(props.boundingRect?.height ?? 0)

  const [position, setPosition] = createSignal<Pick<JSX.CSSProperties, 'translate'>>({})

  const outerBox = (): Rect => {
    const { boundingRect, boxSizing } = props
    if (!boundingRect || !boxSizing) {
      return {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      }
    }

    const top = boundingRect.y - Math.max(boxSizing.marginTop, 0)
    const left = boundingRect.x - Math.max(boxSizing.marginLeft, 0)
    const right = boundingRect.x + boundingRect.width + Math.max(boxSizing.marginRight, 0)
    const bottom = boundingRect.y + boundingRect.height + Math.max(boxSizing.marginBottom, 0)

    return {
      x: left,
      y: top,
      width: right - left,
      height: bottom - top,
    }
  }

  const updatePosition$ = new Subject<Parameters<typeof restraintTipPosition>[0]>()

  const subscription = updatePosition$.pipe(
    switchMap(restraintTipPosition),
    tap(position => {
      setPosition({
        translate: `${position.left}px ${position.top}px`,
      })
    }),
  ).subscribe()

  onCleanup(() => subscription.unsubscribe())

  createEffect(() => {
    updatePosition$.next({
      elementBox: outerBox(),
      spaceBox: spaceBox(),
      tipSize: container!.getBoundingClientRect().toJSON(),
    })
  })

  let container: HTMLDivElement | undefined

  return (
    <>
      <style>
        {styles}
      </style>
      <style>
        {
          props.showCornerHint
            ? showCornerHintStyles
            : null
        }
      </style>
      <div
        class={`inspector-tip-container ${props.class ?? ''}`}
        ref={el => container = el}
        style={{
          display: hidden() ? 'none' : 'flex',
          translate: position().translate,
        }}
      >
        <div class='inspector-tip-info-row'>
          <div class='inspector-tip-info-name'>
            <div class='inspector-tip-info-title'>
              &lrm;{props.title}&lrm;
            </div>

            <div
              class='inspector-tip-info-subtitle'
              style={{
                display: infoDisplay(),
              }}
            >
              &lrm;{props.info}&lrm;
            </div>
          </div>
          <div class='inspector-tip-separator' />
          <div class='inspector-tip-size'>
            {width()}px × {height()}px
          </div>
        </div>

        <div class='inspector-tip-corner-hint'>
          {props.cornerHintText ?? 'Right-click to show list.'}
        </div>
      </div>
    </>
  )
}

const showCornerHintStyles = css`
.inspector-tip-container {
  --inspector-tip-corner-hint-display: flex;
}
`

const styles = css`
.inspector-tip-container {
  --inspector-tip-corner-hint-display: none;

  --corner-radius: 6px;
  --inspector-tip-color-bg: #333740;

  --color-shadow-1: #aaa1;
  --color-shadow-2: #aaaaaa16;

  position: fixed;
  top: 0;
  left: 0;
  flex-flow: column;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
  font-size: 12px;
  font-weight: bold;
  line-height: 1;
  white-space: nowrap;
  max-width: 97vw;
  box-sizing: border-box;
  user-select: none;
  overflow: hidden;

  ${
    isSafari
      // for Safari bug of multiple drop-shadow with overflow:hidden will clip shadow
      ? css`
        filter: drop-shadow(0 0 1px #eee9);
      `
      : css`
        filter: drop-shadow(0 0 1px #eee9) drop-shadow(2px 10px 12px var(--color-shadow-1)) drop-shadow(-3px 3px 6px var(--color-shadow-2)) drop-shadow(0 -6px 8px var(--color-shadow-1));
      `
  }

  .inspector-tip-info-row {
    display: flex;
    flex-flow: row nowrap;
    align-items: stretch;
    border-radius: var(--corner-radius);
    background-color: var(--inspector-tip-color-bg);
    padding: 6px 12px;
  }

  .inspector-tip-corner-hint {
    --corner-hint-height: 16px;
    flex-grow: 0;
    width: min-content;
    overflow: visible;
    position: relative;

    display: var(--inspector-tip-corner-hint-display);
    align-items: flex-start;
    justify-content: center;
    padding-top: 1px;
    padding-inline: 12px 10px;
    height: var(--corner-hint-height);
    background-color: var(--inspector-tip-color-bg);
    color: #ccc;
    font-size: 9px;
    font-weight: 400;
    border-radius: 0 0 var(--corner-radius) var(--corner-radius);

    &::before {
      position: absolute;
      top: calc(-1 * var(--corner-radius));
      left: 0;
      width: var(--corner-radius);
      height: var(--corner-radius);

      display: block;
      background: var(--inspector-tip-color-bg);
      content: '';
    }

    &::after {
      position: absolute;
      top: calc(-1 * var(--corner-radius));
      right: calc(-1 * var(--corner-radius));
      width: calc(2 * var(--corner-radius));
      height: calc(2 * var(--corner-radius));

      display: block;
      background: radial-gradient(circle at bottom right, transparent 35%, var(--inspector-tip-color-bg) 40%);
      content: '';
    }
  }
}

.inspector-tip-info-name {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  justify-content: center;
  overflow: hidden;
  margin-right: auto;
}

.inspector-tip-separator {
  flex: 0 0 auto;
  width: 1px;
  min-height: 18px;
  margin-block: 8px;
  margin-inline: 14px;
  background-color:#999;;
}

.inspector-tip-info-title, .inspector-tip-info-subtitle {
  display: flex;
  align-items: center;
  max-width: 750px;
  margin-block: 4px;
  color: #ee78e6;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.inspector-tip-info-title {
  font-size: 16px;
}
.inspector-tip-info-subtitle {
  font-size: 12px;
  /**
   * use "direction: rtl" to ellipsis beginning of string from left;
   * and use Left-To-Right Mark "&lrm;" to avoid symbols reversed at beginning or end;
   * https://stackoverflow.com/questions/12761418/i-need-an-overflow-to-truncate-from-the-left-with-ellipses/66986273#66986273
   */
  direction: rtl;
  text-align: left;
}
.inspector-tip-size {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  color: #d7d7d7;
}
`
