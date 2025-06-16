<template>
    <div class="help-doc-page">
        <header class="help-header">
            <h1>帮助中心</h1>
            <p class="subtitle">我们在这里为您解答疑问，助您轻松上手。</p>
        </header>

        <div class="help-content">
            <section class="faq-section">
                <h2>常见问题 (FAQ)</h2>
                <div class="faq-list">
                    <div v-for="(item, index) in faqList" :key="index" class="faq-item">
                        <div class="faq-question" @click="toggleFaq(index)">
                            <span>{{ item.question }}</span>
                            <span class="faq-icon" :class="{ 'is-active': activeFaqIndex === index }"></span>
                        </div>
                        <transition name="fade">
                            <div v-show="activeFaqIndex === index" class="faq-answer">
                                <p v-html="item.answer"></p>
                            </div>
                        </transition>
                    </div>
                </div>
            </section>

            <section class="contact-section">
                <h2>仍然需要帮助？</h2>
                <p>
                    如果在常见问题中没有找到您想要的答案，请随时通过以下方式联系我们的支持团队。
                </p>
                <div class="contact-info">
                    <p><strong>邮箱:</strong> <a href="mailto:support@example.com">support@example.com</a></p>
                    <p><strong>工作时间:</strong> 周一至周五, 9:00 AM - 6:00 PM</p>
                </div>
                <button class="contact-button" @click="contactSupport">联系技术支持</button>
            </section>
        </div>
    </div>
</template>

<script>
export default {
    name: "HelpDoc",
    data() {
        return {
            // 当前展开的FAQ项的索引，null表示全部折叠
            activeFaqIndex: null,
            // FAQ数据列表，您可以根据您的应用来修改这些内容
            faqList: [
                {
                    question: "1. 如何开始使用我们的平台？",
                    answer: "欢迎！您可以通过点击右上角的“注册”按钮创建一个新账户。完成注册后，我们建议您首先访问<b>“仪表盘”</b>页面，那里有引导您完成基本设置的向导。",
                },
                {
                    question: "2. 我忘记了密码，应该怎么办？",
                    answer: "请前往登录页面，点击“忘记密码”链接。然后根据提示输入您的注册邮箱，系统会发送一封包含密码重置链接的邮件给您。",
                },
                {
                    question: "3. 文件上传失败是什么原因？",
                    answer: "文件上传失败可能由以下几个原因导致：<br><ul><li>文件大小超过了限制（当前最大为 <b>1GB</b>）。</li><li>您的网络连接不稳定。</li><li>文件格式不被支持（支持格式: .jpg, .png, .pdf, .docx）。</li></ul>请检查后重试。",
                },
                {
                    question: "4. 在哪里可以修改我的个人设置？",
                    answer: "您可以点击页面顶部导航栏中的<b>“设置”</b>菜单项，进入设置页面。在这里，您可以修改您的个人资料、账户密码以及通知偏好等。",
                },
                {
                    question: "5. 平台支持哪些浏览器？",
                    answer: "我们建议使用最新版本的 <b>Google Chrome</b>, <b>Mozilla Firefox</b>, 或 <b>Microsoft Edge</b> 浏览器以获得最佳体验。",
                },
            ],
        };
    },
    methods: {
        // 点击问题时调用的方法
        toggleFaq(index) {
            // 如果点击的已经是展开的项，则折叠它，否则展开新点击的项
            this.activeFaqIndex = this.activeFaqIndex === index ? null : index;
        },
        // 联系支持按钮的点击事件
        contactSupport() {
            // 您可以替换为跳转到联系页面或弹出聊天窗口的逻辑
            window.location.href = "mailto:support@example.com";
        }
    },
};
</script>

<style scoped>
/* 动画效果 */
.fade-enter-active,
.fade-leave-active {
    transition: all 0.4s ease;
    max-height: 200px;
    /* 根据内容调整一个足够大的值 */
    opacity: 1;
}

.fade-enter,
.fade-leave-to {
    max-height: 0;
    opacity: 0;
    padding-top: 0;
    padding-bottom: 0;
    margin-top: 0;
}


/* 页面整体布局 */
.help-doc-page {
    padding: 20px 40px;
    background-color: #f9fafb;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #333;
}

.help-header {
    text-align: center;
    margin-bottom: 40px;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 20px;
}

.help-header h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1f2937;
}

.help-header .subtitle {
    font-size: 1.1rem;
    color: #6b7280;
    margin-top: 10px;
}

.help-content {
    max-width: 900px;
    margin: 0 auto;
}

/* 区域标题 */
h2 {
    font-size: 1.8rem;
    font-weight: 600;
    margin-bottom: 25px;
    color: #1f2937;
    padding-bottom: 10px;
    border-bottom: 2px solid #3b82f6;
    /* 主题色强调 */
    display: inline-block;
}

/* FAQ 列表样式 */
.faq-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.faq-item {
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    /* 防止子元素溢出圆角 */
    transition: box-shadow 0.3s ease;
}

.faq-item:hover {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.faq-question {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    cursor: pointer;
    font-size: 1.1rem;
    font-weight: 500;
    color: #111827;
}

.faq-icon {
    position: relative;
    width: 16px;
    height: 16px;
    transition: transform 0.4s ease;
}

.faq-icon::before,
.faq-icon::after {
    content: '';
    position: absolute;
    background-color: #3b82f6;
    width: 16px;
    height: 2px;
    top: 7px;
    left: 0;
    transition: transform 0.4s ease;
}

.faq-icon::after {
    transform: rotate(90deg);
}

.faq-icon.is-active {
    transform: rotate(135deg);
}

.faq-answer {
    padding: 0 20px 20px 20px;
    color: #4b5563;
    line-height: 1.7;
    overflow: hidden;
}

.faq-answer p {
    margin: 0;
}

/* 答案中的特殊样式 */
.faq-answer ::v-deep(b) {
    color: #3b82f6;
}

.faq-answer ::v-deep(ul) {
    padding-left: 20px;
    margin-top: 10px;
}

/* 联系我们区域 */
.contact-section {
    margin-top: 60px;
    padding: 30px;
    background-color: #ffffff;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    text-align: center;
}

.contact-section p {
    color: #4b5563;
    line-height: 1.6;
}

.contact-info {
    margin: 20px 0;
}

.contact-info p {
    margin: 5px 0;
}

.contact-button {
    background-color: #3b82f6;
    color: white;
    border: none;
    padding: 12px 25px;
    font-size: 1rem;
    font-weight: 500;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.contact-button:hover {
    background-color: #2563eb;
}
</style>