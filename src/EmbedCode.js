import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

class EmbedCode extends Component {
  render() {
    return (
      <div>
        <p>
        {/*<!DOCTYPE html>
        <html lang="en" dir="ltr">
          <head>
            <meta charset="utf-8">
            <title></title>
          </head>
          <body>
            <div id="embed_container"></div>

            <script src="https://unpkg.com/react@16/umd/react.development.js" crossorigin></script>
            <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js" crossorigin></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.min.js" crossorigin></script>

            <script type="text/javascript" src="Embed.js"></script>
          </body>
        </html>*/}
        </p>
      </div>
    );
  };
};

function mapStateToProps(state) {
  return {

  };
};

export default connect(mapStateToProps)(EmbedCode);
