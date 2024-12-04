
import { isDev } from '@utils'

export const StackBlitz = ({
  project,
  height,
  view,
  openFile,
  hideExplorer,
  showDevtools,
}: {
  project: string;
  height?: number;
  view?: 'preview' | 'editor' | 'default';
  openFile?: string;
  hideExplorer?: boolean;
  showDevtools?: boolean;
}) => {
  if (isDev)
    return null

  // https://developer.stackblitz.com/guides/integration/embedding#embed-url-options
  const params: Record<string, string | number | undefined> = {
    embed: 1,
    hideExplorer: hideExplorer ? 1 : 0,
    file: openFile,
    view,
    devtoolsheight: showDevtools ? '50' : '0',
  }

  const urlParams = Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')

  return (
    <iframe
      className='rounded-xl'
      src={`https://stackblitz.com/${project}?${urlParams}`}
      height={height || '100%'}
      style={{ width: '100%' }}
    />
  )
}
