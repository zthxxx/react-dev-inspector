import styled from '@emotion/styled'
import { css } from '@emotion/css'

/**
 * https://github.com/sindresorhus/github-markdown-css/blob/gh-pages/github-markdown.css#L183
 */
export const keyTone = css`
  display: inline-block;
  padding: 0.5rem 0.8rem;
  font: 12px SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
  font-size: 1.2rem;
  height: 1.2rem;
  line-height: 1.2rem;
  color: #444d56;
  vertical-align: middle;
  background-color: #fafbfc;
  border: 1px solid #d1d5da;
  border-radius: 0.4rem;
  box-shadow: inset 0 -1px 0 #d1d5da;
`

export const Keys = styled.div`
  display: inline-block;
  padding: 0 0.5rem;
  opacity:1;
  animation: flickerAnimation 1.6s ease-in-out infinite;
  
  & > .${keyTone} {
    margin: auto 0.8rem;
  }
  
  @keyframes flickerAnimation {
    0%   { opacity: 1; }
    50%  { opacity: .4; }
    100% { opacity: 1; }
  }
`

export const Pad = styled.div`
  vertical-align: center;
  margin: 0 auto;
  padding: 2rem;
  font-size: 1.5rem;
  color: #666;
`
