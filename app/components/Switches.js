import React from 'react';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography'
const { ipcRenderer } = require('electron')

export default class SwitchesGroup extends React.Component {
  state = {
    strap: true,
    ticker: false,
    breakingNews: false,
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
    ipcRenderer.send([name], event.target.checked)
  };

  render() {
    return (
      <FormControl component="fieldset">
        <FormGroup >
          <FormControlLabel
            control={
              <Switch
                checked={this.state.strap}
                onChange={this.handleChange('strap')}
                value="strap"
              />
            }
            label={<Typography style={{color:'white',fontWeight:'bold'}}>News Strap</Typography>}
          />
          <FormControlLabel
            control={
              <Switch
                checked={this.state.ticker}
                onChange={this.handleChange('ticker')}
                value="ticker"
              />
            }
            label={<Typography style={{color:'white',fontWeight:'bold'}}>Ticker</Typography>}
          />
          <FormControlLabel
            control={
              <Switch
                checked={this.state.breakingNews}
                onChange={this.handleChange('breakingNews')}
                value="breakingNews"
              />
            }
            label={<Typography style={{color:'white',fontWeight:'bold'}}>Breaking News</Typography>}
          />
        </FormGroup>
      </FormControl>
    )
  }
}
