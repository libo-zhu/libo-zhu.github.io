// 项目数据（可扩展）
const projects = [
    {
        id: 1,
        title: "铜韵慧识",
        category: "AI+文化遗产",
        description: "国家级创新创业项目，构建古青铜智能鉴定与学习平台",
        tech: ["PyTorch", "3D重建", "Flask", "MySQL"],
        images: [
            "assets/project1/1.jpg", 
            "assets/project1/2.png"
        ],
        details: `技术实现：
            • 基于ResNet-50改进的青铜器分类模型（准确率92.3%）
            • NeRF三维重建误差<0.5mm
            <!-- 其他技术细节 -->`
    },
    // 其他项目...
];

// 动态生成项目卡片
function renderProjects() {
    const container = document.getElementById('projectContainer');
    
    projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <h3>${project.title}</h3>
            <div class="tech-tags">
                ${project.tech.map(t => `<span>${t}</span>`).join('')}
            </div>
            <p>${project.description}</p>
            <a href="projects/project${project.id}.html" class="cta-button">
                查看详情 →
            </a>
        `;
        container.appendChild(card);
    });
}

// 页面初始化
document.addEventListener('DOMContentLoaded', renderProjects);