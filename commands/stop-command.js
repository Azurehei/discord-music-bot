// commands/stop.js - 停止播放音樂
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('停止播放音樂並清空播放清單'),
  
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
    
    // 停止播放並刪除隊列
    queue.delete();
    
    await interaction.followUp('⏹️ 已停止播放音樂並清空播放清單！');
  }
};
