import {
  type JSX,
  Show,
  For,
  createSignal,
  createEffect,
  onMount,
} from 'solid-js'
import {
  Settings,
  Layers,
} from 'lucide-solid'
import type {
  TrustedEditor,
} from '@react-dev-inspector/launch-editor-endpoint'
import {
  IconBox,
  LazyList,
  Layer,
  Tabs,
  ElementItem,
  ELEMENT_ITEM_HEIGHT,
  type ElementItemProps,
  type ItemInfo,
  PanelContainer,
  PanelBody,
  PanelHeader,
  Tooltip,
} from '#components'
import { styled } from '#utils'
import {
  type ElementInfoGenerator,
  type ElementInfoGeneratorGetter,
  ElementChainMode,
} from './types'


export interface ElementInspectPanelProps<Item extends ItemInfo = ItemInfo> {
  elementChainMode: ElementChainMode;
  onChangeChainMode: (mode: ElementChainMode) => void;
  layers: ElementInfoGeneratorGetter<Item>[];
  onClickItem?: (item: Item) => void;
  onClickEditor?: (params: {
    item: Item;
    editor: TrustedEditor;
  }) => void | Promise<void>;
  onHoverItem?: (item: Item | null) => void;
  toSettingsPanel?: () => void;
}

export const ElementInspectPanel = <Item extends ItemInfo = ItemInfo>(props: ElementInspectPanelProps<Item>) => {
  const [selectedLayers, setSelectedLayers] = createSignal<Partial<Record<ElementChainMode, number>>>({})
  const [listElement, setListElement] = createSignal<JSX.Element | null>(null)
  let layerFirstItemsCache: Record<number, Item> = {}

  const selectedLayer = () => selectedLayers()[props.elementChainMode] ?? 0

  const getCurrentLayerChain = () => {
    const layer = props.layers[selectedLayer()]
    return layer?.() ?? []
  }

  function *getListItem(elementChain: ElementInfoGenerator<Item>): LazyList.ItemGenerator<ElementItemProps<Item>> {
    let index = 1
    for (const item of elementChain) {
      yield {
        props: {
          index,
          item,
          onClickItem: props.onClickItem,
          onClickEditor: props.onClickEditor,
          onHoverItem: props.onHoverItem,
        },
        height: ELEMENT_ITEM_HEIGHT,
      }

      index += 1
    }
  }

  const getListElement = () => {
    const generator = getListItem(getCurrentLayerChain())

    return (
      <LazyList.List
        ElementItem={ElementItem}
        // due to reactive will loose in `generator` props which will be transform to a getter
        generator={generator}
        onPointerLeave={() => props.onHoverItem?.(null)}
        forwardProps={{
          'data-draggable-block': true,
        }}
      />
    )
  }

  onMount(() => {
    setListElement(getListElement())
  })

  createEffect(() => {
    layerFirstItemsCache = (props.layers, {})
  })

  createEffect(() => {
    setListElement(getListElement())
  })

  const getLayerFirstItem = (index: number): Item | undefined => {
    if (layerFirstItemsCache[index]) {
      return layerFirstItemsCache[index]
    }

    const chain = props.layers[index]?.()
    const first = chain?.next()
    if (first.done || !first.value) {
      return
    }
    layerFirstItemsCache[index] = first.value

    return first.value
  }

  return (
    <PanelContainer>
      <PanelHeader data-draggable-block>
        <Tabs.Tabs
          value={props.elementChainMode}
          onChange={(tab) => props.onChangeChainMode(tab as ElementChainMode)}
          class={`flex-initial no-scrollbar overflow-x-auto`}
        >
          <Tabs.List data-draggable-block>
            <Tooltip
              content={(
                <span>
                  List elements as render hierarchy. <br />
                  (root at bottom)
                </span>
              )}
              rootProps={{
                placement: 'top-start',
                shift: -40,
                openDelay: 500,
              }}
            >
              <Tabs.Trigger
                value={ElementChainMode.Render}
              >
                Render Chain
              </Tabs.Trigger>
            </Tooltip>
            <Tooltip
              content={(
                <span>
                  List elements as source-code hierarchy. <br />
                  (root at bottom)
                </span>
              )}
              rootProps={{
                placement: 'top-start',
                shift: -40,
                openDelay: 500,
              }}
            >
              <Tabs.Trigger
                value={ElementChainMode.Source}
              >
                Source Chain
              </Tabs.Trigger>
            </Tooltip>
          </Tabs.List>
        </Tabs.Tabs>

        <Show
          when={props.toSettingsPanel}
        >
          <div class={`flex items-center justify-between py-1 gap-1.5`}>
            <S.VerticalDivider />

            <Tooltip
              content={'Goto Settings Panel'}
              rootProps={{
                openDelay: 500,
              }}
            >
              <IconBox
                onClick={props.toSettingsPanel}
              >
                <Settings size={16} strokeWidth={1.5} />
              </IconBox>
            </Tooltip>
          </div>
        </Show>
      </PanelHeader>

      <PanelBody data-draggable-block>
        <Show
          when={props.layers.length > 1}
        >
          <Layer.LayerSide data-draggable-block>
            <Layer.Title>
              <Tooltip
                content={(
                  <span>
                    Layers, <br />
                    floating at same inspection spot
                  </span>
                )}
              >
                <Layers size={16} strokeWidth={1} />
              </Tooltip>
            </Layer.Title>
            <Layer.Divider />
            <Layer.LayerList>
              <For each={props.layers}>
                {(_, index) => {
                  const isSelected = () => selectedLayer() === index()
                  return (
                    <Layer.LayerItem
                      aria-selected={isSelected()}
                    >
                      <S.LayerButton
                        forwardProps={{
                          'aria-selected': isSelected(),
                        }}
                        onClick={() => {
                          if (isSelected())
                            return
                          setSelectedLayers(selects => ({
                            ...selects,
                            [props.elementChainMode]: index(),
                          }))
                        }}
                        onPointerEnter={() => {
                          const first = getLayerFirstItem(index())
                          if (first) {
                            props.onHoverItem?.(first)
                          }
                        }}
                        onPointerLeave={() => {
                          props.onHoverItem?.(null)
                        }}
                      >
                        <Layer.LayerItemText>
                          #{index() + 1}
                        </Layer.LayerItemText>
                      </S.LayerButton>
                    </Layer.LayerItem>
                  )
                }}
              </For>
              <Layer.LayerItem
                class={`h-10`}
              />
            </Layer.LayerList>
          </Layer.LayerSide>
        </Show>

        {listElement()}
      </PanelBody>
    </PanelContainer>
  )
}

const S = {
  VerticalDivider: styled.div({
    class: `w-[1px] h-4 bg-border flex-none`,
  }),

  LayerButton: styled(IconBox, {
    class: `
      aria-selected:text-text-0 aria-selected:bg-bg-active-2
      [&:hover>*]:opacity-100 [&>*]:aria-selected:opacity-100
    `,
  }),
}
