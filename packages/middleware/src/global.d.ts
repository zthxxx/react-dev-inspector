declare module 'launch-editor' {
  /**
   * @TODO PR .d.ts into `launch-editor`
   * https://github.com/yyx990803/launch-editor/blob/v2.8.0/packages/launch-editor/index.js#L64
   */
  interface LaunchEditorFunction {
    (file: ComposableFilePath): void;
    (file: ComposableFilePath, specifiedEditor: string): void;
    (file: ComposableFilePath, onErrorCallback: (fileName: string, message: string | null) => void): void;
  }

  type ComposableFilePath =
    | AbsoluteOrRelativePath
    | `${AbsoluteOrRelativePath}:${LineNumber}`
    | `${AbsoluteOrRelativePath}:${LineNumber}:${ColumnNumber}`

  type AbsoluteOrRelativePath = string
  type LineNumber = number
  type ColumnNumber = number

  const launchEditor: LaunchEditorFunction

  export default launchEditor
}
