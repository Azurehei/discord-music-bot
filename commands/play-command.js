// commands/play.js - 播放音樂命令
const { SlashCommandBuilder } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('播放音樂')
    .addStringOption(option => 
      option.setName('query')
        .setDescription('歌曲名稱或URL')
        .setRequired(true)),
  
  async execute({ interaction, player }) {
    await interaction.deferReply();
    
    // 檢查使用者是否在語音頻道中
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      return interaction.followUp('您必須先加入語音頻道才能使用此命令。');
    }
    
    // 檢查機器人權限
    const permissions = voiceChannel.permissionsFor(interaction.client.user);
    if (!permissions.has('Connect') || !permissions.has('Speak')) {
      return interaction.followUp('我沒有在此語音頻道中連接或說話的權限！');
    }
    
    try {
      const query = interaction.options.getString('query');
      
      // 使用播放器搜索和播放音樂
      const searchResult = await player.search(query, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO
      });
      
      if (!searchResult || !searchResult.tracks.length) {
        return interaction.followUp('找不到符合的結果！');
      }
      
      // 創建一個隊列
      const queue = await player.nodes.create(interaction.guild, {
        metadata: {
          channel: interaction.channel,
          client: interaction.client
        },
        selfDeaf: true,
        volume: 80,
        leaveOnEmpty: true,
        leaveOnEnd: true,
      });
      
      // 連接到語音頻道
      try {
        if (!queue.connection) {
          await queue.connect(voiceChannel);
        }
      } catch (error) {
        player.nodes.delete(interaction.guildId);
        return interaction.followUp('無法加入您的語音頻道！');
      }
      
      // 添加歌曲並播放
      await interaction.followUp(`⏱️ 正在載入 ${searchResult.playlist ? '播放清單' : '歌曲'}...`);
      
      searchResult.playlist 
        ? queue.addTrack(searchResult.tracks)
        : queue.addTrack(searchResult.tracks[0]);
      
      if (!queue.node.isPlaying()) {
        await queue.node.play();
      }
    } catch (error) {
      console.error(error);
      return interaction.followUp('執行命令時發生錯誤: ' + error.message);
    }
  }
};
