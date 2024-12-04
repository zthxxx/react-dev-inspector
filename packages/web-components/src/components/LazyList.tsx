import {
  onMount,
  type JSX,
  For,
  batch,
  type Component,
  Switch,
  Match,
} from 'solid-js'
import {
  createStore,
  produce,
} from 'solid-js/store'
import {
  cn,
  css,
  styled,
} from '#utils'


export interface ElementItemInfo<Data> {
  props: Data;
  height: number;
}

export type ItemGenerator<ItemData> = Generator<ElementItemInfo<ItemData>, void, unknown>
type PureObject = Record<string, any>


export interface ListProps<ItemData extends PureObject> {
  class?: string | undefined;
  style?: JSX.CSSProperties;
  forwardProps?: JSX.HTMLAttributes<HTMLDivElement> & {
    [key: `data-${string}`]: boolean | string | undefined;
  };
  onPointerLeave?: JSX.EventHandler<HTMLDivElement, PointerEvent>;
  ElementItem: Component<ItemData>;
  generator: ItemGenerator<ItemData>;
}

export const List = <ItemData extends PureObject>(props: ListProps<ItemData>): JSX.Element => {
  const [store, setStore] = createStore({
    items: [] as ElementItemInfo<ItemData>[],
    loadDone: false,
    isLoading: false,
  })

  const setLoadDone = (value: boolean) => setStore('loadDone', value)
  const setIsLoading = (value: boolean) => setStore('isLoading', value)

  let container: HTMLDivElement | undefined
  let itemsHeight = 0

  const loadItems = (count: number = 1) => {
    const newItems: ElementItemInfo<ItemData>[] = []
    for (let i = 0; i < count; i++) {
      const result = props.generator.next()
      if (result.done) {
        setLoadDone(true)
        break
      }
      newItems.push(result.value)
      itemsHeight += result.value.height
    }

    setStore(produce(store => {
      store.items.push(...newItems)
      store.isLoading = false
    }))
  }

  const onScroll = () => {
    if (!container || store.isLoading || store.loadDone)
      return
    const { scrollTop, clientHeight, scrollHeight } = container
    const scrollBottom = scrollTop + clientHeight
    const bottomTriggerToScroll = 30

    setIsLoading(true)

    batch(() => {
      while (
        !store.loadDone
        && (
          scrollBottom >= Math.max(itemsHeight, scrollHeight) - Math.max(clientHeight * 0.2, bottomTriggerToScroll)
        )
      ) {
        loadItems()
      }
    })

    setIsLoading(false)
  }

  onMount(async () => {
    if (container) {
      await Promise.resolve()
      const initialHeight = container.clientHeight
      batch(() => {
        do {
          loadItems()
        } while (

          itemsHeight < (2 * initialHeight) && !store.loadDone
        )
      })
    }
  })

  return (
    <div
      {...props.forwardProps}
      ref={el => container = el}
      class={cn(
        `
          h-full gap-1 p-1.5 overflow-y-auto flex flex-col items-stretch justify-start
          [content-visibility:auto] [contain-intrinsic-size:auto_none] [flex:1_1_100%]
        `,
        props.class,
      )}
      style={props.style}
      onScroll={onScroll}
      onPointerLeave={props.onPointerLeave}
    >
      <Switch>
        <Match when={store.items.length}>
          <For each={store.items}>
            {(item) => (
              <ListItem>
                <props.ElementItem {...item.props} />
              </ListItem>
            )}
          </For>
          <EndingPadding
            onPointerEnter={props.onPointerLeave}
          />
        </Match>

        <Match when={store.loadDone && !store.items.length}>
          <div
            class={`flex items-center justify-center h-full text-text-3 select-none`}
            data-draggable-block
          >
            Empty
          </div>
        </Match>
      </Switch>
    </div>
  )
}

export interface ListItemProps {
  class?: string | undefined;
  children?: JSX.Element;
  style?: string;
}


const ListItem = styled.div({
  class: `flex items-stretch justify-stretch`,
  style: css`contain: layout paint;`,
})

const EndingPadding = styled.div({
  class: `h-10 flex-[1_0_auto]`,
})
