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

  discardChart = () => {
    this.props.dispatch({ type: 'SET_DEFAULT' });
    this.props.dispatch({ type: 'TOGGLE_NEW' });
  };

  updateChart = (saveData, embedData) => {
    let okay = false;
    const id = this.props.chart.id;

    console.log(saveData)
    // it posts [object Object] for both saveData and embedData

    fetch(`http://localhost:3000/charts/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: saveData,
        embed: "<iframe srcdoc=\"<div id='embed_container'></div><script src='https://unpkg.com/react@16/umd/react.development.js' crossorigin></script><script src='https://unpkg.com/react-dom@16/umd/react-dom.development.js' crossorigin></script><script src='https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.min.js' crossorigin></script><canvas id='chart' width='800' height='450'></canvas><script>new Chart(document.getElementById('chart'), {" + saveData + "});</script>\"></iframe>"
      })
    })
    .then(r => {
      if (r.ok) {
        okay = true;
      };
      return r.json()
    })
    .then(data => {
      if (okay) {
        this.props.dispatch({ type: 'SET_CHART', payload: data })
        this.props.dispatch({ type: 'SET_CHART_ID', payload: id });
        this.props.dispatch({ type: 'SET_DEFAULT' });
      };
    });
  };

  saveChart = (saveData, embedData) => {
    let okay = false;

    console.log(embedData)

    fetch('http://localhost:3000/charts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: 1,
        data: saveData,
        embed: `
          <iframe srcdoc="
              <div id='embed_container'></div>

              <script src='https://unpkg.com/react@16/umd/react.development.js' crossorigin></script>
              <script src='https://unpkg.com/react-dom@16/umd/react-dom.development.js' crossorigin></script>
              <script src='https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.min.js' crossorigin></script>

              <canvas id='chart' width='800' height='450'></canvas>
              <script>
              new Chart(document.getElementById('chart'), {
                ${embedData}
              });
          </script>"
          ></iframe>
        `
      })
    })
    .then(r => {
      if (r.ok) {
        okay = true;
      };
      return r.json();
    })
    .then(data => {
      if (okay) {
        this.props.dispatch({ type: 'SET_CHART', payload: data });
        this.props.dispatch({ type: 'SET_CHART_ID', payload: data.id });
        this.props.dispatch({ type: 'SET_DEFAULT' });
      };
    });
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
    (isNaN(value) || value === '' || value.match(/\s+/))) {
      this.props.dispatch({ type: 'SET_MIN', payload: -10 });
    } else if ((name === 'max') &&
    (isNaN(value) || value === '' || value.match(/\s+/))) {
      this.props.dispatch({ type: 'SET_MAX', payload: 10 });
    } else if ((name === 'ticks') &&
    (isNaN(value) || value === '' || value.match(/\s+/))) {
      this.props.dispatch({ type: 'SET_TICKS', payload: 0 });
    } else if ((name === 'tension') &&
    (isNaN(value) || value === '' || value.match(/\s+/))) {
      this.props.dispatch({ type: 'SET_TENSION', payload: 0.4 });
    } else if ((name === 'radius') &&
    (isNaN(value) || value === '' || value.match(/\s+/))) {
      this.props.dispatch({ type: 'SET_RADIUS', payload: 3 });
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
      // sorry if i broke this
      this.props.dispatch({ type: 'SET_HORIZONTAL', payload: !this.props.horizontal })
    } else {
      this.props.dispatch({ type: 'SET_NAME_TO_VALUE', payload: { key: name, value: value } })
    };
  };

  render() {
    return (
      <div className='container'>
        {
          this.props.edit
            ?
          <h4 className='customizationPaneHeader'>Edit {this.props.chartType} chart</h4>
            :
          <h4 className='customizationPaneHeader'>New {this.props.chartType} chart</h4>
        } {
            this.props.chartType === 'line'
            ? <LineChart
                saveChart={this.saveChart}
                updateChart={this.updateChart}
              />
            : (this.props.chartType === 'bar' || this.props.chartType === 'horizontalBar')
            ? <BarChart
                saveChart={this.saveChart}
                updateChart={this.updateChart}
              />
            : this.props.chartType === 'pie'
            ? <PieChart
                saveChart={this.saveChart}
                updateChart={this.updateChart}
              />
            : null
        } {
          this.props.chartType[0]
            ?
          <Fragment>
            {
              this.props.edit
                ?
              <button onClick={this.discardChart}>Discard changes</button>
                :
              <button onClick={this.discardChart}>Discard chart</button>
            }
          </Fragment>
            :
          null
        }
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
        }
      </div>
    );
  };
};

function mapStateToProps(state) {
  return {
    chart: state.chart,
    chartType: state.chartType,
    colors: state.colors,
    edit: state.edit,
    horizontal: state.horizontal,
    warn: state.warn
  };
};

export default connect(mapStateToProps)(Sandbox);
