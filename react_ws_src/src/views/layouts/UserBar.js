import React, { useEffect,Component } from 'react'
import app from 'ampersand-app'
import update_connectedusers from '../../helpers/sock_start'

export default class UserBar extends Component {
  constructor (props) {
    
console.log(localStorage.getItem("connected_users"));
    super(props);
    this.state = {
      bodyHeight: 0,
      closing: false,
      mounted: false,
      userdata: 
      localStorage.getItem("connected_users") ?  JSON.parse(localStorage.getItem("connected_users")).filter(function( obj ) {
        return obj.name !== localStorage.getItem("username");
      }) : []
    }
  }

  render () {  
    window.addEventListener('storage', () => {
    // When local storage changes, dump the list to
    // the console.
    this.state.userdata = JSON.parse(localStorage.getItem("connected_users")).filter(function( obj ) {
      return obj.name !== localStorage.getItem("username");
    })
  });
    const me = this;
    const {data} = this.state;
    return (
            <section id='user-section'>
              <div className='container'>
                <h3>{ this.props.pageTitle } </h3>
              </div>
              <div className='content'>
                <div className='container'>
                   <ul>
                     
                  <p>Online Users</p>
                   {this.state.userdata.map(d => (<li key={d.sockid} className="no-list color-green font-md"><p>{d.name}</p>
                   {/* <button type='submit' onClick={this.setTypeChallenge.bind(d.sockid)} className='button long'><span>Challenge <span className='fa fa-caret-right'></span></span></button> */}
                   </li>))} 
                   </ul>
                </div>
              </div>
            </section>
          )
  }

  //useEffect not working 
  componentDidMount() {
    this.interval = setInterval(() => this.setState({ userdata:  JSON.parse(localStorage.getItem("connected_users")).filter(function( obj ) {
      return obj.name !== localStorage.getItem("username");
    }) }), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  setTypeChallenge (e) {
		//this.props.onSetType('challenge',{sockid:e,name:localStorage.getItem("username")});
    update_connectedusers(app.settings,this);
	}
  
	pair_players () {
		this.socket.on('pair_players', function(data) { 
			// console.log('paired with ', data)

			this.setState({
				next_turn_ply: data.mode=='m',
				game_play: true,
				game_stat: 'Playing with ' + data.opp.name
			})

		}.bind(this));

		this.socket.on('opp_turn', this.turn_opp_live.bind(this));
	}
  
}

UserBar.propTypes = {
  pageTitle: React.PropTypes.string,
  children: React.PropTypes.any
}

UserBar.contextTypes = {
  router: React.PropTypes.object.isRequired
}
