import React, { useState, createContext } from "react";
import Container from "./Container";
const ConnectionContext = createContext({
  connection: null,
  updateConnection: () => { }
});
const ChannelContext = createContext({
  channel: null,
  updateChannel: () => { }
});
const App = () => {
  const [connection, setconnection] = useState(null);
  const [channel, setChannel] = useState(null);
  const updateConnection = conn => {
    setconnection(conn);
  };
  const updateChannel = chn => {
    setChannel(chn);
  };
  return <Container />
};
export const ConnectionConsumer = ConnectionContext.Consumer
export const ChannelConsumer = ChannelContext.Consumer
export default App