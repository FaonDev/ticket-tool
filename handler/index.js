const Fs = require('fs');

module.exports = async (Client) => {
  const SlashsArray = [];

  Fs.readdir(`./Comandos`, (error, folder) => {
    folder.forEach(subfolder => {
      Fs.readdir(`./Comandos/${subfolder}/`, (error, files) => {
        files.forEach(files => {

          if (!files?.endsWith('.js')) return;
          files = require(`../Comandos/${subfolder}/${files}`);
          if (!files?.name) return;
          Client.slashCommands.set(files?.name, files);

          SlashsArray.push(files)
        });
      });
    });
  });

  Fs.readdir(`./Eventos/`, (erro, arquivos) => {
    arquivos.forEach(arquivo => {
      if (!arquivo.endsWith('.js')) return; require(`../Eventos/${arquivo}`);
    });
  });

  Client.on("ready", async () => {
    Client.guilds.cache.forEach(guild => guild.commands.set(SlashsArray));
  });

  Client.on("guildCreate", async () => {
    Client.guilds.cache.forEach(guild => guild.commands.set(SlashsArray));
  });

  process.on('multipleResolutions', (type, reason, promise) => {
    console.log(`Err:\n` + type, promise, reason);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.log(`Err:\n` + reason, promise);
  });

  process.on('uncaughtException', (error, origin) => {
    console.log(`Err:\n` + error, origin);
  });

  process.on('uncaughtExceptionMonitor', (error, origin) => {
    console.log(`Err:\n` + error, origin);
  });
};