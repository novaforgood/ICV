declare module 'react-toggle/dist/component' {
  import { Component } from 'react';
  
  interface ToggleProps {
    defaultChecked?: boolean;
    disabled?: boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    checked?: boolean;
    className?: string;
  }
  
  export default class Toggle extends Component<ToggleProps> {}
} 