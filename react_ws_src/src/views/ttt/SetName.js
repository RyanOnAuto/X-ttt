import app from 'ampersand-app'
import React, {Component} from 'react'
import socket_start from '../../helpers/sock_start'

export default class SetName extends Component {

	constructor (props) {
		super(props)

		this.state = {}
	}

//	------------------------	------------------------	------------------------

	render () {
		return (
			<div id='SetName'>

				<h1>Set Name</h1>

				<div ref='nameHolder' className='input_holder left'>
					<label>Name </label>
					<input ref='name' type='text' className='input name' placeholder='Name' />
				</div>


				<button type='submit' onClick={this.saveName.bind(this)} className='button'><span>SAVE <span className='fa fa-caret-right'></span></span></button>

			</div>
		)
	}

//	------------------------	------------------------	------------------------

	saveName (e) {
		// const { name } = this.refs
		// const { onSetName } = this.props
		// onSetName(name.value.trim())
		this.props.onSetName(this.refs.name.value.trim())
		socket_start(app.settings,this);
		this.state = {
			settings: app.settings,
			userdata: JSON.parse(localStorage.getItem("connected_users")).filter(function( obj ) {
				return obj.name !== localStorage.getItem("username");
			  }),
			socketid: this.socket.id
		}
		
	}

}
