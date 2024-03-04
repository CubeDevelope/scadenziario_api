export const Errors = {};

function errorHandler() {
  ioServer.sockets.emit("server_error");
}
