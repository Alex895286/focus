import fetch from 'node-fetch';

module.exports = {
  name: 'catfact',
  description: `Same as dogfact, except it's for cats.`,
  usage: 'catfact',
  async execute(message) {
    const response = await fetch('https://catfact.ninja/facts?limit=1&max_length=140%27');
    const data = await response.json();
    message.channel.send(data.data[0].fact);
  }
}