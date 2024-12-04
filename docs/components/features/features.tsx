import {
  type ReactNode,
  type CSSProperties,
  createContext,
  useContext,
  Children,
} from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { clsx } from 'clsx'
import { ArrowRightIcon } from '@components/icons'
import styles from './style.module.css'


const IndexContext = createContext<number>(0)


export function Features({ children }: { children: ReactNode }) {
  return (
    <div className={styles.features}>
      {Children.toArray(children).map((child, index) => (
        <IndexContext.Provider key={index} value={index}>
          {child}
        </IndexContext.Provider>
      ))}
    </div>
  )
}


export function Feature({
  large,
  fulled,
  centered,
  unbounded,
  children,
  lightOnly,
  className,
  href,
  ...props
}: {
  large?: boolean;
  fulled?: boolean;
  centered?: boolean;
  unbounded?: boolean;
  lightOnly?: boolean;
  className?: string;
  href?: string;
  children?: ReactNode;
  id?: string;
  style?: CSSProperties;
}) {
  const index = useContext(IndexContext)

  return (
    <motion.div
      initial={{
        y: 20,
        opacity: 0,
      }}
      whileInView={{
        y: 0,
        opacity: 1,
      }}
      viewport={{ once: true }}
      transition={{ duration: Math.min(0.25 + index * 0.25, 0.8) }}
      className={clsx(
        styles.feature,
        large && styles.large,
        fulled && styles.fulled,
        centered && styles.centered,
        unbounded && styles.unbounded,
        lightOnly && styles['light-only'],
        className,
      )}
      {...props}
    >
      {children}
      {
        href
          ? (
            <Link className={styles.link} href={href} target='_blank'>
              <ArrowRightIcon width='1.5em' />
            </Link>
          )
          : null
      }
    </motion.div>
  )
}
