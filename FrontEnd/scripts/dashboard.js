// Dashboard functionality and ML model integration
class RailwaySafetyDashboard {
    constructor() {
        this.currentSection = 'overview';
        this.detectionActive = false;
        this.currentDetectionType = null;
        this.alerts = [];
        this.charts = {};
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupEventListeners();
        this.initializeRealTimeUpdates();
        this.setupMLModelIntegration();
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const sections = document.querySelectorAll('.dashboard-section');

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = item.getAttribute('href').substring(1);
                this.showSection(targetSection);
                
                // Update active states
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
            });
        });
    }

    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.dashboard-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionId;
            
            // Initialize section-specific functionality
            this.initializeSection(sectionId);
        }
    }

    initializeSection(sectionId) {
        switch(sectionId) {
            case 'overview':
                this.updateOverviewStats();
                break;
            case 'cctv':
                this.initializeCCTVMonitoring();
                break;
            case 'alerts':
                this.loadAlerts();
                break;
            case 'analytics':
                this.updateAnalytics();
                break;
            case 'crowd':
                this.initializeCrowdManagement();
                break;
        }
    }

    setupEventListeners() {
        // Alert modal functionality
        const modal = document.getElementById('alertModal');
        const closeBtn = modal.querySelector('.close');
        
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Alert filters
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filterAlerts(btn.dataset.filter);
            });
        });
    }

    initializeRealTimeUpdates() {
        // Update stats every 5 seconds
        setInterval(() => {
            this.updateOverviewStats();
        }, 5000);

        // Simulate real-time alerts
        setInterval(() => {
            this.simulateRandomAlert();
        }, 15000);
    }

    updateOverviewStats() {
        // Simulate real-time data updates
        const activeAlertsCount = document.getElementById('activeAlertsCount');
        const crowdDensity = document.getElementById('crowdDensity');
        
        if (activeAlertsCount) {
            const currentCount = parseInt(activeAlertsCount.textContent);
            const newCount = Math.max(0, currentCount + Math.floor(Math.random() * 3) - 1);
            activeAlertsCount.textContent = newCount;
            
            // Update status indicator
            const statusElement = activeAlertsCount.parentElement.querySelector('.stat-status');
            if (newCount > 5) {
                statusElement.className = 'stat-status warning';
                statusElement.textContent = 'High Alert';
            } else if (newCount > 2) {
                statusElement.className = 'stat-status warning';
                statusElement.textContent = 'Requires Attention';
            } else {
                statusElement.className = 'stat-status online';
                statusElement.textContent = 'All Clear';
            }
        }

        if (crowdDensity) {
            const densities = ['Low', 'Medium', 'High'];
            const randomDensity = densities[Math.floor(Math.random() * densities.length)];
            crowdDensity.textContent = randomDensity;
            
            // Update status
            const statusElement = crowdDensity.parentElement.querySelector('.stat-status');
            if (randomDensity === 'High') {
                statusElement.className = 'stat-status warning';
                statusElement.textContent = 'Crowded';
            } else if (randomDensity === 'Medium') {
                statusElement.className = 'stat-status normal';
                statusElement.textContent = 'Normal';
            } else {
                statusElement.className = 'stat-status online';
                statusElement.textContent = 'Sparse';
            }
        }
    }

    initializeCCTVMonitoring() {
        // Initialize video streams
        this.setupVideoStreams();
        
        // Setup detection controls
        this.setupDetectionControls();
    }

    setupVideoStreams() {
        // Simulate multiple video feeds
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            // In a real implementation, these would be actual CCTV streams
            // For demo purposes, we'll use placeholder videos
            if (video.src === '') {
                video.src = './assets/videos/sample_feed.mp4';
            }
        });
    }

    setupDetectionControls() {
        // Detection buttons are already set up in HTML with onclick handlers
        // This function can be extended for additional setup
    }

    startDetection(detectionType) {
        this.currentDetectionType = detectionType;
        this.detectionActive = true;
        
        // Update UI to show detection is active
        const overlay = document.getElementById('detectionOverlay');
        const status = document.getElementById('detectionStatus');
        const confidence = document.getElementById('detectionConfidence');
        
        if (overlay) overlay.style.display = 'block';
        if (status) status.textContent = `${detectionType.charAt(0).toUpperCase() + detectionType.slice(1)} Detection Active`;
        
        // Simulate ML model processing
        this.simulateMLDetection(detectionType);
        
        // Update detection results
        this.updateDetectionResults(detectionType);
    }

    simulateMLDetection(detectionType) {
        // Simulate the ML model processing
        console.log(`Starting ${detectionType} detection...`);
        
        // In a real implementation, this would call the actual ML models
        // For now, we'll simulate the process
        
        setTimeout(() => {
            this.processDetectionResults(detectionType);
        }, 2000);
    }

    processDetectionResults(detectionType) {
        let results = {};
        
        switch(detectionType) {
            case 'emotion':
                results = this.simulateEmotionDetection();
                break;
            case 'violence':
                results = this.simulateViolenceDetection();
                break;
            case 'weapon':
                results = this.simulateWeaponDetection();
                break;
        }
        
        this.displayDetectionResults(results);
    }

    simulateEmotionDetection() {
        const emotions = ['Happy', 'Neutral', 'Sad', 'Angry', 'Fear', 'Surprise', 'Disgust'];
        const detectedEmotion = emotions[Math.floor(Math.random() * emotions.length)];
        const confidence = (Math.random() * 0.3 + 0.7).toFixed(2); // 70-100%
        
        return {
            type: 'emotion',
            detected: detectedEmotion,
            confidence: confidence,
            timestamp: new Date().toLocaleTimeString()
        };
    }

    simulateViolenceDetection() {
        const isViolent = Math.random() > 0.8; // 20% chance of violence
        const confidence = (Math.random() * 0.2 + 0.8).toFixed(2); // 80-100%
        
        return {
            type: 'violence',
            detected: isViolent ? 'Violence Detected' : 'No Violence',
            confidence: confidence,
            timestamp: new Date().toLocaleTimeString(),
            alert: isViolent
        };
    }

    simulateWeaponDetection() {
        const hasWeapon = Math.random() > 0.9; // 10% chance of weapon
        const confidence = (Math.random() * 0.15 + 0.85).toFixed(2); // 85-100%
        
        return {
            type: 'weapon',
            detected: hasWeapon ? 'Weapon Detected' : 'No Weapon',
            confidence: confidence,
            timestamp: new Date().toLocaleTimeString(),
            alert: hasWeapon
        };
    }

    displayDetectionResults(results) {
        const status = document.getElementById('detectionStatus');
        const confidence = document.getElementById('detectionConfidence');
        
        if (status) status.textContent = results.detected;
        if (confidence) confidence.textContent = `${(results.confidence * 100).toFixed(1)}%`;
        
        // If alert is needed, trigger it
        if (results.alert) {
            this.triggerAlert(results);
        }
    }

    triggerAlert(results) {
        const alert = {
            id: Date.now(),
            type: results.type,
            priority: 'high',
            title: `${results.type.charAt(0).toUpperCase() + results.type.slice(1)} Alert`,
            description: `${results.detected} with ${(results.confidence * 100).toFixed(1)}% confidence`,
            location: 'Platform 1 - Main Camera',
            time: results.timestamp,
            confidence: results.confidence
        };
        
        this.alerts.unshift(alert);
        this.showAlertModal(alert);
        this.updateAlertsList();
    }

    showAlertModal(alert) {
        const modal = document.getElementById('alertModal');
        const alertTime = document.getElementById('alertTime');
        const alertLocation = document.getElementById('alertLocation');
        const alertConfidence = document.getElementById('alertConfidence');
        
        if (alertTime) alertTime.textContent = alert.time;
        if (alertLocation) alertLocation.textContent = alert.location;
        if (alertConfidence) alertConfidence.textContent = `${(alert.confidence * 100).toFixed(1)}%`;
        
        modal.style.display = 'block';
    }

    loadAlerts() {
        // Load sample alerts for demonstration
        this.alerts = [
            {
                id: 1,
                type: 'violence',
                priority: 'high',
                title: 'Fighting Detected',
                description: 'Physical altercation detected in Platform 2',
                location: 'Platform 2 - Camera 3',
                time: '14:32:15',
                confidence: 0.94
            },
            {
                id: 2,
                type: 'weapon',
                priority: 'high',
                title: 'Suspicious Object',
                description: 'Potential weapon detected near entry gate',
                location: 'Entry Gate - Camera 1',
                time: '14:28:42',
                confidence: 0.87
            },
            {
                id: 3,
                type: 'emotion',
                priority: 'medium',
                title: 'Distressed Passenger',
                description: 'Multiple passengers showing signs of distress',
                location: 'Platform 1 - Main Camera',
                time: '14:25:18',
                confidence: 0.76
            }
        ];
        
        this.updateAlertsList();
    }

    updateAlertsList() {
        const alertsList = document.getElementById('alertsList');
        if (!alertsList) return;
        
        alertsList.innerHTML = '';
        
        this.alerts.forEach(alert => {
            const alertElement = this.createAlertElement(alert);
            alertsList.appendChild(alertElement);
        });
    }

    createAlertElement(alert) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert-item ${alert.priority}`;
        
        alertDiv.innerHTML = `
            <div class="alert-header">
                <span class="alert-title">${alert.title}</span>
                <span class="alert-time">${alert.time}</span>
            </div>
            <p class="alert-description">${alert.description}</p>
            <div class="alert-meta">
                <span><strong>Location:</strong> ${alert.location}</span>
                <span><strong>Confidence:</strong> ${(alert.confidence * 100).toFixed(1)}%</span>
                <span><strong>Type:</strong> ${alert.type}</span>
            </div>
        `;
        
        return alertDiv;
    }

    filterAlerts(filter) {
        const alertItems = document.querySelectorAll('.alert-item');
        
        alertItems.forEach(item => {
            if (filter === 'all' || item.classList.contains(filter)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    simulateRandomAlert() {
        const alertTypes = ['emotion', 'violence', 'weapon'];
        const randomType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
        
        // Only trigger alerts occasionally
        if (Math.random() > 0.7) {
            this.simulateMLDetection(randomType);
        }
    }

    updateDetectionResults(detectionType) {
        // This function updates the detection results display
        // It's called when detection starts
    }

    initializeCrowdManagement() {
        // Initialize crowd density visualization
        this.createHeatmap();
        this.updateCrowdStats();
    }

    createHeatmap() {
        const heatmapContainer = document.getElementById('heatmapContainer');
        if (!heatmapContainer) return;
        
        // In a real implementation, this would create an actual heatmap
        // For demo purposes, we'll show a placeholder
        heatmapContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <h4>Station Heat Map</h4>
                <p>Real-time crowd density visualization</p>
                <div style="margin-top: 1rem; padding: 1rem; background: #f1f5f9; border-radius: 10px;">
                    <p><strong>Platform 1:</strong> Medium Density</p>
                    <p><strong>Platform 2:</strong> High Density</p>
                    <p><strong>Entry Gate:</strong> Low Density</p>
                    <p><strong>Exit Gate:</strong> Medium Density</p>
                </div>
            </div>
        `;
    }

    updateCrowdStats() {
        // Update crowd statistics
        const currentDensity = document.getElementById('currentDensity');
        if (currentDensity) {
            const densities = ['Low', 'Medium', 'High'];
            const randomDensity = densities[Math.floor(Math.random() * densities.length)];
            currentDensity.textContent = randomDensity;
        }
    }

    updateAnalytics() {
        // Update analytics charts and metrics
        this.updatePerformanceMetrics();
    }

    updatePerformanceMetrics() {
        // Update performance metrics display
        // This would typically involve updating charts and metrics
    }
}

// Initialize dashboard when DOM is loaded
function initializeDashboard() {
    window.dashboard = new RailwaySafetyDashboard();
}

// Global function for detection buttons
function startDetection(detectionType) {
    if (window.dashboard) {
        window.dashboard.startDetection(detectionType);
    }
}

// Initialize charts
function initializeCharts() {
    // Incident Trends Chart
    const incidentCtx = document.getElementById('incidentChart');
    if (incidentCtx) {
        window.incidentChart = new Chart(incidentCtx, {
            type: 'line',
            data: {
                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                datasets: [{
                    label: 'Security Incidents',
                    data: [2, 1, 3, 5, 4, 2],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#e2e8f0'
                        }
                    },
                    x: {
                        grid: {
                            color: '#e2e8f0'
                        }
                    }
                }
            }
        });
    }

    // Crowd Flow Chart
    const crowdCtx = document.getElementById('crowdChart');
    if (crowdCtx) {
        window.crowdChart = new Chart(crowdCtx, {
            type: 'bar',
            data: {
                labels: ['Platform 1', 'Platform 2', 'Entry Gate', 'Exit Gate'],
                datasets: [{
                    label: 'Crowd Density',
                    data: [65, 85, 30, 55],
                    backgroundColor: [
                        'rgba(102, 126, 234, 0.8)',
                        'rgba(240, 147, 251, 0.8)',
                        'rgba(255, 154, 158, 0.8)',
                        'rgba(16, 185, 129, 0.8)'
                    ],
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: '#e2e8f0'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // Performance Chart
    const performanceCtx = document.getElementById('performanceChart');
    if (performanceCtx) {
        window.performanceChart = new Chart(performanceCtx, {
            type: 'doughnut',
            data: {
                labels: ['Emotion Detection', 'Violence Detection', 'Weapon Detection'],
                datasets: [{
                    data: [94, 89, 92],
                    backgroundColor: [
                        '#667eea',
                        '#f093fb',
                        '#ff9a9e'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }
}

// Load sample alerts
function loadSampleAlerts() {
    if (window.dashboard) {
        window.dashboard.loadAlerts();
    }
}

// Export for use in other scripts
window.RailwaySafetyDashboard = RailwaySafetyDashboard;