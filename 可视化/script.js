// 全局变量
let literatureData = [];
let currentTab = 'citation';
let citationChart, heatmapChart, sankeyChart;

// 示例数据
const sampleData = [
    {
        id: 1,
        title: "深度学习在自然语言处理中的应用",
        authors: ["张三", "李四"],
        year: 2023,
        citations: 156,
        field: "人工智能",
        method: "深度学习",
        keywords: ["深度学习", "自然语言处理", "神经网络"],
        references: [2, 3, 5]
    },
    {
        id: 2,
        title: "机器学习算法优化研究",
        authors: ["王五", "赵六"],
        year: 2022,
        citations: 89,
        field: "机器学习",
        method: "优化算法",
        keywords: ["机器学习", "算法优化", "梯度下降"],
        references: [4, 6]
    },
    {
        id: 3,
        title: "计算机视觉中的卷积神经网络",
        authors: ["陈七", "刘八"],
        year: 2023,
        citations: 234,
        field: "计算机视觉",
        method: "卷积神经网络",
        keywords: ["计算机视觉", "CNN", "图像识别"],
        references: [2, 7]
    },
    {
        id: 4,
        title: "强化学习在游戏AI中的应用",
        authors: ["周九", "吴十"],
        year: 2021,
        citations: 67,
        field: "人工智能",
        method: "强化学习",
        keywords: ["强化学习", "游戏AI", "Q学习"],
        references: [8]
    },
    {
        id: 5,
        title: "大数据处理技术综述",
        authors: ["郑十一", "孙十二"],
        year: 2022,
        citations: 123,
        field: "大数据",
        method: "分布式计算",
        keywords: ["大数据", "分布式", "Hadoop"],
        references: [6, 9]
    },
    {
        id: 6,
        title: "云计算架构设计模式",
        authors: ["李十三", "张十四"],
        year: 2023,
        citations: 98,
        field: "云计算",
        method: "架构设计",
        keywords: ["云计算", "微服务", "容器化"],
        references: [10]
    },
    {
        id: 7,
        title: "区块链技术在金融领域的应用",
        authors: ["王十五", "赵十六"],
        year: 2022,
        citations: 145,
        field: "区块链",
        method: "分布式账本",
        keywords: ["区块链", "智能合约", "加密货币"],
        references: [5, 8]
    },
    {
        id: 8,
        title: "物联网安全协议研究",
        authors: ["陈十七", "刘十八"],
        year: 2021,
        citations: 76,
        field: "物联网",
        method: "安全协议",
        keywords: ["物联网", "安全", "加密"],
        references: [9]
    },
    {
        id: 9,
        title: "边缘计算在智慧城市中的应用",
        authors: ["周十九", "吴二十"],
        year: 2023,
        citations: 112,
        field: "边缘计算",
        method: "分布式处理",
        keywords: ["边缘计算", "智慧城市", "实时处理"],
        references: [6, 10]
    },
    {
        id: 10,
        title: "量子计算算法基础",
        authors: ["郑二一", "孙二二"],
        year: 2022,
        citations: 87,
        field: "量子计算",
        method: "量子算法",
        keywords: ["量子计算", "量子比特", "量子纠缠"],
        references: []
    }
];

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    setupDragAndDrop();
});

// 事件监听器
function initializeEventListeners() {
    document.getElementById('fileInput').addEventListener('change', handleFileUpload);
    document.getElementById('minCitations').addEventListener('input', function(e) {
        document.getElementById('minCitationsValue').textContent = e.target.value;
    });
}

// 拖拽上传
function setupDragAndDrop() {
    const uploadArea = document.getElementById('uploadArea');
    
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            processFile(files[0]);
        }
    });
}

// 文件上传处理
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        processFile(file);
    }
}

// 处理文件
function processFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const content = e.target.result;
            let data;
            
            if (file.name.endsWith('.json')) {
                data = JSON.parse(content);
            } else if (file.name.endsWith('.csv')) {
                data = parseCSV(content);
            } else {
                data = parseText(content);
            }
            
            literatureData = data;
            showVisualizations();
        } catch (error) {
            alert('文件格式错误，请检查文件内容');
        }
    };
    reader.readAsText(file);
}

// CSV解析
function parseCSV(content) {
    const lines = content.split('\n');
    const headers = lines[0].split(',');
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
            const values = lines[i].split(',');
            const item = {};
            headers.forEach((header, index) => {
                item[header.trim()] = values[index] ? values[index].trim() : '';
            });
            data.push(item);
        }
    }
    
    return data;
}

// 文本解析
function parseText(content) {
    // 简单的文本解析，假设每行是一篇文献
    const lines = content.split('\n').filter(line => line.trim());
    return lines.map((line, index) => ({
        id: index + 1,
        title: line.trim(),
        citations: Math.floor(Math.random() * 200),
        year: 2020 + Math.floor(Math.random() * 4),
        field: ['人工智能', '机器学习', '计算机视觉', '大数据'][Math.floor(Math.random() * 4)],
        method: ['深度学习', '机器学习', '数据挖掘', '统计分析'][Math.floor(Math.random() * 4)]
    }));
}

// 加载示例数据
function loadSampleData() {
    literatureData = sampleData;
    showVisualizations();
}

// 显示可视化
function showVisualizations() {
    document.getElementById('controls').style.display = 'flex';
    document.getElementById('visualizations').style.display = 'block';
    document.getElementById('statsPanel').style.display = 'block';
    
    updateStats();
    updateVisualizations();
}

// 更新统计信息
function updateStats() {
    const totalPapers = literatureData.length;
    const totalCitations = literatureData.reduce((sum, paper) => sum + (paper.citations || 0), 0);
    const avgCitations = totalPapers > 0 ? Math.round(totalCitations / totalPapers) : 0;
    const fields = [...new Set(literatureData.map(paper => paper.field).filter(Boolean))];
    
    document.getElementById('totalPapers').textContent = totalPapers;
    document.getElementById('totalCitations').textContent = totalCitations;
    document.getElementById('avgCitations').textContent = avgCitations;
    document.getElementById('topFields').textContent = fields.length;
}

// 切换标签页
function showTab(tabName) {
    // 更新标签按钮
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // 更新内容面板
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    document.getElementById(tabName + '-tab').classList.add('active');
    
    currentTab = tabName;
    
    // 重新渲染当前图表
    setTimeout(() => {
        if (tabName === 'citation') {
            createCitationNetwork();
        } else if (tabName === 'heatmap') {
            createHeatmap();
        } else if (tabName === 'sankey') {
            createSankeyDiagram();
        }
    }, 100);
}

// 更新可视化
function updateVisualizations() {
    if (currentTab === 'citation') {
        createCitationNetwork();
    } else if (currentTab === 'heatmap') {
        createHeatmap();
    } else if (currentTab === 'sankey') {
        createSankeyDiagram();
    }
}

// 创建引用关系网络图
function createCitationNetwork() {
    const container = document.getElementById('citationChart');
    container.innerHTML = '';
    
    const minCitations = parseInt(document.getElementById('minCitations').value);
    const filteredData = literatureData.filter(paper => (paper.citations || 0) >= minCitations);
    
    if (filteredData.length === 0) {
        container.innerHTML = '<div class="loading">没有符合条件的数据</div>';
        return;
    }
    
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    const svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    
    // 创建节点和链接数据
    const nodes = filteredData.map(paper => ({
        id: paper.id,
        title: paper.title,
        citations: paper.citations || 0,
        field: paper.field || '未知',
        year: paper.year || 2023
    }));
    
    const links = [];
    filteredData.forEach(paper => {
        if (paper.references) {
            paper.references.forEach(refId => {
                if (filteredData.find(p => p.id === refId)) {
                    links.push({
                        source: paper.id,
                        target: refId
                    });
                }
            });
        }
    });
    
    // 创建力导向图
    const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id).distance(100))
        .force('charge', d3.forceManyBody().strength(-300))
        .force('center', d3.forceCenter(width / 2, height / 2));
    
    // 创建链接
    const link = svg.append('g')
        .selectAll('line')
        .data(links)
        .enter().append('line')
        .attr('class', 'link')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6)
        .attr('stroke-width', 2);
    
    // 创建节点
    const node = svg.append('g')
        .selectAll('circle')
        .data(nodes)
        .enter().append('circle')
        .attr('class', 'node')
        .attr('r', d => Math.sqrt(d.citations) * 2 + 5)
        .attr('fill', d => getFieldColor(d.field))
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended));
    
    // 添加标签
    const label = svg.append('g')
        .selectAll('text')
        .data(nodes)
        .enter().append('text')
        .text(d => d.title.length > 20 ? d.title.substring(0, 20) + '...' : d.title)
        .attr('font-size', '10px')
        .attr('text-anchor', 'middle')
        .attr('dy', '.35em');
    
    // 添加工具提示
    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('visibility', 'hidden');
    
    node.on('mouseover', function(event, d) {
        tooltip.style('visibility', 'visible')
            .html(`<strong>${d.title}</strong><br/>引用数: ${d.citations}<br/>领域: ${d.field}<br/>年份: ${d.year}`);
    })
    .on('mousemove', function(event) {
        tooltip.style('top', (event.pageY - 10) + 'px')
            .style('left', (event.pageX + 10) + 'px');
    })
    .on('mouseout', function() {
        tooltip.style('visibility', 'hidden');
    });
    
    // 更新位置
    simulation.on('tick', () => {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);
        
        node
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);
        
        label
            .attr('x', d => d.x)
            .attr('y', d => d.y + 25);
    });
    
    // 拖拽函数
    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
    
    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }
    
    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}

// 创建热力图
function createHeatmap() {
    const container = document.getElementById('heatmapChart');
    
    if (!heatmapChart) {
        heatmapChart = echarts.init(container);
    }
    
    // 准备数据
    const fields = [...new Set(literatureData.map(paper => paper.field).filter(Boolean))];
    const years = [...new Set(literatureData.map(paper => paper.year).filter(Boolean))].sort();
    
    const data = [];
    fields.forEach((field, fieldIndex) => {
        years.forEach((year, yearIndex) => {
            const papers = literatureData.filter(paper => paper.field === field && paper.year === year);
            const totalCitations = papers.reduce((sum, paper) => sum + (paper.citations || 0), 0);
            data.push([yearIndex, fieldIndex, totalCitations]);
        });
    });
    
    const option = {
        title: {
            text: '领域热点分布',
            left: 'center',
            textStyle: {
                fontSize: 16,
                color: '#333'
            }
        },
        tooltip: {
            position: 'top',
            formatter: function(params) {
                return `${years[params.data[0]]}年<br/>${fields[params.data[1]]}<br/>总引用数: ${params.data[2]}`;
            }
        },
        grid: {
            height: '60%',
            top: '15%'
        },
        xAxis: {
            type: 'category',
            data: years,
            splitArea: {
                show: true
            },
            axisLabel: {
                color: '#666'
            }
        },
        yAxis: {
            type: 'category',
            data: fields,
            splitArea: {
                show: true
            },
            axisLabel: {
                color: '#666'
            }
        },
        visualMap: {
            min: 0,
            max: Math.max(...data.map(d => d[2])),
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: '5%',
            inRange: {
                color: ['#ffeaa7', '#fdcb6e', '#e17055', '#d63031']
            }
        },
        series: [{
            name: '引用热度',
            type: 'heatmap',
            data: data,
            label: {
                show: true,
                color: '#fff'
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };
    
    heatmapChart.setOption(option);
}

// 创建桑基图
function createSankeyDiagram() {
    const container = document.getElementById('sankeyChart');
    
    if (!sankeyChart) {
        sankeyChart = echarts.init(container);
    }
    
    // 准备数据
    const methods = [...new Set(literatureData.map(paper => paper.method).filter(Boolean))];
    const fields = [...new Set(literatureData.map(paper => paper.field).filter(Boolean))];
    
    const nodes = [
        ...methods.map(method => ({ name: method, category: 'method' })),
        ...fields.map(field => ({ name: field, category: 'field' }))
    ];
    
    const links = [];
    methods.forEach(method => {
        fields.forEach(field => {
            const papers = literatureData.filter(paper => paper.method === method && paper.field === field);
            if (papers.length > 0) {
                const totalCitations = papers.reduce((sum, paper) => sum + (paper.citations || 0), 0);
                links.push({
                    source: method,
                    target: field,
                    value: totalCitations
                });
            }
        });
    });
    
    const option = {
        title: {
            text: '方法-领域分布流向',
            left: 'center',
            textStyle: {
                fontSize: 16,
                color: '#333'
            }
        },
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove',
            formatter: function(params) {
                if (params.dataType === 'edge') {
                    return `${params.data.source} → ${params.data.target}<br/>引用数: ${params.data.value}`;
                } else {
                    return params.name;
                }
            }
        },
        series: {
            type: 'sankey',
            layout: 'none',
            emphasis: {
                focus: 'adjacency'
            },
            data: nodes,
            links: links,
            itemStyle: {
                borderWidth: 1,
                borderColor: '#aaa'
            },
            lineStyle: {
                color: 'gradient',
                curveness: 0.5
            },
            label: {
                color: '#333',
                fontSize: 12
            }
        }
    };
    
    sankeyChart.setOption(option);
}

// 获取领域颜色
function getFieldColor(field) {
    const colors = {
        '人工智能': '#ff3838',
        '机器学习': '#00d2d3',
        '计算机视觉': '#0984e3',
        '大数据': '#fdcb6e',
        '云计算': '#6c5ce7',
        '区块链': '#a29bfe',
        '物联网': '#fd79a8',
        '边缘计算': '#00b894',
        '量子计算': '#e17055',
        '未知': '#74b9ff'
    };
    return colors[field] || colors['未知'];
}

// 窗口大小改变时重新渲染图表
window.addEventListener('resize', function() {
    if (heatmapChart) heatmapChart.resize();
    if (sankeyChart) sankeyChart.resize();
    if (currentTab === 'citation') {
        setTimeout(createCitationNetwork, 100);
    }
});