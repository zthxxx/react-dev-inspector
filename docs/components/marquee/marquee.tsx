import {
  Children,
  type FC,
  type PropsWithChildren,
  type CSSProperties,
} from 'react'


export interface MarqueeOptions {
  /** @default 'running' */
  play?: CSSProperties['animationPlayState'];
  /** @default '100s' */
  duration?: CSSProperties['animationDuration'];
  /** @default '0s' */
  delay?: CSSProperties['animationDelay'];
  /** @default 'infinite' */
  iteration?: CSSProperties['animationIterationCount'];

  reversed?: boolean;
}

export const Marquee: FC<PropsWithChildren<MarqueeOptions>> = ({
  children,

  play = 'running',
  reversed,
  duration = '100s',
  delay = '0s',
  iteration = 'infinite',
}) => {
  if (!Children.count(children))
    return null

  return (
    <div
      className='marquee-container [--pause-on-hover:paused] [--pause-on-click]'
      style={{
        '--play': play,
        '--direction': reversed ? 'reverse' : 'normal',
        '--duration': duration,
        '--delay': delay,
        '--iteration-count': iteration,
      } as CSSProperties}
    >
      <div className='marquee'>
        {children}
      </div>

      <div className='marquee'>
        {children}
      </div>
      <div
        className='
          pointer-events-none absolute inset-y-0 left-0 w-1/4
          bg-gradient-to-r dark:from-gray-950 from-gray-100
        '
      />
      <div
        className='
          pointer-events-none absolute inset-y-0 right-0 w-1/4
          bg-gradient-to-l dark:from-gray-950 from-gray-100
        '
      />
    </div>
  )
}
