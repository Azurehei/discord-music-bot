// commands/queue.js - 顯示播放清單
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('顯示當前播放清單'),
  
  async execute({ interaction, player }) {
    await interaction.deferReply();
    
    // 獲取當前隊列
    const queue = player.nodes.get(interaction.guildId);
    if (!queue || !queue.node.isPlaying()) {
      return interaction.followUp('目前沒有正在播放的歌曲。');
    }
    
    // 獲取隊列中的歌曲
    const tracks = queue.tracks.data;
    const currentTrack = queue.currentTrack;
    
    if (!currentTrack) {
      return interaction.followUp('目前沒有正在播放的歌曲。');
    }
    
    // 創建嵌入式訊息
    const embed = new EmbedBuilder()
      .setTitle('播放清單')
      .setColor('#0099ff')
      .setDescription(`**目前播放:** [${currentTrack.title}](${currentTrack.url}) - ${currentTrack.author}\n\n**即將播放:**\n${
        tracks.length 
          ? tracks.slice(0, 10).map((track, i) => `${i + 1}. [${track.title}](${track.url}) - ${track.author}`).join('\n') 
          : '沒有更多歌曲'
      }${tracks.length > 10 ? `\n...還有 ${tracks.length - 10} 首歌曲` : ''}`)
      .setTimestamp();
    
    await interaction.followUp({ embeds: [embed] });
  }
};
