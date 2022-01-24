import app from 'ampersand-app'
import React, {Component} from 'react'
import UserBar from '../layouts/UserBar'
import update_connectedusers from '../../helpers/sock_start'
import io from 'socket.io-client'
export default class SetGameType extends Component {

	constructor (props) {
		super(props)

		this.state = {}

	}

//	------------------------	------------------------	------------------------

	render () {
		return (
			<div id='SetGameType'>
				<h2>Online Users</h2>
				<UserBar userdata = { app.settings }></UserBar>
				&nbsp;&nbsp;&nbsp;&nbsp;

				<button type='submit' onClick={this.selTypeComp.bind(this)} className='button long'><span>Against a computer <span className='fa fa-caret-right'></span></span></button>
				
				 &nbsp;&nbsp;&nbsp;&nbsp;
				<button type='submit' onClick={this.selTypeLive.bind(this)} className='button long'><span>Against Random Player <span className='fa fa-caret-right'></span></span></button>
			</div>
		)
	}

//	------------------------	------------------------	------------------------

	selTypeLive (e) {
		this.props.onSetType('live');
	}

//	------------------------	------------------------	------------------------

	selTypeComp (e) {
		this.props.onSetType('comp')
	}

	pair_players (userid) {
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
