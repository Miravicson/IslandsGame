// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import css from "../css/app.css"

// webpack automatically bundles all modules in your
// entry points. Those entry points can be configured
// in "webpack.config.js".
//
// Import dependencies
//
import "phoenix_html"

// Import local files
//
// Local files can be imported directly using relative paths, for example:
// import socket from "./socket"

import socket, {
  createNewChannel,
  join,
  leave,
  say_hello,
  newGame,
  add_player,
  set_island_coordinates,
  set_islands,
  guess_coordinate
} from "./dummySocket"


const gameChannel1 = createNewChannel("moon", "moon");
const gameChannel2 = createNewChannel("moon", "diva");

const broadcastEventMap = {
  player_set_islands: response => {
    console.log("Player Set Islands", response)
  },
  player_added: response => {
    console.log(`Player was added successfully: ${response.message}`)
  },
  player_guessed_coordinate: response => {
    console.log("Player Guessed Coordinate: ", response.result)
  }
}

// join(gameChannel1);
// join(gameChannel2)

function registerEvents(channels, eventMap) {
  channels.forEach(channel => {
    Object.entries(eventMap).forEach(([event, eventFunction]) => {
      channel.on(event, eventFunction)
    })
  })
}

registerEvents([gameChannel1, gameChannel2], broadcastEventMap)


window.myChannelElements = {
  leave,
  join,
  say_hello,
  newGame,
  add_player,
  gameChannel1,
  gameChannel2,
  set_island_coordinates,
  set_islands,
  guess_coordinate
}


// gameChannel.on("said_hello", response => {
//   console.log("Returned Greeting:", response.message)
// })
// join(gameChannel)
// say_hello(gameChannel, "World!")