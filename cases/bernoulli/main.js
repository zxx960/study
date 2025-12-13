// 伯努利原理演示 - Three.js 实现
// 展示流体通过文丘里管时的速度和压强变化

class BernoulliDemo {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.particles = [];
        this.tube = null;
        this.pressureIndicators = [];
        
        // 参数
        this.flowSpeed = 1.5;
        this.particleCount = 150;
        this.constriction = 0.5;
        
        // 管道参数
        this.tubeLength = 20;
        this.wideRadius = 2;
        this.narrowRadius = 1;
        
        this.init();
        this.createScene();
        this.setupControls();
        this.animate();
    }
    
    init() {
        // 创建场景
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);
        
        // 创建相机
        this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 8, 15);
        this.camera.lookAt(0, 0, 0);
        
        // 创建渲染器
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('canvas'),
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // 添加光源
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 20, 10);
        this.scene.add(directionalLight);
        
        const pointLight = new THREE.PointLight(0x4fc3f7, 0.5);
        pointLight.position.set(-10, 5, 5);
        this.scene.add(pointLight);
        
        // 轨道控制器
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 50;
        
        // 窗口大小调整
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    createScene() {
        this.createTube();
        this.createParticles();
        this.createPressureIndicators();
        this.createGrid();
        this.createLabels();
    }
    
    // 获取管道在某个x位置的半径
    getTubeRadius(x) {
        const narrowStart = -3;
        const narrowEnd = 3;
        const transitionLength = 2;
        
        this.narrowRadius = this.wideRadius * this.constriction;
        
        if (x < narrowStart - transitionLength) {
            return this.wideRadius;
        } else if (x < narrowStart) {
            const t = (x - (narrowStart - transitionLength)) / transitionLength;
            return this.wideRadius + (this.narrowRadius - this.wideRadius) * this.smoothstep(t);
        } else if (x < narrowEnd) {
            return this.narrowRadius;
        } else if (x < narrowEnd + transitionLength) {
            const t = (x - narrowEnd) / transitionLength;
            return this.narrowRadius + (this.wideRadius - this.narrowRadius) * this.smoothstep(t);
        } else {
            return this.wideRadius;
        }
    }
    
    smoothstep(t) {
        return t * t * (3 - 2 * t);
    }
    
    // 获取某位置的流速（基于连续性方程）
    getVelocityAtX(x) {
        const radius = this.getTubeRadius(x);
        const area = Math.PI * radius * radius;
        const wideArea = Math.PI * this.wideRadius * this.wideRadius;
        // v1 * A1 = v2 * A2 (连续性方程)
        return (wideArea / area) * this.flowSpeed;
    }
    
    createTube() {
        // 移除旧管道
        if (this.tube) {
            this.scene.remove(this.tube);
        }
        if (this.tubeInner) {
            this.scene.remove(this.tubeInner);
        }
        
        // 创建管道形状
        const segments = 100;
        const radialSegments = 32;
        
        // 外管（透明）
        const outerGeometry = new THREE.BufferGeometry();
        const positions = [];
        const indices = [];
        const normals = [];
        
        for (let i = 0; i <= segments; i++) {
            const x = -this.tubeLength / 2 + (i / segments) * this.tubeLength;
            const radius = this.getTubeRadius(x);
            
            for (let j = 0; j <= radialSegments; j++) {
                const theta = (j / radialSegments) * Math.PI * 2;
                const px = x;
                const py = Math.cos(theta) * radius;
                const pz = Math.sin(theta) * radius;
                
                positions.push(px, py, pz);
                
                // 法线
                const nx = 0;
                const ny = Math.cos(theta);
                const nz = Math.sin(theta);
                normals.push(nx, ny, nz);
            }
        }
        
        // 创建索引
        for (let i = 0; i < segments; i++) {
            for (let j = 0; j < radialSegments; j++) {
                const a = i * (radialSegments + 1) + j;
                const b = a + radialSegments + 1;
                const c = a + 1;
                const d = b + 1;
                
                indices.push(a, b, c);
                indices.push(b, d, c);
            }
        }
        
        outerGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        outerGeometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        outerGeometry.setIndex(indices);
        
        const tubeMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x4fc3f7,
            transparent: true,
            opacity: 0.2,
            side: THREE.DoubleSide,
            roughness: 0.1,
            metalness: 0.1,
            clearcoat: 1.0
        });
        
        this.tube = new THREE.Mesh(outerGeometry, tubeMaterial);
        this.scene.add(this.tube);
        
        // 添加管道边缘线
        const edgeMaterial = new THREE.LineBasicMaterial({ 
            color: 0x4fc3f7, 
            transparent: true, 
            opacity: 0.5 
        });
        
        // 上边缘
        const topEdgePoints = [];
        const bottomEdgePoints = [];
        for (let i = 0; i <= segments; i++) {
            const x = -this.tubeLength / 2 + (i / segments) * this.tubeLength;
            const radius = this.getTubeRadius(x);
            topEdgePoints.push(new THREE.Vector3(x, radius, 0));
            bottomEdgePoints.push(new THREE.Vector3(x, -radius, 0));
        }
        
        const topEdgeGeometry = new THREE.BufferGeometry().setFromPoints(topEdgePoints);
        const topEdge = new THREE.Line(topEdgeGeometry, edgeMaterial);
        this.scene.add(topEdge);
        
        const bottomEdgeGeometry = new THREE.BufferGeometry().setFromPoints(bottomEdgePoints);
        const bottomEdge = new THREE.Line(bottomEdgeGeometry, edgeMaterial);
        this.scene.add(bottomEdge);
    }
    
    createParticles() {
        // 移除旧粒子
        this.particles.forEach(p => {
            this.scene.remove(p.mesh);
        });
        this.particles = [];
        
        const particleGeometry = new THREE.SphereGeometry(0.08, 16, 16);
        
        for (let i = 0; i < this.particleCount; i++) {
            const material = new THREE.MeshPhongMaterial({
                color: 0x2196f3,
                emissive: 0x1565c0,
                emissiveIntensity: 0.3
            });
            
            const mesh = new THREE.Mesh(particleGeometry, material);
            
            // 随机初始位置
            const x = (Math.random() - 0.5) * this.tubeLength;
            const radius = this.getTubeRadius(x) * 0.85;
            const angle = Math.random() * Math.PI * 2;
            const r = Math.random() * radius;
            
            mesh.position.set(x, Math.cos(angle) * r, Math.sin(angle) * r);
            
            this.scene.add(mesh);
            
            this.particles.push({
                mesh: mesh,
                angle: angle,
                radialPos: r / this.wideRadius, // 相对半径位置
                baseSpeed: 0.8 + Math.random() * 0.4
            });
        }
    }
    
    createPressureIndicators() {
        // 移除旧指示器
        this.pressureIndicators.forEach(p => {
            this.scene.remove(p);
        });
        this.pressureIndicators = [];
        
        // 创建压力计管
        const positions = [-7, 0, 7];
        const labels = ['高压区', '低压区', '高压区'];
        
        positions.forEach((x, index) => {
            const radius = this.getTubeRadius(x);
            const velocity = this.getVelocityAtX(x);
            
            // 压力与速度平方成反比（简化）
            const pressure = 1 / (velocity * velocity);
            const normalizedPressure = pressure / (1 / (this.flowSpeed * this.flowSpeed));
            const height = normalizedPressure * 3;
            
            // 压力计管
            const tubeGeometry = new THREE.CylinderGeometry(0.1, 0.1, 4, 16);
            const tubeMaterial = new THREE.MeshPhongMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.3
            });
            const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
            tube.position.set(x, radius + 2, 0);
            this.scene.add(tube);
            this.pressureIndicators.push(tube);
            
            // 液柱
            const liquidGeometry = new THREE.CylinderGeometry(0.08, 0.08, height, 16);
            const isHighPressure = index !== 1;
            const liquidMaterial = new THREE.MeshPhongMaterial({
                color: isHighPressure ? 0xff7043 : 0x66bb6a,
                emissive: isHighPressure ? 0xff5722 : 0x4caf50,
                emissiveIntensity: 0.3
            });
            const liquid = new THREE.Mesh(liquidGeometry, liquidMaterial);
            liquid.position.set(x, radius + height / 2, 0);
            liquid.userData = { baseX: x, isLiquid: true, index: index };
            this.scene.add(liquid);
            this.pressureIndicators.push(liquid);
        });
    }
    
    createGrid() {
        // 创建网格辅助线
        const gridHelper = new THREE.GridHelper(30, 30, 0x444444, 0x333333);
        gridHelper.position.y = -3;
        this.scene.add(gridHelper);
    }
    
    createLabels() {
        // 使用 CSS2D 或 Sprite 创建标签
        // 这里使用简单的 Sprite
        const createTextSprite = (text, position, color) => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = 256;
            canvas.height = 64;
            
            context.fillStyle = color;
            context.font = 'bold 32px Arial';
            context.textAlign = 'center';
            context.fillText(text, 128, 40);
            
            const texture = new THREE.CanvasTexture(canvas);
            const material = new THREE.SpriteMaterial({ 
                map: texture,
                transparent: true
            });
            const sprite = new THREE.Sprite(material);
            sprite.position.copy(position);
            sprite.scale.set(4, 1, 1);
            
            return sprite;
        };
        
        // 添加区域标签
        this.scene.add(createTextSprite('宽管区', new THREE.Vector3(-7, 4, 0), '#ff7043'));
        this.scene.add(createTextSprite('窄管区', new THREE.Vector3(0, 4, 0), '#66bb6a'));
        this.scene.add(createTextSprite('宽管区', new THREE.Vector3(7, 4, 0), '#ff7043'));
    }
    
    setupControls() {
        // 流速控制
        const flowSpeedSlider = document.getElementById('flowSpeed');
        const flowSpeedValue = document.getElementById('flowSpeedValue');
        flowSpeedSlider.addEventListener('input', (e) => {
            this.flowSpeed = parseFloat(e.target.value);
            flowSpeedValue.textContent = this.flowSpeed.toFixed(1) + 'x';
            this.updateDataPanel();
        });
        
        // 粒子数量控制
        const particleCountSlider = document.getElementById('particleCount');
        const particleCountValue = document.getElementById('particleCountValue');
        particleCountSlider.addEventListener('input', (e) => {
            this.particleCount = parseInt(e.target.value);
            particleCountValue.textContent = this.particleCount;
            this.createParticles();
        });
        
        // 收缩比例控制
        const constrictionSlider = document.getElementById('constriction');
        const constrictionValue = document.getElementById('constrictionValue');
        constrictionSlider.addEventListener('input', (e) => {
            this.constriction = parseFloat(e.target.value);
            constrictionValue.textContent = Math.round(this.constriction * 100) + '%';
            this.createTube();
            this.createPressureIndicators();
            this.updateDataPanel();
        });
    }
    
    updateDataPanel() {
        const wideVelocity = this.flowSpeed * 2;
        const narrowVelocity = wideVelocity * (1 / (this.constriction * this.constriction));
        
        document.getElementById('wide-velocity').textContent = wideVelocity.toFixed(1) + ' m/s';
        document.getElementById('narrow-velocity').textContent = narrowVelocity.toFixed(1) + ' m/s';
        
        // 压强是定性的
        const pressureRatio = (narrowVelocity / wideVelocity);
        if (pressureRatio > 2) {
            document.getElementById('wide-pressure').textContent = '高';
            document.getElementById('narrow-pressure').textContent = '很低';
        } else {
            document.getElementById('wide-pressure').textContent = '高';
            document.getElementById('narrow-pressure').textContent = '低';
        }
    }
    
    updateParticles(deltaTime) {
        this.particles.forEach(particle => {
            const x = particle.mesh.position.x;
            const velocity = this.getVelocityAtX(x);
            
            // 更新位置
            particle.mesh.position.x += velocity * deltaTime * particle.baseSpeed * 0.5;
            
            // 循环
            if (particle.mesh.position.x > this.tubeLength / 2) {
                particle.mesh.position.x = -this.tubeLength / 2;
                
                // 重新随机化径向位置
                const radius = this.getTubeRadius(-this.tubeLength / 2) * 0.85;
                const angle = Math.random() * Math.PI * 2;
                const r = Math.random() * radius;
                particle.mesh.position.y = Math.cos(angle) * r;
                particle.mesh.position.z = Math.sin(angle) * r;
                particle.angle = angle;
                particle.radialPos = r / this.wideRadius;
            }
            
            // 调整径向位置以适应管道形状
            const currentRadius = this.getTubeRadius(x) * 0.85;
            const targetR = particle.radialPos * currentRadius;
            const currentR = Math.sqrt(
                particle.mesh.position.y * particle.mesh.position.y +
                particle.mesh.position.z * particle.mesh.position.z
            );
            
            if (currentR > 0.01) {
                const scale = targetR / currentR;
                particle.mesh.position.y *= 0.95 + 0.05 * scale;
                particle.mesh.position.z *= 0.95 + 0.05 * scale;
            }
            
            // 根据速度更新颜色
            const normalizedVelocity = velocity / (this.flowSpeed * 4);
            const color = new THREE.Color();
            // 从蓝色（慢）到红色（快）
            color.setHSL(0.6 - normalizedVelocity * 0.6, 1, 0.5);
            particle.mesh.material.color = color;
            particle.mesh.material.emissive = color.clone().multiplyScalar(0.3);
        });
    }
    
    updatePressureIndicators() {
        this.pressureIndicators.forEach(indicator => {
            if (indicator.userData && indicator.userData.isLiquid) {
                const x = indicator.userData.baseX;
                const radius = this.getTubeRadius(x);
                const velocity = this.getVelocityAtX(x);
                
                // 压力与速度平方成反比
                const pressure = 1 / (velocity * velocity);
                const normalizedPressure = pressure / (1 / (this.flowSpeed * this.flowSpeed));
                const height = Math.max(0.5, normalizedPressure * 3);
                
                // 更新液柱高度
                indicator.scale.y = height / 3;
                indicator.position.y = radius + (height * indicator.scale.y) / 2;
            }
        });
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const deltaTime = 0.016; // 假设 60fps
        
        this.updateParticles(deltaTime);
        this.updatePressureIndicators();
        this.controls.update();
        
        this.renderer.render(this.scene, this.camera);
    }
}

// 启动演示
window.addEventListener('DOMContentLoaded', () => {
    new BernoulliDemo();
});
