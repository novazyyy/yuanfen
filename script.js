// 分析姓名
async function analyzeNames(name1, name2) {
    try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    {
                        role: "system",
                        content: `你是精通五行八字、姓名学的专业分析师。请按以下格式分析两人姓名：

【五行详解】
分析每个字的五行属性，解释其含义和特质。说明这些五行属性如何影响一个人的性格特点。

【匹配分析】
详细分析两人五行的相生相克关系。解释这种关系对二人感情的具体影响，包括优势和潜在问题。

【姻缘指导】
基于五行关系，给出具体的相处建议。说明如何利用五行特质互补，化解可能的矛盾。

注意：分析要专业、有理有据，让人信服。每段至少50字，总字数不超过300字。必须用【】标题。`
                    },
                    {
                        role: "user",
                        content: `请分析${name1}和${name2}的姓名五行属性和姻缘关系。要体现专业性，解释具体原因。`
                    }
                ],
                temperature: 0.7,
                max_tokens: 800,
                presence_penalty: 0.1,
                frequency_penalty: 0.1
            })
        });

        if (!response.ok) throw new Error('API请求失败');
        
        const data = await response.json();
        const content = data.choices[0].message.content;
        
        return content
            .split(/【(.+?)】/)
            .filter(text => text.trim())
            .map((text, index) => {
                if (index % 2 === 0) {
                    return `<h3 class="analysis-title">${text}</h3>`;
                } else {
                    return `<p class="analysis-paragraph">${text.trim()}</p>`;
                }
            })
            .join('');
    } catch (error) {
        console.error('分析失败:', error);
        return generateFallbackAnalysis(name1, name2);
    }
}

// 备用的本地分析函数（当API调用失败时使用）
function generateFallbackAnalysis(name1, name2) {
    const elements = ['金', '木', '水', '火', '土'];
    const name1Element = elements[Math.floor(Math.random() * elements.length)];
    const name2Element = elements[Math.floor(Math.random() * elements.length)];
    
    return `
${name1}和${name2}的姻缘分析：

五行属性：
${name1}的五行属性偏${name1Element}
${name2}的五行属性偏${name2Element}

五行关系分析：
从整体来看，${name1}以${name1Element}为主，${name2}以${name2Element}为主。
${analyzeWuxingCompatibility(name1Element, name2Element)}

整体评价：
你们的五行特质${name1Element}与${name2Element}形成了独特的组合，需要互相理解和包容，共同努力创造属于自己的平衡。
建议在日常生活中多关注对方的需求，用心经营这段感情。
    `;
}

// 五行相生相克关系分析
function analyzeWuxingCompatibility(element1, element2) {
    const relations = {
        '金木': '金克木，需要在生活中互相理解和包容。金的坚韧可以帮助木的成长，木的柔韧可以化解金的锋芒。',
        '金火': '火克金，双方需要注意沟通方式。火的热情可以软化金的刚硬，金的稳重可以平衡火的躁动。',
        '金水': '水生金，能够相互成就。水的滋润让金更显光华，金的沉稳让水更具方向。',
        '金土': '土生金，关系稳固。土的包容孕育着金的成长，金的坚韧回报着土的滋养。',
        '木火': '木生火，能激发彼此潜能。木的生机助长火的热情，火的温暖促进木的成长。',
        '木土': '土克木，要学会在矛盾中寻求平衡。土的厚重可以稳定木的根基，木的生机可以活化土的沉闷。',
        '木金': '金克木，需要用智慧化解分歧。金的坚韧和木的柔韧，在磨合中可以达到平衡。',
        '木水': '水生木，天作之合。水的滋养让木茁壮成长，木的生机让水充满活力。',
        '水火': '水克火，性格互补。水的包容可以中和火的锐气，火的热情可以温暖水的清冷。',
        '水土': '土生水，共同进步。土的包容孕育水的灵动，水的滋润让土更有生机。',
        '水金': '水生金，默契十足。水的柔和滋养着金的坚韧，金的沉稳指引着水的方向。',
        '水木': '水生木，感情和睦。水的滋养让木更显挺拔，木的生机让水更有意义。',
        '火金': '火克金，需要用爱化解分歧。火的热情可以软化金的刚硬，金的坚韧可以稳定火的躁动。',
        '火水': '水克火，互补性强。水的包容可以平衡火的激情，火的温暖可以活化水的平静。',
        '火木': '木生火，志同道合。木的生机助长火的热情，火的温暖促进木的成长。',
        '火土': '土克火，需要时间磨合。土的稳重可以平衡火的躁动，火的热情可以温暖土的沉闷。',
        '土金': '土生金，相得益彰。土的包容孕育着金的成长，金的坚韧回报着土的滋养。',
        '土水': '土生水，互相扶持。土的厚重孕育着水的灵动，水的滋润让土更有生机。',
        '土火': '土克火，需要互相理解。土的沉稳可以平衡火的躁动，火的热情可以温暖土的沉闷。',
        '土木': '土克木，需要用心经营。土的厚重可以稳定木的根基，木的生机可以活化土的沉闷。'
    };
    return relations[element1 + element2] || '五行相济，缘分深厚。你们的五行组合独特，需要共同努力创造属于自己的平衡。';
}

// 主函数
async function analyzeCompatibility() {
    const name1 = document.getElementById('name1').value.trim();
    const name2 = document.getElementById('name2').value.trim();
    
    if (!name1 || !name2) {
        alert('请输入双方姓名！');
        return;
    }

    document.getElementById('result').style.display = 'block';
    document.getElementById('analysis').innerHTML = '<div class="typing-effect">正在进行姻缘分析</div>';
    
    let dots = 0;
    const loadingInterval = setInterval(() => {
        dots = (dots + 1) % 4;
        document.getElementById('analysis').innerHTML = 
            `<div class="typing-effect">正在进行姻缘分析${''.padEnd(dots, '.')}</div>`;
    }, 500);
    
    try {
        const analysis = await analyzeNames(name1, name2);
        clearInterval(loadingInterval);

        // 彩蛋检查
        if ((name1 === '顾丽萍' && name2 === '杨嘉豪') || 
            (name2 === '顾丽萍' && name1 === '杨嘉豪')) {
            document.getElementById('score').innerHTML = `<span class="super-score">10000分</span>`;
            document.getElementById('analysis').innerHTML = `
                <div class="celebration">
                    <h3 class="analysis-title special-title">✨ 天作之合 ✨</h3>
                    ${analysis}
                    <div class="fireworks"></div>
                </div>
            `;
            startCelebration();
        } else {
            const score = Math.floor(Math.random() * 41) + 60;
            document.getElementById('score').innerHTML = `${score}分`;
            document.getElementById('analysis').innerHTML = analysis;
        }
    } catch (error) {
        clearInterval(loadingInterval);
        console.error('分析失败:', error);
        document.getElementById('analysis').innerHTML = '抱歉，分析过程出现错误，请稍后重试。';
    }
}

// 修改庆祝特效函数
function startCelebration() {
    // 创建全屏特效容器
    const effectContainer = document.createElement('div');
    effectContainer.className = 'effect-container';
    document.body.appendChild(effectContainer);

    // 添加烟花效果
    for (let i = 0; i < 30; i++) {
        const firework = document.createElement('div');
        firework.className = 'firework';
        firework.style.left = Math.random() * 100 + '%';
        firework.style.top = Math.random() * 100 + '%';
        firework.style.animationDelay = Math.random() * 3 + 's';
        firework.style.animationDuration = (Math.random() * 1 + 1) + 's';
        effectContainer.appendChild(firework);
    }

    // 添加闪烁的爱心
    for (let i = 0; i < 50; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerHTML = ['❤️', '💕', '💘', '💖'][Math.floor(Math.random() * 4)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 5 + 's';
        heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
        effectContainer.appendChild(heart);
    }

    // 添加彩带效果
    for (let i = 0; i < 100; i++) {
        const ribbon = document.createElement('div');
        ribbon.className = 'ribbon';
        ribbon.style.left = Math.random() * 100 + '%';
        ribbon.style.animationDelay = Math.random() * 5 + 's';
        ribbon.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        effectContainer.appendChild(ribbon);
    }

    // 添加闪光效果
    for (let i = 0; i < 40; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.animationDelay = Math.random() * 3 + 's';
        effectContainer.appendChild(sparkle);
    }

    // 添加祝福语
    const messages = ['天生一对', '佳偶天成', '珠联璧合', '白头偕老', '百年好合'];
    for (let i = 0; i < messages.length; i++) {
        const message = document.createElement('div');
        message.className = 'blessing-message';
        message.textContent = messages[i];
        message.style.animationDelay = (i * 0.5) + 's';
        effectContainer.appendChild(message);
    }
}

// 保持原有代码不变，只需确保 DEEPSEEK_API_KEY 正确
const DEEPSEEK_API_KEY = 'sk-cac1b5ec09b94dd597f37c82e9a1f905'; 