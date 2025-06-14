<template>
    <div class="home-container">
      <div class="hero-section">
        <div class="hero-content">
          <h1 class="main-headline">MikuNetDisk</h1>
          <h2 class="sub-headline">安全、高速、稳定的个人云存储</h2>
          <p class="description">
            随时随地存储、备份和访问您的文件、照片与视频。开启智能云盘新体验。
          </p>
          <el-button type="primary" size="large" class="cta-button" @click="goToRegister">
            立即注册，领取 100GB 免费空间
          </el-button>
        </div>
        <div class="hero-image">
          <img src="/TheBirthofGramophoneLuka.jpg" alt="Cloud Storage Illustration">
        </div>
      </div>
  
      <div class="features-section">
        <h3 class="section-title">核心功能</h3>
        <el-row :gutter="40">
          <el-col :xs="24" :sm="12" :md="6" class="feature-col">
            <el-card shadow="hover" class="feature-card">
              <div class="feature-icon">
                <el-icon :size="40" color="#409EFC"><UploadFilled /></el-icon>
              </div>
              <h4>极速传输</h4>
              <p>享受不限速的上传下载体验，大文件秒传，节省宝贵时间。</p>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" class="feature-col">
            <el-card shadow="hover" class="feature-card">
              <div class="feature-icon">
                <el-icon :size="40" color="#67C23A"><Lock /></el-icon>
                </div>
              <h4>安全可靠</h4>
              <p>采用银行级加密技术，全方位守护您的数据隐私与文件安全。</p>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" class="feature-col">
            <el-card shadow="hover" class="feature-card">
              <div class="feature-icon">
                <el-icon :size="40" color="#E6A23C"><Platform /></el-icon>
              </div>
              <h4>多端同步</h4>
              <p>支持手机、电脑、平板随时访问，文件自动同步，无缝衔接。</p>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" class="feature-col">
            <el-card shadow="hover" class="feature-card">
              <div class="feature-icon">
                <el-icon :size="40" color="#F56C6C"><View /></el-icon>
              </div>
              <h4>在线预览</h4>
              <p>支持多种格式的文档、音视频在线播放与预览，无需下载。</p>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { useRouter } from 'vue-router';
  import { Lock } from '@element-plus/icons-vue';
  
  const router = useRouter();
  
  const goToRegister = () => {
    // 跳转到注册页面，假设您的注册页路由为 /register
    router.push('/register');
  };
  </script>
  
  <style scoped>
  .home-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  /* Hero Section Styles */
  .hero-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 80px 0;
    min-height: calc(100vh - 250px); /* 视口高度减去页头页脚的大致高度 */
  }
  
  .hero-content {
    flex: 1;
    max-width: 50%;
  }
  
  .main-headline {
    font-size: 48px;
    font-weight: bold;
    color: #303133;
    margin-bottom: 16px;
  }
  
  .sub-headline {
    font-size: 28px;
    color: #606266;
    margin-bottom: 24px;
  }
  
  .description {
    font-size: 16px;
    color: #909399;
    line-height: 1.8;
    margin-bottom: 40px;
  }
  
  .cta-button {
    font-size: 18px;
    padding: 20px 40px;
  }
  
  .hero-image {
    flex: 1;
    text-align: right;
  }
  
  .hero-image img {
    max-width: 100%;
    height: auto;
  }
  
  /* Features Section Styles */
  .features-section {
    padding: 60px 0;
    text-align: center;
  }
  
  .section-title {
    font-size: 32px;
    font-weight: bold;
    color: #303133;
    margin-bottom: 50px;
  }
  
  .feature-col {
    margin-bottom: 20px;
  }
  
  .feature-card {
    border: 1px solid #e4e7ed;
    transition: all 0.3s ease;
  }
  
  .feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  }
  
  .feature-icon {
    margin-bottom: 20px;
  }
  
  .feature-card h4 {
    font-size: 20px;
    color: #303133;
    margin-bottom: 12px;
  }
  
  .feature-card p {
    font-size: 14px;
    color: #909399;
    line-height: 1.6;
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .hero-section {
      flex-direction: column;
      text-align: center;
      padding: 40px 0;
    }
  
    .hero-content {
      max-width: 100%;
      order: 2; /* 让内容显示在图片下方 */
    }
  
    .hero-image {
      order: 1; /* 让图片显示在内容上方 */
      margin-bottom: 40px;
    }
  }
  </style>