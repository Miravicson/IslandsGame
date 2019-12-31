import {
  Socket
} from 'phoenix';

const socket = new Socket("/socket", {})

socket.connect()


export function createNewChannel(subtopic, screenName) {
  return socket.channel(`game:${subtopic}`, {
    screen_name: screenName
  })
}




export function join(channel) {
  channel.join()
    .receive("ok", response => {
      console.log("Joined successfully!", response)
    })
    .receive("error", response => {
      console.log("Unable to join", response)
    })
}

export function leave(channel) {
  channel.leave()
    .receive("ok", response => {
      console.log("Left successfully", response);
    })
    .receive("error", response => {
      console.log("Unable to leave", response)
    })
}

export function say_hello(channel, greeting) {
  channel.push("hello", {
      "message": greeting
    })
    .receive("ok", response => {
      console.log(response)
      console.log("Hello", response.message)
    })
    .receive("error", response => {
      console.log("Unable to say hello to the channel.", response.message)
    })
}

export function newGame(channel) {
  channel.push("new_game")
    .receive("ok", response => {
      console.log("New Game!", response)
    })
    .receive("error", response => {
      console.log("Unable to start a new game.", response)
    })
}

export function add_player(channel, player) {
  channel.push("add_player", player)
    .receive("error", response => {
      console.log(`Unable to add new player: ${player}`, response)
    })
}

export function set_island_coordinates(channel, player, island, coordinates) {
  const params = {
    "player": player,
    "island": island,
    "coordinates": coordinates
  }
  channel.push("set_island_coordinates", params)
    .receive("ok", response => {
      console.log("New coordinates set!", response)
    })
    .receive("error", response => {
      console.log("Unable to set new coordinates.", response)
    })
}

export function set_islands(channel, player) {
  channel.push("set_islands", player)
    .receive("error", response => {
      console.log(`Unable to set islands for: ${player}`, response)
    })
}


export function guess_coordinate(channel, player, coordinate) {
  const params = {
    "player": player,
    "coordinate": coordinate
  }
  channel.push("guess_coordinate", params)
    .receive("error", response => {
      console.log("Unable to guess a coordinate: " + player, response)
    })
}
export default socket