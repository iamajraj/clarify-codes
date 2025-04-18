document.addEventListener('alpine:init', () => {
  Alpine.store('app', {
    // STATE
    sidebarOpen: true,
    currentView: 'dashboard', // 'dashboard', 'repositories', 'settings'
    currentRepoName: 'My Awesome Project',
    availableRepos: ['My Awesome Project', 'Akmal Internal Tool', 'Website Revamp Q3', 'Legacy System Maintenance', 'Mobile App v2'],
    potentialRepos: [
      { id: 6, name: 'Internal Design System', owner: 'my-org' },
      { id: 7, name: 'Marketing Site CMS', owner: 'my-org' },
      { id: 8, name: 'Data Pipeline V1', owner: 'my-org' },
      { id: 9, name: 'Customer Support Portal', owner: 'my-org' },
      { id: 10, name: 'Experimental Feature X', owner: 'my-org' },
    ],
    addRepoModalOpen: false,
    selectedReposToAdd: [],

    // METHODS
    selectRepo(repoName) {
      console.log(`Selecting repo: ${repoName}`);
      this.currentRepoName = repoName;
      // In real app, we would be triggering data refresh for this repo
      // For demo, just re-initialize charts with slightly randomized data
      initializeCharts();
    },
    changeView(viewName) {
      console.log(`Changing view to: ${viewName}`);
      this.currentView = viewName;
      // Re-initialize charts only if switching to the dashboard
      if (viewName === 'dashboard') {
        requestAnimationFrame(() => {
          setTimeout(initializeCharts, 0);
        });
      }
    },
    toggleRepoToAdd(repoId) {
      if (this.selectedReposToAdd.includes(repoId)) {
        this.selectedReposToAdd = this.selectedReposToAdd.filter(id => id !== repoId);
      } else {
        this.selectedReposToAdd.push(repoId);
      }
    },
    confirmAddRepos() {
      console.log("Adding repos:", this.selectedReposToAdd);

      const store = Alpine.store('app');

      store.potentialRepos.forEach(repo => { // Use store reference
        if (store.selectedReposToAdd.includes(repo.id) && !store.availableRepos.includes(repo.name)) {
          store.availableRepos.push(repo.name); // Use store reference
        }
      });

      store.potentialRepos = store.potentialRepos.filter(repo => !store.selectedReposToAdd.includes(repo.id));

      store.addRepoModalOpen = false; // Use store reference
      store.selectedReposToAdd = []; // Use store reference

      store.changeView('repositories'); // Use store reference
    }
  })
})

// Chart Instances
let collaborationChartInstance, hotspotsChartInstance, activityChartInstance, distributionChartInstance, prStatusChartInstance, mergeRateChartInstance;

// Chart Colors
const chartColors = {
  indigo700: '#4338ca',
  indigo500: '#6366f1',
  indigo300: '#a5b4fc',
  indigo100: '#e0e7ff',
  gray400: '#9ca3af',
  orange500: '#f97316',
  emerald500: '#10b981',
  red500: '#ef4444',
  info: '#3b82f6',
  warning: '#f97316',
  success: '#10b981'
};

function initializeCharts() {
  // this function is only called when the dashboard view is active
  if (Alpine.store('app').currentView !== 'dashboard') {
    console.log("Skipping chart init, not on dashboard view.");
    return;
  }
  console.log("Initializing charts for repo:", Alpine.store('app').currentRepoName);


  // Destroy existing charts before re-creating
  const chartIds = ['collaborationChart', 'hotspotsChart', 'activityChart', 'distributionChart', 'prStatusChart', 'mergeRateChart'];
  const chartInstances = [collaborationChartInstance, hotspotsChartInstance, activityChartInstance, distributionChartInstance, prStatusChartInstance, mergeRateChartInstance];

  chartInstances.forEach((instance, index) => {
    if (instance) {
      console.log(`Destroying chart: ${chartIds[index]}`);
      instance.destroy();
    }
  });

  // Chart Initialization

  const ctxCollab = document.getElementById('collaborationChart');
  if (ctxCollab) {
    collaborationChartInstance = new Chart(ctxCollab, {
      type: 'bubble',
      data: {
        datasets: [{
          label: 'Dev A',
          data: [{
            x: Math.random() * 50 + 10,
            y: Math.random() * 50 + 10,
            r: 18
          }],
          backgroundColor: chartColors.indigo500,
          borderColor: chartColors.indigo700
        }, {
          label: 'Dev B',
          data: [{
            x: Math.random() * 50 + 10,
            y: Math.random() * 50 + 10,
            r: 12
          }],
          backgroundColor: chartColors.indigo300,
          borderColor: chartColors.indigo500
        }, {
          label: 'Module X',
          data: [{
            x: Math.random() * 50 + 10,
            y: Math.random() * 50 + 10,
            r: 28
          }],
          backgroundColor: 'rgba(249, 115, 22, 0.7)',
          borderColor: chartColors.orange500
        }, {
          label: 'Dev C',
          data: [{
            x: Math.random() * 50 + 10,
            y: Math.random() * 50 + 10,
            r: 9
          }],
          backgroundColor: chartColors.indigo300,
          borderColor: chartColors.indigo500
        }, {
          label: 'Dev D',
          data: [{
            x: Math.random() * 50 + 10,
            y: Math.random() * 50 + 10,
            r: 14
          }],
          backgroundColor: chartColors.indigo500,
          borderColor: chartColors.indigo700
        }, {
          label: 'Module Y',
          data: [{
            x: Math.random() * 50 + 10,
            y: Math.random() * 50 + 10,
            r: 15
          }],
          backgroundColor: 'rgba(16, 185, 129, 0.7)',
          borderColor: chartColors.emerald500
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: true
          }
        },
        scales: {
          x: {
            display: false
          },
          y: {
            display: false
          }
        }
      }
    });
    console.log("Collab chart initialized");
  } else {
    console.error("Collab canvas not found");
  }

  // 2. Hotspots Chart (Horizontal Bar)
  const ctxHotspots = document.getElementById('hotspotsChart');
  if (ctxHotspots) {
    hotspotsChartInstance = new Chart(ctxHotspots, {
      type: 'bar',
      data: {
        labels: ['payments.js', 'users.ts', 'main_flow.py', 'config.yaml', 'helpers.go', 'api_spec.md', 'Button.jsx', 'README.md'].reverse(),
        datasets: [{
          label: 'Changes',
          data: [128, 95, 77, 61, 52, 48, 45, 40].map(d => d * (Math.random() * 0.4 + 0.8)).reverse(),
          backgroundColor: chartColors.indigo500,
          borderColor: chartColors.indigo700,
          borderWidth: 1,
          borderRadius: 4,
          barPercentage: 0.6,
          categoryPercentage: 0.7
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: false
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: {
              display: false
            },
            ticks: {
              font: {
                size: 10
              }
            }
          },
          y: {
            ticks: {
              font: {
                size: 10,
                family: 'monospace'
              }
            }
          }
        }
      }
    });
    console.log("Hotspots chart initialized");
  } else {
    console.error("Hotspots canvas not found");
  }

  // 3. Activity Chart (Line)
  const ctxActivity = document.getElementById('activityChart');
  if (ctxActivity) {
    activityChartInstance = new Chart(ctxActivity, {
      type: 'line',
      data: {
        labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'],
        datasets: [{
          label: 'Commits',
          data: [30, 45, 40, 55, 60, 50, 70, 65, 75, 80, 70, 85].map(d => d * (Math.random() * 0.3 + 0.85)),
          fill: true,
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          borderColor: chartColors.indigo500,
          tension: 0.4,
          pointBackgroundColor: chartColors.indigo500,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: chartColors.indigo500,
          pointRadius: 3,
          pointHoverRadius: 6
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
            ticks: {
              font: {
                size: 10
              }
            }
          },
          x: {
            ticks: {
              font: {
                size: 10
              }
            }
          }
        }
      }
    });
    console.log("Activity chart initialized");
  } else {
    console.error("Activity canvas not found");
  }

  // 4. Distribution Chart (Doughnut)
  const ctxDistribution = document.getElementById('distributionChart');
  if (ctxDistribution) {
    distributionChartInstance = new Chart(ctxDistribution, {
      type: 'doughnut',
      data: {
        labels: ['Alice G', 'Bob Y', 'Charlie B', 'Diana F', 'Other'],
        datasets: [{
          label: 'Commit Distribution',
          data: [35, 25, 18, 12, 10].map(d => d * (Math.random() * 0.2 + 0.9)),
          backgroundColor: [chartColors.indigo500, chartColors.indigo300, chartColors.emerald500, chartColors.orange500, chartColors.gray400],
          hoverOffset: 8,
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
              boxWidth: 12,
              font: {
                size: 10
              }
            }
          }
        }
      }
    });
    console.log("Distribution chart initialized");
  } else {
    console.error("Distribution canvas not found");
  }

  // 5. PR Status Chart (Doughnut/Pie)
  const ctxPrStatus = document.getElementById('prStatusChart');
  if (ctxPrStatus) {
    prStatusChartInstance = new Chart(ctxPrStatus, {
      type: 'doughnut',
      data: {
        labels: ['Open < 7d', 'Open > 7d', 'Merged < 7d'],
        datasets: [{
          data: [15, 4, 120].map(d => d * (Math.random() * 0.1 + 0.95)),
          backgroundColor: [chartColors.info, chartColors.warning, chartColors.success],
          hoverOffset: 4,
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return ` ${context.label}: ${context.parsed}`;
              }
            }
          }
        }
      }
    });
    console.log("PR Status chart initialized");
  } else {
    console.error("PR Status canvas not found");
  }

  // 6. Merge Rate Trend (Small Line)
  const ctxMergeRate = document.getElementById('mergeRateChart');
  if (ctxMergeRate) {
    mergeRateChartInstance = new Chart(ctxMergeRate, {
      type: 'line',
      data: {
        labels: ['W9', 'W10', 'W11', 'W12'],
        datasets: [{
          label: 'PRs Merged',
          data: [18, 22, 20, 25].map(d => d * (Math.random() * 0.1 + 0.95)),
          borderColor: chartColors.emerald500,
          tension: 0.3,
          pointRadius: 0,
          fill: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false
          }
        },
        scales: {
          y: {
            display: false,
            beginAtZero: true
          },
          x: {
            display: false
          }
        }
      }
    });
    console.log("Merge Rate chart initialized");
  } else {
    console.error("Merge Rate canvas not found");
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (typeof Alpine !== 'undefined' && Alpine.store('app')) {
    if (Alpine.store('app').currentView === 'dashboard') {
      initializeCharts();
    }
  } else {
    // if Alpine initializes later
    document.addEventListener('alpine:initialized', () => {
      if (Alpine.store('app').currentView === 'dashboard') {
        initializeCharts();
      }
    });
  }
});
