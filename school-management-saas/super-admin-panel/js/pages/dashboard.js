async function loadDashboard() {
    try {
        const [schoolsRes, revenueRes] = await Promise.all([
            api.get('/schools'),
            api.get('/revenue')
        ]);

        const schools = schoolsRes.data;
        const revenue = revenueRes.data;

        // Update stats
        document.getElementById('totalSchools').textContent = schools.length;
        document.getElementById('activeSchools').textContent = schools.filter(s => s.isActive).length;
        document.getElementById('totalRevenue').textContent = `$${revenue.totalRevenue || 0}`;
        document.getElementById('activeSubscriptions').textContent = revenue.activeSubscriptions || 0;

        // Create charts
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const revenueData = [5000, 7000, 6500, 8000, 9500, 11000];
        const schoolsData = [10, 15, 18, 22, 28, 35];

        chartManager.createLineChart('revenueChart', months, revenueData, 'Monthly Revenue ($)');
        chartManager.createBarChart('schoolsChart', months, schoolsData, 'Total Schools');

    } catch (error) {
        console.error('Error loading dashboard:', error);
        notify.error('Failed to load dashboard data');
    }
}

loadDashboard();
