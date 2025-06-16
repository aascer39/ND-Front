<template>
    <div class="settings-page">
        <h1 class="page-title">系统监控与管理入口</h1>
        <div class="service-grid">
            <div class="service-card">
                <div class="service-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                    </svg>
                </div>
                <h2 class="service-title">Druid Monitor</h2>
                <p class="service-description">
                    阿里巴巴开源的数据库连接池和监控组件，提供强大的SQL监控功能。
                </p>
                <a :href="'http://localhost:8080/MikuNetDisk/druid'" target="_blank" class="service-button">
                    进入
                </a>
            </div>

            <div class="service-card">
                <div class="service-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 18V6h16v12H4zm6-10h4v8h-4z" />
                    </svg>
                </div>
                <h2 class="service-title">MinIO Console</h2>
                <p class="service-description">
                    一个高性能、S3兼容的对象存储服务，适用于私有云和混合云。
                </p>
                <a :href="services.minio.url" target="_blank" class="service-button">
                    进入
                </a>
            </div>

            <div class="service-card">
                <div class="service-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M21.58 11.23l-1.06-1.06a1.5 1.5 0 0 0-2.12 0L17 11.59V8.5a1.5 1.5 0 0 0-1.5-1.5H13V5.5c0-.83-.67-1.5-1.5-1.5S10 4.67 10 5.5v1.5H8.5a1.5 1.5 0 0 0-1.5 1.5v3.09L5.6 9.17a1.5 1.5 0 0 0-2.12 0L2.42 11.23a1.5 1.5 0 0 0 0 2.12l1.06 1.06a1.5 1.5 0 0 0 2.12 0L7 13.01v3.09a1.5 1.5 0 0 0 1.5 1.5H10v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1.5a1.5 1.5 0 0 0 1.5-1.5v-3.09l1.41 1.41a1.5 1.5 0 0 0 2.12 0l1.06-1.06a1.5 1.5 0 0 0 0-2.12z" />
                    </svg>
                </div>
                <h2 class="service-title">RabbitMQ Management</h2>
                <p class="service-description">
                    一个稳定、可靠、功能强大的消息代理，实现了高级消息队列协议 (AMQP)。
                </p>
                <a :href="services.rabbitmq.url" target="_blank" class="service-button">
                    进入
                </a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Setting",
    data() {
        return {
            services: {
                druid: {
                    // 请将此URL替换为您的Druid监控页面的实际地址
                    url: "http://localhost:8081/druid/index.html",
                },
                minio: {
                    // 请将此URL替换为您的MinIO控制台的实际地址
                    url: "http://localhost:9001",
                },
                rabbitmq: {
                    // 请将此URL替换为您的RabbitMQ管理插件的实际地址
                    url: "http://localhost:15672",
                },
            },
        };
    },
};
</script>

<style scoped>
.settings-page {
    padding: 40px;
    background-color: #f4f7f6;
    min-height: 100vh;
    font-family: 'Helvetica Neue', Arial, sans-serif;
}

.page-title {
    text-align: center;
    margin-bottom: 40px;
    color: #333;
    font-size: 2.5rem;
    font-weight: 300;
}

.service-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    max-width: 1200px;
    margin: 0 auto;
}

.service-card {
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    padding: 30px;
    text-align: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.service-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.service-icon {
    margin-bottom: 20px;
}

.service-icon svg {
    width: 60px;
    height: 60px;
    color: #007bff;
    /* 主题颜色，可以替换 */
}

/* 为不同卡片设置不同颜色 */
.service-card:nth-child(2) .service-icon svg {
    color: #28a745;
}

.service-card:nth-child(3) .service-icon svg {
    color: #ff8c00;
}

.service-title {
    font-size: 1.5rem;
    font-weight: 500;
    margin-bottom: 15px;
    color: #343a40;
}

.service-description {
    font-size: 1rem;
    color: #6c757d;
    line-height: 1.6;
    margin-bottom: 25px;
    flex-grow: 1;
    /* 让描述部分占据多余空间，使按钮对齐 */
}

.service-button {
    display: inline-block;
    padding: 12px 24px;
    background-color: #007bff;
    color: #ffffff;
    text-decoration: none;
    border-radius: 5px;
    font-size: 1rem;
    font-weight: bold;
    transition: background-color 0.3s ease;
    border: none;
    cursor: pointer;
}

.service-button:hover {
    background-color: #0056b3;
}

/* 更改不同按钮的颜色 */
.service-card:nth-child(2) .service-button {
    background-color: #28a745;
}

.service-card:nth-child(2) .service-button:hover {
    background-color: #218838;
}

.service-card:nth-child(3) .service-button {
    background-color: #ff8c00;
}

.service-card:nth-child(3) .service-button:hover {
    background-color: #e67e00;
}
</style>