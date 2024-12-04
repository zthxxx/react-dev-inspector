import {
  createSignal,
  Switch,
  Match,
  For,
} from 'solid-js'
import type { StoryFn, Meta } from 'storybook-solidjs'
import { action } from '@storybook/addon-actions'
import {
  Settings,
  Layers,
} from 'lucide-solid'
import {
  IconBox,
  LazyList,
  Layer,
  Tabs,
  ElementItem,
  ELEMENT_ITEM_HEIGHT,
  type ElementItemProps,
} from '#components'
import { styled } from '#utils'
import {
  ContextPanel,
} from './ContextPanel'
import {
  PanelContainer,
  PanelBody,
} from './PanelContainer'
import {
  PanelHeader,
} from './PanelHeader'

// https://storybook.js.org/docs/react/writing-stories/introduction#component-story-format
export default {
  title: 'ContextPanel',
} satisfies Meta


export enum ElementChainMode {
  Render = 'Render',
  Source = 'Source',
}

const demoItems: ElementItemProps['item'][] = [
  {
    title: `ComponentName`,
  },
  {
    title: `ComponentName`,
    subtitle: 'relative/short/path',
    tags: ['Memo'],
  },
  {
    title: `ComponentName`,
    subtitle: 'relative/short/path',
    tags: ['Memo', 'Forward'],
  },
  {
    title: `div`,
  },
  {
    title: `div`,
    subtitle: 'loooooooong/relative/path/to/packages/component.tsx',
    tags: ['Memo'],
  },
  {
    title: `LoooooooooooooooongComponentName`,
    subtitle: 'loooooooong/relative/path/to/packages/component.tsx',
    tags: ['Memo'],
  },
  {
    title: `div in <Card>`,
    subtitle: 'relative/path/to/packages/component.tsx',
    tags: ['Memo'],
  },
]

export const ContextPanelDemo: StoryFn = () => {
  const [selectedTab, setSelectedTab] = createSignal(ElementChainMode.Render)
  const [selectedLayer, setSelectedLayer] = createSignal(0)

  const onTabChange = action('TabChange')
  const onClickItem = action('ElementItem.onClickItem')
  const onClickEditor = action('ElementItem.onClickEditor')
  const onHoverItem = action('ElementItem.onHoverItem')
  const onLayerChange = action('LayerItem.onChange')

  function *generator(): LazyList.ItemGenerator<ElementItemProps> {
    for (let i = 0; i < 100; i++) {
      const index = i + 1
      yield {
        props: {
          index,
          item: demoItems[index % demoItems.length],
          onClickItem,
          onClickEditor,
          onHoverItem,
        },
        // `h-12` in ElementItem
        height: ELEMENT_ITEM_HEIGHT,
      }
    }
  }

  const items = generator()

  return (
    <ContextPanel
      class={`w-[300px] h-96`}
    >
      <PanelContainer>
        <PanelHeader data-draggable-block>
          <Tabs.Tabs
            value={selectedTab()}
            onChange={(tab) => {
              setSelectedTab(tab as ElementChainMode)
              onTabChange(tab)
            }}
            class={`flex flex-col flex-grow items-stretch justify-stretch h-full`}
            data-draggable-block
          >
            <Tabs.List>
              <Tabs.Trigger
                value={ElementChainMode.Render}
              >
                Render Chain
              </Tabs.Trigger>
              <Tabs.Trigger
                value={ElementChainMode.Source}
              >
                Source Chain
              </Tabs.Trigger>
            </Tabs.List>

          </Tabs.Tabs>

          <S.VerticalDivider />

          <IconBox
            onClick={action('Settings.onClick')}
          >
            <Settings size={16} strokeWidth={1.5} />
          </IconBox>
        </PanelHeader>

        <PanelBody data-draggable-block>
          <Switch>
            <Match
              when={selectedTab() === ElementChainMode.Render}
            >
              <Layer.LayerSide>
                <Layer.Title>
                  <Layers size={16} strokeWidth={1} />
                </Layer.Title>
                <Layer.Divider />
                <Layer.LayerList>
                  <For each={Array.from({ length: 20 }, (_, i) => i)}>
                    {index => {
                      const isSelected = () => selectedLayer() === index
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
                              setSelectedLayer(index)
                              onLayerChange(index)
                            }}
                          >
                            <Layer.LayerItemText>
                              #{index}
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

              <LazyList.List
                class={`panel-draggable`}
                generator={items}
                ElementItem={ElementItem}
                onPointerLeave={() => onHoverItem(null)}
              />
            </Match>
          </Switch>
        </PanelBody>
      </PanelContainer>
    </ContextPanel>
  )
}


const S = {
  VerticalDivider: styled.div({
    class: `w-[1px] h-5 bg-border flex-none`,
  }),

  LayerButton: styled(IconBox, {
    class: `
      aria-selected:text-text-0 aria-selected:bg-gray-100
      [&:hover>*]:opacity-100 [&>*]:aria-selected:opacity-100
    `,
  }),
}
