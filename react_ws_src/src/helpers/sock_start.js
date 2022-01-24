
import app from 'ampersand-app';
import { useEffect } from 'react';
import io from 'socket.io-client'
let interval;
const socket_start = function (settings, object) {
    
    if(!object.socket){
    object.socket = io(app.settings.ws_conf.loc.SOCKET__io.u);
    object.socket.on('connect', function (data) {
        console.log('object.socket connected', data)
        object.socket.emit('new player', { name: settings.curr_user.name});
        settings.socket = object.socket;
    }.bind(object));
    
    update_connectedusers(settings, object);
    }
    // object.socket.on('opp_turn', turn_opp_live.bind(object));
}

export const update_connectedusers = function (settings,object){

    object.socket.on('connected_users', connected_users => {
        // refresh  the display to show the userArray
        console.log(connected_users);
        settings.connected_users  = [...new Set(connected_users)];
        localStorage.setItem("connected_users",JSON.stringify(connected_users));
    });
}

export default socket_start;