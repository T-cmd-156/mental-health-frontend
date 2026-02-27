<template>
  <div class="music-therapy">
    <header class="page-header">
      <h1 class="page-title">音乐调节</h1>
      <p class="page-subtitle">聆听舒缓音乐，放松身心，调节情绪</p>
    </header>
    <div class="page-content">
      <div class="music-layout">
        <div class="music-main">
          <div class="player-section">
            <div class="album-cover">
              <img v-if="currentMusic" :src="currentMusic.cover" :alt="currentMusic.title" />
              <div v-else class="cover-placeholder">
                <el-icon class="placeholder-icon"><Headset /></el-icon>
              </div>
            </div>

            <div v-if="currentMusic" class="music-info">
              <h2 class="music-title">{{ currentMusic.title }}</h2>
              <div class="music-meta">
                <span class="meta-item">
                  <el-icon><User /></el-icon>
                  {{ currentMusic.artist }}
                </span>
                <span class="meta-item">
                  <el-icon><Collection /></el-icon>
                  {{ currentMusic.category }}
                </span>
                <span class="meta-item">
                  <el-icon><Timer /></el-icon>
                  {{ formatDuration(currentMusic.duration) }}
                </span>
              </div>
              <p class="music-description">{{ currentMusic.description }}</p>
            </div>

            <div class="player-controls">
              <div class="progress-section">
                <span class="time-display">{{ formatTime(currentTime) }}</span>
                <div class="progress-bar" @click="seekTo">
                  <div class="progress-fill" :style="{ width: progress + '%' }"></div>
                </div>
                <span class="time-display">{{ formatTime(duration) }}</span>
              </div>

              <div class="control-buttons">
                <el-button circle @click="previousMusic">
                  <el-icon><DArrowLeft /></el-icon>
                </el-button>
                <el-button circle size="large" type="primary" @click="togglePlay">
                  <el-icon v-if="isPlaying"><VideoPause /></el-icon>
                  <el-icon v-else><VideoPlay /></el-icon>
                </el-button>
                <el-button circle @click="nextMusic">
                  <el-icon><DArrowRight /></el-icon>
                </el-button>
              </div>

              <div class="volume-control">
                <el-icon v-if="isMuted" @click="toggleMute"><MuteNotification /></el-icon>
                <el-icon v-else @click="toggleMute"><BellFilled /></el-icon>
                <el-slider
                  v-model="volume"
                  :min="0"
                  :max="100"
                  @input="onVolumeChange"
                  class="volume-slider"
                />
              </div>
            </div>

            <div class="music-actions">
              <el-button @click="toggleFavorite">
                <el-icon><Star /></el-icon>
                {{ currentMusic?.isFavorite ? '已收藏' : '收藏' }}
              </el-button>
              <el-button @click="addToPlaylist">
                <el-icon><Plus /></el-icon>
                添加到播放列表
              </el-button>
              <el-button @click="downloadMusic">
                <el-icon><Download /></el-icon>
                下载
              </el-button>
            </div>
          </div>

          <div class="emotion-section">
            <h3 class="section-title">情绪选择</h3>
            <div class="emotion-tags">
              <el-tag
                v-for="emotion in emotions"
                :key="emotion.value"
                :type="selectedEmotion === emotion.value ? 'primary' : ''"
                :effect="selectedEmotion === emotion.value ? 'dark' : 'plain'"
                size="large"
                @click="selectEmotion(emotion.value)"
                class="emotion-tag"
              >
                <el-icon><component :is="emotion.icon" /></el-icon>
                {{ emotion.label }}
              </el-tag>
            </div>
          </div>
        </div>

        <div class="music-sidebar">
          <div class="sidebar-section">
            <h3 class="section-title">播放列表</h3>
            <div class="playlist">
              <div
                v-for="(music, index) in playlist"
                :key="music.id"
                class="playlist-item"
                :class="{ active: currentMusic && currentMusic.id === music.id }"
                @click="playMusic(index)"
              >
                <div class="music-index">
                  <el-icon v-if="currentMusic && currentMusic.id === music.id && isPlaying">
                    <VideoPlay />
                  </el-icon>
                  <span v-else>{{ index + 1 }}</span>
                </div>
                <div class="music-item-cover">
                  <img v-if="music.cover" :src="music.cover" :alt="music.title" />
                  <div v-else class="cover-placeholder-small">
                    <el-icon><Headset /></el-icon>
                  </div>
                </div>
                <div class="music-item-info">
                  <div class="music-item-title">{{ music.title }}</div>
                  <div class="music-item-artist">{{ music.artist }}</div>
                </div>
                <div class="music-item-duration">{{ formatDuration(music.duration) }}</div>
              </div>
            </div>
          </div>

          <div class="sidebar-section">
            <h3 class="section-title">推荐音乐</h3>
            <div class="recommendations">
              <div
                v-for="music in recommendations"
                :key="music.id"
                class="recommendation-item"
                @click="playRecommendation(music)"
              >
                <div class="recommendation-cover">
                  <img v-if="music.cover" :src="music.cover" :alt="music.title" />
                  <div v-else class="cover-placeholder-small">
                    <el-icon><Headset /></el-icon>
                  </div>
                  <el-icon class="play-overlay"><VideoPlay /></el-icon>
                </div>
                <div class="recommendation-info">
                  <div class="recommendation-title">{{ music.title }}</div>
                  <div class="recommendation-artist">{{ music.artist }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getMusicList, getMusicByEmotion } from '@/api/selfHelp'
import { Headset, User, Collection, Timer, VideoPlay, VideoPause, DArrowLeft, DArrowRight, MuteNotification, BellFilled, Star, Plus, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const audioRef = ref(null)
const currentMusic = ref(null)
const playlist = ref([])
const recommendations = ref([])
const isPlaying = ref(false)
const isMuted = ref(false)
const volume = ref(80)
const currentTime = ref(0)
const duration = ref(0)
const selectedEmotion = ref('')

const emotions = [
  { value: 'relax', label: '放松', icon: 'Sunny' },
  { value: 'happy', label: '愉悦', icon: 'Sunny' },
  { value: 'calm', label: '平静', icon: 'Moon' },
  { value: 'focus', label: '专注', icon: 'Sunny' },
  { value: 'sleep', label: '助眠', icon: 'Moon' },
  { value: 'energy', label: '活力', icon: 'Sunny' }
]

const progress = computed(() => {
  if (duration.value === 0) return 0
  return (currentTime.value / duration.value) * 100
})

function playMusic(index) {
  currentMusic.value = playlist.value[index]
  isPlaying.value = true
  currentTime.value = 0
}

function togglePlay() {
  isPlaying.value = !isPlaying.value
}

function previousMusic() {
  if (!currentMusic.value) return
  const index = playlist.value.findIndex(m => m.id === currentMusic.value.id)
  if (index > 0) {
    playMusic(index - 1)
  }
}

function nextMusic() {
  if (!currentMusic.value) return
  const index = playlist.value.findIndex(m => m.id === currentMusic.value.id)
  if (index < playlist.value.length - 1) {
    playMusic(index + 1)
  }
}

function seekTo(event) {
  const rect = event.currentTarget.getBoundingClientRect()
  const percent = (event.clientX - rect.left) / rect.width
  currentTime.value = percent * duration.value
}

function onVolumeChange(value) {
  isMuted.value = value === 0
}

function toggleMute() {
  isMuted.value = !isMuted.value
  volume.value = isMuted.value ? 0 : 80
}

function toggleFavorite() {
  if (currentMusic.value) {
    currentMusic.value.isFavorite = !currentMusic.value.isFavorite
    ElMessage.success(currentMusic.value.isFavorite ? '已收藏' : '已取消收藏')
  }
}

function addToPlaylist() {
  if (currentMusic.value) {
    ElMessage.success('已添加到播放列表')
  }
}

function downloadMusic() {
  if (currentMusic.value) {
    ElMessage.success('开始下载音乐')
  }
}

function selectEmotion(emotion) {
  selectedEmotion.value = emotion
  getMusicByEmotion(emotion).then(res => {
    playlist.value = res || []
    if (playlist.value.length > 0) {
      playMusic(0)
    }
  })
}

function playRecommendation(music) {
  const index = playlist.value.findIndex(m => m.id === music.id)
  if (index >= 0) {
    playMusic(index)
  } else {
    playlist.value.unshift(music)
    playMusic(0)
  }
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

onMounted(() => {
  getMusicList().then(res => {
    playlist.value = res || []
    recommendations.value = res?.slice(0, 6) || []
    if (playlist.value.length > 0) {
      playMusic(0)
    }
  })
})
</script>

<style scoped>
.music-therapy {
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.page-header {
  background: linear-gradient(135deg, #1e4f9c 0%, #2d5fb4 100%);
  color: white;
  padding: 40px 30px;
  text-align: center;
  border-radius: 8px;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.page-title {
  font-size: 32px;
  font-weight: bold;
  margin: 0 0 10px 0;
  letter-spacing: 2px;
}

.page-subtitle {
  font-size: 16px;
  margin: 0;
  opacity: 0.9;
}

.page-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
}

.music-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 30px;
}

.music-main {
  min-width: 0;
}

.player-section {
  margin-bottom: 30px;
}

.album-cover {
  width: 100%;
  max-width: 400px;
  margin: 0 auto 24px;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.album-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #e8f4fd 0%, #d4e9f7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-icon {
  font-size: 80px;
  color: #1e4f9c;
}

.music-info {
  text-align: center;
  margin-bottom: 24px;
}

.music-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
}

.music-meta {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 14px;
}

.music-description {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.player-controls {
  margin-bottom: 24px;
}

.progress-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.time-display {
  min-width: 50px;
  text-align: center;
  font-size: 14px;
  color: #666;
  font-family: monospace;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: #e8e8e8;
  border-radius: 3px;
  cursor: pointer;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #1e4f9c 0%, #2d5fb4 100%);
  border-radius: 3px;
  transition: width 0.1s linear;
}

.control-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 20px;
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 300px;
  margin: 0 auto;
}

.volume-slider {
  flex: 1;
}

.music-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.emotion-section {
  margin-top: 30px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #1e4f9c;
}

.emotion-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.emotion-tag {
  padding: 12px 20px;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.emotion-tag:hover {
  transform: translateY(-2px);
}

.music-sidebar {
  min-width: 0;
}

.sidebar-section {
  margin-bottom: 30px;
}

.playlist {
  max-height: 400px;
  overflow-y: auto;
}

.playlist-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.playlist-item:hover {
  border-color: #1e4f9c;
  background: #f8f9fa;
}

.playlist-item.active {
  border-color: #1e4f9c;
  background: #e8f4fd;
}

.music-index {
  width: 24px;
  text-align: center;
  font-size: 14px;
  color: #666;
}

.music-item-cover {
  width: 48px;
  height: 48px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
}

.music-item-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-placeholder-small {
  width: 100%;
  height: 100%;
  background: #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

.music-item-info {
  flex: 1;
  min-width: 0;
}

.music-item-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.music-item-artist {
  font-size: 12px;
  color: #666;
}

.music-item-duration {
  font-size: 12px;
  color: #666;
}

.recommendations {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.recommendation-item {
  cursor: pointer;
  transition: all 0.2s ease;
}

.recommendation-item:hover {
  transform: translateY(-2px);
}

.recommendation-cover {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 8px;
}

.recommendation-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.play-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 32px;
  color: white;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.recommendation-item:hover .play-overlay {
  opacity: 1;
}

.recommendation-info {
  text-align: center;
}

.recommendation-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recommendation-artist {
  font-size: 12px;
  color: #666;
}
</style>