import React, { Component } from 'react';
import * as S from './styles';
export const Keypress: React.FC = ({
  children
}) => {
  return <kbd data-inspector-line="7" data-inspector-column="4" data-inspector-relative-path="layouts/components/Keypress/Keypress.tsx" className={S.keyTone}>
      {children}
    </kbd>;
};
export class KeyPad extends Component {
  public render() {
    const {
      children
    } = this.props;
    return <S.Pad data-inspector-line="22" data-inspector-column="6" data-inspector-relative-path="layouts/components/Keypress/Keypress.tsx">
        <span data-inspector-line="23" data-inspector-column="8" data-inspector-relative-path="layouts/components/Keypress/Keypress.tsx">press</span>

        <S.Keys data-inspector-line="25" data-inspector-column="8" data-inspector-relative-path="layouts/components/Keypress/Keypress.tsx">{children}</S.Keys>

        <span data-inspector-line="27" data-inspector-column="8" data-inspector-relative-path="layouts/components/Keypress/Keypress.tsx">to try! 🍭</span>
      </S.Pad>;
  }

}