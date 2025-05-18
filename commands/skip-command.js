// commands/skip.js - 跳過當前歌曲
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('跳過當前播放的歌曲'),
  
  async execute({ interaction, player }) {
    await interaction.deferReply();
    
    // 檢查使用者是否在語音頻道中
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      return interaction.followUp('您必須先加入語音頻道才能使用此命令。');
    }
    
    // 獲取當前隊列
    const queue = player.nodes.get(interaction.guildId);
    if (!queue || !queue.node.isPlaying()) {
      return interaction.followUp('目前沒有正在播放的歌曲。');
    }
    
    // 跳過當前歌曲
    await queue.node.skip();
    
    await interaction.followUp('⏭️ 已跳過當前歌曲！');
  }
};
