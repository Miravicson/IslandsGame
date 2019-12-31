defmodule IslandsInterfaceWeb.GameChannel do
  use IslandsInterfaceWeb, :channel

  alias IslandsEngine.Game

  # def handle_in("hello", payload, socket) do
  #   %{"message" => message} = payload
  #   message = message <> " Yeah Yeah"
  #   {:reply, {:ok, %{"message" => message}}, socket}
  # end

  # def handle_in("hello", _payload, socket) do
  #   payload = %{message: "We forced this error"}
  #   {:reply, {:error, payload}, socket}
  # end

  # def handle_in("hello", payload, socket) do
  #   push(socket, "said_hello", payload)
  #   {:noreply, socket}
  # end

  def handle_in("hello", payload, socket) do
    broadcast!(socket, "said_hello", payload)
    {:noreply, socket}
  end

  def handle_in("new_game", _payload, socket) do
    "game:" <> player = socket.topic

    case Game.start_link(player) do
      {:ok, _pid} -> {:reply, :ok, socket}
      {:error, reason} -> {:reply, {:error, %{reason: inspect(reason)}}, socket}
    end
  end

  def handle_in("add_player", player, socket) do
    case Game.add_player({:global, socket.topic}, player) do
      :ok ->
        broadcast!(socket, "player_added", %{
          message: "New player just joined: " <> player
        })

        {:noreply, socket}

      {:error, reason} ->
        {:reply, {:error, %{reason: inspect(reason)}}, socket}
    end
  end

  def handle_in("set_island_coordinates", payload, socket) do
    %{"player" => player, "island" => island, "coordinates" => coordinates} = payload
    player = String.to_atom(player)
    island = String.to_atom(island)
    coordinates = Enum.map(coordinates, fn coord -> String.to_atom(coord) end)

    case Game.set_island_coordinates({:global, socket.topic}, player, island, coordinates) do
      :ok -> {:reply, :ok, socket}
      :error -> {:reply, :error, socket}
    end
  end

  def handle_in("set_islands", player, socket) do
    player = String.to_atom(player)

    case Game.set_islands({:global, socket.topic}, player) do
      :ok ->
        broadcast!(socket, "player_set_islands", %{player: player})
        {:noreply, socket}

      :error ->
        {:reply, :error, socket}
    end
  end

  def handle_in("guess_coordinate", params, socket) do
    %{"player" => player, "coordinate" => coordinate} = params
    player = String.to_atom(player)
    coordinate = String.to_atom(coordinate)

    case Game.guess_coordinate({:global, socket.topic}, player, coordinate) do
      {:hit, island, win} ->
        result = %{hit: true, island: island, win: win}
        broadcast!(socket, "player_guessed_coordinate", %{player: player, result: result})
        {:noreply, socket}

      {:miss, island, win} ->
        result = %{hit: false, island: island, win: win}
        broadcast!(socket, "player_guessed_coordinate", %{player: player, result: result})
        {:noreply, socket}

      {:error, reason} ->
        {:reply, {:error, %{player: player, reason: inspect(reason)}}, socket}
    end
  end

  def channel() do
    quote do
      use Phoenix.Channel
      import IslandsInterfaceWeb.Gettext
    end
  end

  def join("game:" <> _player, _payload, socket) do
    {:ok, socket}
  end
end
