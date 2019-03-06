// @flow
import React, { Component } from 'react';
import SwitchesGroup from './Switches'
import styles from './Home.css';

import bbcLogo from '../images/BBC_logo_white.1.svg'

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={styles.container} data-tid="container">
        <div className={styles.firstItem}>
          <img src={bbcLogo} />
          <h2>NEWS</h2>
        </div>
        <SwitchesGroup></SwitchesGroup>
      </div>
    );
  }
}
