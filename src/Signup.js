import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { setLong, setUserId, store, url } from './helpers';

class Signup extends Component {
  componentDidMount(){
    setLong(false, this.props);
  };

  state = {
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
    submitted: false
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ submitted: true });

    if (this.state.password === this.state.password_confirmation) {
      fetch(`${url}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accepts': 'application/json'
        },
        body: JSON.stringify(this.state)
      })
      .then(r => r.json())
      .then(r => {
        if (r.errors) {
          this.setState({ submitted: false });
          alert(r.errors);
        } else {
          this.setState({ submitted: false });
          store.set('jwt', r.jwt);
          this.props.history.push('/charts');
          setUserId(r.user.id, this.props);
        };
      });
    } else {
      this.setState({ submitted: false });
      alert('Sorry, those passwords don\'t match');
    };
  };

  render() {
    return (
      <div className='container'>
        <div className='customizationCardPie center'>
          <h4 className='customizationHeader'>Sign up
          </h4>
          <Link className='customizationHeader' to='/login'>or log in</Link>
          <form onSubmit={this.handleSubmit}>
            <label className='smallHead' htmlFor='username'>Username</label>
            <input
              className='customizationInput'
              name='username'
              type='text'
              value={this.state.username}
              onChange={this.handleChange}
            />
            <label className='smallHead' htmlFor='email'>Email (optional)</label>
            <input
              className='customizationInput'
              name='email'
              type='text'
              value={this.state.email}
              onChange={this.handleChange}
            />
            <label className='smallHead' htmlFor='password'>Password</label>
            <input
              className='customizationInput'
              name='password'
              type='password'
              value={this.state.password}
              onChange={this.handleChange}
            />
            <label className='smallHead' htmlFor='password'>Confirm password</label>
            <input
              className='customizationInput'
              name='password_confirmation'
              type='password'
              value={this.state.password_confirmation}
              onChange={this.handleChange}
            />
            {
              !this.state.submitted
                ?
              <div className='center blockButton'>
                <button className='button' type='submit'>Submit</button>
              </div>
                :
              <div className='center blockGif'>
                <img src='/assets/ajaxLoader.gif' alt='loading' />
              </div>
            }
          </form>
        </div>
      </div>
    );
  };
};

function mapStateToProps(state) {
  return {
    userId: state.userId
  };
};

export default connect(mapStateToProps)(Signup);
