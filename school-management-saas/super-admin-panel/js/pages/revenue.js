async function loadRevenue() {
    try {
        const response = await api.get('/revenue');
        const data = response.data;

        // Update stats
        document.getElementById('totalRevenue').textContent = `$${data.totalRevenue || 0}`;
        document.getElementById('monthlyRevenue').textContent = `$${data.monthlyRevenue || 0}`;
        document.getElementById('activeSubscriptions').textContent = data.activeSubscriptions || 0;
        document.getElementById('totalSubscriptions').textContent = data.totalSubscriptions || 0;

        // Create chart
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const revenueData = [5000, 7000, 6500, 8000, 9500, 11000];
        chartManager.createLineChart('revenueChart', months, revenueData, 'Monthly Revenue ($)');

        // Load subscriptions table
        const tbody = document.getElementById('subscriptionsBody');
        tbody.innerHTML = (data.recentSubscriptions || []).map(sub => `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${sub.schoolId?.name || 'N/A'}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${sub.plan}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    $${sub.amount}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        sub.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }">
                        ${sub.status}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${new Date(sub.createdAt).toLocaleDateString()}
                </td>
            </tr>
        `).join('') || '<tr><td colspan="5" class="px-6 py-4 text-center text-gray-500">No subscriptions found</td></tr>';
    } catch (error) {
        console.error('Error loading revenue:', error);
        notify.error('Failed to load revenue data');
    }
}

loadRevenue();
