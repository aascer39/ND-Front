<template>
  <div class="app-download-page">
    <div class="app-download-container">
      <div class="title-section">
        <h1>下载 MikuNetDisk 客户端</h1>
        <p>随时随地，畅享云端服务</p>
      </div>
      <el-row :gutter="40" class="platform-section">
        <el-col v-for="platform in platforms" :key="platform.name" :xs="24" :sm="12" class="platform-col">
          <el-card class="platform-card">
            <div class="card-content">
              <component :is="platform.icon" :size="56" class="platform-icon" />
              <h2>{{ platform.name }}</h2>
              <div class="qr-code">
                <img :src="platform.qrCodeUrl" :alt="`${platform.name} QR Code`">
              </div>
              <p class="scan-tip">扫描二维码或点击按钮下载</p>
              <el-button :type="platform.buttonType" round class="download-button" @click="handleDownload(platform)">
                <component :is="platform.buttonIcon" :size="16" style="margin-right: 8px;" />
                {{ platform.buttonText }}
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { shallowRef, type Component } from 'vue';
import type { ButtonType } from 'element-plus';
// 导入 Element Plus 的消息提示和加载服务（如果需要）
import { ElMessage, ElLoading } from 'element-plus';
import { Laptop, Smartphone, Download } from 'lucide-vue-next'; // 确保您已安装 lucide-vue-next

// 1. 定义一个清晰的接口来描述平台对象的数据结构
interface PlatformInfo {
  name: string;
  icon: Component;
  qrCodeUrl: string;
  buttonText: string;
  buttonType: ButtonType;
  buttonIcon: Component;
  downloadLink: string;
}

// 2. 定义 platforms 数组，其中包含各个平台的信息
const platforms = shallowRef<PlatformInfo[]>([
  {
    name: 'Windows 10 / 11',
    icon: Laptop,
    qrCodeUrl: 'https://g.alicdn.com/go/lark-static/qrcode-2.0.2/img/qr-code-bg.png', // 示例 QR 码
    buttonText: '下载 Windows 版',
    buttonType: 'primary',
    buttonIcon: Download,
    downloadLink: 'https://example.com/MikuNetDisk_Setup.exe' // 替换为您的 Windows 下载链接
  },
  {
    name: 'Android 版',
    icon: Smartphone,
    // 原神安卓版下载链接
    qrCodeUrl: '/androidDownloadQR.jpg', 
    buttonText: '下载 Android APK',
    buttonType: 'success',
    buttonIcon: Download,
    downloadLink: 'https://ys-api.mihoyo.com/event/download_porter/link/ys_cn/official/android_default' // 替换为您的 Android 下载链接
  }
]);

/**
 * 处理下载逻辑的函数。
 * 具有高度可扩展性，可根据平台类型、用户环境等执行不同操作。
 */
const handleDownload = async (platform: PlatformInfo) => {
  console.log(`点击了下载按钮：${platform.name}`);
  ElLoading.service({ fullscreen: true, text: `正在准备 ${platform.name} 下载...` }); // 示例：显示加载动画

  try {
    // 您可以在这里添加下载前的逻辑，例如：
    // 1. **发送下载统计请求**
    // await fetch('/api/logDownload', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ platform: platform.name, userId: 'someUserId' })
    // });
    // console.log('下载统计已发送');
    // ElMessage.success('下载请求已记录！');


    // 2. **根据平台名称执行不同的下载行为**
    if (platform.name === 'Android 版') {
      // 检查是否在微信内浏览器，如果是，提示在外部浏览器打开
      const userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.includes('micromessenger')) {
        alert('请在浏览器中打开此页面以下载 Android APK。');
        // ElMessage.warning('请在浏览器中打开此页面以下载 Android APK。'); // 如果引入了 ElMessage
        return; // 阻止后续下载操作
      }

      // 对于 Android APK，通常直接触发文件下载
      const link = document.createElement('a');
      link.href = platform.downloadLink;
      link.download = 'MikuNetDisk_Android.apk'; // 指定下载时的文件名
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // ElMessage.success('Android APK 下载已开始！');

    } else if (platform.name === 'iOS 版 (App Store)') {
      // 对于 iOS，直接跳转到 App Store 链接
      window.open(platform.downloadLink, '_blank'); // 通常在新标签页打开 App Store
      // ElMessage.info('已为您跳转至 App Store。');

    } else if (platform.name === 'Windows 10 / 11' || platform.name === 'macOS') {
      // 对于桌面客户端，也通常直接触发文件下载
      const link = document.createElement('a');
      link.href = platform.downloadLink;
      // 根据平台设置不同的文件名
      if (platform.name === 'Windows 10 / 11') {
        link.download = 'MikuNetDisk_Setup.exe';
      } else if (platform.name === 'macOS') {
        link.download = 'MikuNetDisk.dmg';
      }
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // ElMessage.success(`${platform.name} 下载已开始！`);

    } else {
      // 默认处理：如果遇到其他未知平台，直接在新窗口打开下载链接
      window.open(platform.downloadLink, '_blank');
      // ElMessage.info('已为您打开下载链接。');
    }
  } catch (error) {
    console.error('下载处理失败:', error);
    // ElMessage.error('下载失败，请稍后再试。');
  } finally {
    ElLoading.service().close(); // 示例：关闭加载动画
  }
};
</script>

<style scoped>
/*
  以下是组件的样式部分，保持不变
  这些样式确保了下载页面的美观和响应性
*/
.app-download-page {
  /* 新增渐变背景 */
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 60px 20px;
  min-height: calc(100vh - 128px);
  /* 减去页头页脚高度 */
}

.app-download-container {
  max-width: 960px;
  margin: 0 auto;
  text-align: center;
}

.title-section {
  margin-bottom: 60px;
}

.title-section h1 {
  font-size: 40px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 12px;
}

.title-section p {
  font-size: 18px;
  color: #576574;
}

.platform-section {
  justify-content: center;
}

.platform-col {
  margin-bottom: 40px;
}

.platform-card {
  /* 毛玻璃效果 */
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  /* 确保圆角生效 */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.platform-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15);
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
}

.platform-icon {
  color: #34495e;
  margin-bottom: 24px;
}

.card-content h2 {
  font-size: 26px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 20px 0;
}

.qr-code {
  width: 160px;
  height: 160px;
  padding: 8px;
  border: 1px solid #e4e7ed;
  border-radius: 12px;
  margin-bottom: 16px;
  background-color: #fff;
}

.qr-code img {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.scan-tip {
  color: #8492a6;
  font-size: 14px;
  margin-bottom: 24px;
}

.download-button {
  font-size: 16px;
  padding: 18px 30px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .title-section h1 {
    font-size: 32px;
  }

  .platform-section {
    flex-direction: column;
    align-items: center;
  }

  .el-col-sm-12 {
    max-width: 100%;
    width: 100%;
  }
}
</style>