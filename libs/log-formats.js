function prodFormat (type, message, label, namespace) {
  // properly display error messages
  if (message.stack) message = message.stack

  return JSON.stringify({ time: new Date(), type, message, label, namespace })
}

module.exports = { prodFormat }
