

// ----	--------------------------------------------	--------------------------------------------	
// ----	--------------------------------------------	--------------------------------------------	
var connected_users = [];
// New player has joined
function onNewPlayer(data) {

	util.log("New player has joined: "+data.name);

	// Create a new player
	var newPlayer = new Player(-1, data.name, "looking");
	newPlayer.sockid = this.id;

	this.player = newPlayer;

	// Add new player to the players array
	players.push(newPlayer);
	players_avail.push(newPlayer);
	
	// util.log("looking for pair - uid:"+newPlayer.uid + " ("+newPlayer.name + ")");
	//pair_avail_players();
	io.sockets.emit("connected_users", players_avail);
	// updAdmin("looking for pair - uid:"+p.uid + " ("+p.name + ")");

	// updAdmin("new player connected - uid:"+data.uid + " - "+data.name);

};

// ----	--------------------------------------------	--------------------------------------------	
function broadcast(data){
	const dynamicNsp = io.of("http://localhost:3000").on("connection", (socket) => {
	const newNamespace = socket.nsp; // newNamespace.name === "/dynamic-101"
	util.log("BroadCast: "+newNamespace);
	// broadcast to all clients in the given sub-namespace
	newNamespace.emit(data);
  });
}

function updateClients() {
	io.sockets.emit('update', data.connected_users);
}

function pair_chalanged_players(p1,p2) {

	if (players_avail.length < 2)
		return;

	set_game(p1,p2)

};

function pair_avail_players() {
	
	if (players_avail.filter(function( obj ) {
        return obj.mode === 'ready'
      }).length < 2)
		return;

	var p1 = players_avail.filter(function( obj ) {
        return obj.mode === 'ready'
      }).shift();
	var p2 = players_avail.filter(function( obj ) {
        return obj.mode === 'ready' && obj.name !== p1.name
      }).shift();
	set_game(p1,p2)

};

function set_game(p1,p2){
	p1.mode = 'm';
	p2.mode = 's';
	p1.status = 'paired';
	p2.status = 'paired';
	p1.opp = p2;
	p2.opp = p1;

	//util.log("connect_new_players p1: "+util.inspect(p1, { showHidden: true, depth: 3, colors: true }));

	// io.sockets.connected[p1.sockid].emit("pair_players", {opp: {name:p2.name, uid:p2.uid}, mode:'m'});
	// io.sockets.connected[p2.sockid].emit("pair_players", {opp: {name:p1.name, uid:p1.uid}, mode:'s'});
	io.to(p1.sockid).emit("pair_players", {opp: {name:p2.name, uid:p2.uid}, mode:'m'});
	io.to(p2.sockid).emit("pair_players", {opp: {name:p1.name, uid:p1.uid}, mode:'s'});

	util.log("connect_new_players - uidM:"+p1.uid + " ("+p1.name + ")  ++  uidS: "+p2.uid + " ("+p2.name+")");
	// updAdmin("connect_new_players - uidM:"+p1.uid + " ("+p1.name + ")  ++  uidS: "+p2.uid + " ("+p2.name+")");
}

// ----	--------------------------------------------	--------------------------------------------	

function onTurn(data) {
	//util.log("onGameLoadedS with qgid: "+data.qgid);

	io.to(this.player.opp.sockid).emit("opp_turn", {cell_id: data.cell_id});

	util.log("turn  --  usr:"+this.player.mode + " - :"+this.player.name + "  --  cell_id:"+data.cell_id);
	// updAdmin("Q answer - game - qgid:"+data.qgid + "  --  usr:"+this.player.mode + " - uid:"+this.player.uid + "  --  qnum:"+data.qnum + "  --  ans:"+data.ansnum);
};

// ----	--------------------------------------------	--------------------------------------------	
// ----	--------------------------------------------	--------------------------------------------	

// Socket client has disconnected
function onClientDisconnect() {
	// util.log("onClientDisconnect: "+this.id);


	var removePlayer = this.player;
	players.splice(players.indexOf(removePlayer), 1);
	players_avail.splice(players_avail.indexOf(removePlayer), 1);
	util.log(players_avail);
	io.sockets.emit("connected_users", players_avail);

	if (this.status == "admin") {
		util.log("Admin has disconnected: "+this.uid);
//		updAdmin("Admin has disconnected - uid:"+this.uid + "  --  "+this.name);
	} else {
		util.log("Player has disconnected: "+this.id);
//		updAdmin("player disconnected - uid:"+removePlayer.uid + "  --  "+removePlayer.name);
	}

};

// ----	--------------------------------------------	--------------------------------------------	
// ----	--------------------------------------------	--------------------------------------------	

// ----	--------------------------------------------	--------------------------------------------	
// ----	--------------------------------------------	--------------------------------------------	

set_game_sock_handlers = function (socket) {

	// util.log("New game player has connected: "+socket.id);

	socket.on("new player", onNewPlayer);
	socket.on("challenge_player", pair_chalanged_players);
	socket.on("random_player", function (socket) {
		util.log("SOCKET"+players_avail)
		for(let player = 0; player < players_avail.length;player++){
			util.log("Player "+ pair_avail_players[player] )
			if(players_avail[player].name == socket.name){
				players_avail[player].mode = 'ready';
			}
		}
		pair_avail_players();
	});

	socket.on("ply_turn", onTurn);

	socket.on("disconnect", onClientDisconnect);

};
