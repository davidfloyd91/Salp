import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import UserInput from './UserInput';
import LineChart from './LineChart';
import BarChart from './BarChart';
import PieChart from './PieChart';
let colors;

class Sandbox extends Component {
  chartType = chartType => {
    this.props.dispatch({
      type: 'SET_CHART_TYPE', payload: chartType
    })
  };

  saveChart = data => {
    fetch('http://localhost:3000/charts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: 1,
        data: data
      })
    })
    .then(r => r.json())
  };

  setGrid = firstGrid => {
    let grid = [];
    let i = 0;

    this.props.dispatch({
      type: 'WARN', payload: ''
    });

    firstGrid.forEach(row => {
      if (row[1] && isNaN(parseFloat(row[1]))) {
        grid.push([row[0], "0"]);
        i++;
      } else if (!row[1]) {
        return;
      } else {
        grid.push([...row]);
      };
    });

    this.props.dispatch({
      type: 'SET_GRID', payload: grid
    });

    if (i > 0) {
      this.props.dispatch({
        type: 'WARN', payload: `Warning: ${i} y-value(s) not recognized and set to 0. Consider editing your CSV.`
      });
    };
  };

  customize = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    if ((name === 'min') &&
    (isNaN(value) || value === '')) {
      this.props.dispatch({ type: 'SET_MIN', payload: -10 });
    } else if ((name === 'max') &&
    (isNaN(value) || value === '')) {
      this.props.dispatch({ type: 'SET_MAX', payload: 10 });
    } else if ((name === 'ticks') &&
    (isNaN(value) || value === '')) {
      this.props.dispatch({ type: 'SET_TICKS', payload: 0 });
    } else if (name === 'colors') {
      if (e.target.checked) {
        colors = [...new Set([...this.props.colors, value])];
      } else {
        let i = this.props.colors.indexOf(value);
        colors = [...this.props.colors.slice(0, i), ...this.props.colors.slice(i + 1)];
      };
      // behavior here isn't ideal: deciding which item is which color requires clicking the checkboxes in the right order
      this.props.dispatch({ type: 'SET_COLORS', payload: colors})
    } else if (name === 'horizontal') {
      this.props.dispatch({ type: 'TOGGLE_HORIZONTAL' })
    } else {
      this.props.dispatch({ type: 'SET_NAME_TO_VALUE', payload: { key: name, value: value } })
    };
  };

  render() {
    return (
      <div className='container'>
        <h1>New {this.props.chartType} chart</h1>
        <UserInput
          changeChartType={this.chartType}
          setGrid={this.setGrid}
          customize={this.customize}
        />
        {
          this.props.warn[0]
            ?
          <h5>{this.props.warn}</h5>
            :
          null
        } {
          this.props.chartType === 'line'
          ? <LineChart saveChart={this.saveChart} />
          : this.props.chartType === 'bar'
          ? <BarChart saveChart={this.saveChart} />
          : this.props.chartType === 'pie'
          ? <PieChart saveChart={this.saveChart} />
          : null
        }
      </div>
    );
  };
};

function mapStateToProps(state) {
  return {
    chartType: state.chartType,
    colors: state.colors,
    warn: state.warn
  };
};

export default connect(mapStateToProps)(Sandbox);
