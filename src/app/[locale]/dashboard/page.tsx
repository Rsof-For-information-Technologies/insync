import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import { useTranslations } from "next-intl";
import { UserRole } from "@/types/userRoles";

const Dashboard = () => {
    const t = useTranslations('Dashboard');

    const statsCards = [
        {
            title: 'Total Revenue',
            value: '$45,231.89',
            change: '+20.1%',
            trend: 'up',
            icon: '💰',
            color: 'green'
        },
        {
            title: 'New Users',
            value: '2,350',
            change: '+18.1%',
            trend: 'up',
            icon: '👥',
            color: 'blue'
        },
        {
            title: 'Sales',
            value: '12,234',
            change: '-4.3%',
            trend: 'down',
            icon: '🛒',
            color: 'orange'
        },
        {
            title: 'Active Now',
            value: '573',
            change: '+12.1%',
            trend: 'up',
            icon: '⚡',
            color: 'purple'
        }
    ];

    const recentActivities = [
        { id: 1, user: 'John Doe', action: 'created new project', time: '2 min ago' },
        { id: 2, user: 'Sarah Smith', action: 'updated settings', time: '5 min ago' },
        { id: 3, user: 'Mike Johnson', action: 'completed task', time: '12 min ago' },
        { id: 4, user: 'Emma Wilson', action: 'uploaded files', time: '15 min ago' },
    ];

    const upcomingEvents = [
        { title: 'Team Meeting', time: '10:00 AM', date: 'Today' },
        { title: 'Product Launch', time: '2:00 PM', date: 'Tomorrow' },
        { title: 'Client Call', time: '11:30 AM', date: 'Dec 15' },
    ];

    return (
        <Authenticate>
            <Authorize allowedRoles={[UserRole.SuperAdmin, UserRole.Admin]} navigate={true}>
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                {t('title')}
                            </h1>
                            <p className="text-gray-600">{t('description')}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                System Online
                            </span>
                            <div className="text-sm text-gray-500">
                                Last updated: Just now
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {statsCards.map((stat, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 mb-1">
                                            {stat.title}
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 mb-2">
                                            {stat.value}
                                        </p>
                                        <div className={`flex items-center text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {stat.trend === 'up' ? '↗' : '↘'}
                                            {stat.change} from last month
                                        </div>
                                    </div>
                                    <div className={`p-3 rounded-lg bg-${stat.color}-50 text-2xl`}>
                                        {stat.icon}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Revenue Overview
                                </h3>
                                <span className="px-2 py-1 text-xs border border-gray-300 rounded-md">
                                    Last 6 months
                                </span>
                            </div>
                            <div className="h-64 flex items-end justify-between gap-2">
                                {[65, 45, 75, 35, 55, 80].map((height, index) => (
                                    <div key={index} className="flex flex-col items-center flex-1">
                                        <div
                                            className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                                            style={{ height: `${height}%` }}
                                        ></div>
                                        <span className="text-xs text-gray-500 mt-2">
                                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][index]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Traffic Sources
                                </h3>
                                <span className="px-2 py-1 text-xs border border-gray-300 rounded-md">
                                    This month
                                </span>
                            </div>
                            <div className="h-64 flex items-center justify-center">
                                <div className="relative w-48 h-48">
                                    <div className="absolute inset-0 border-8 border-blue-500 rounded-full"></div>
                                    <div className="absolute inset-4 border-8 border-cyan-500 rounded-full"></div>
                                    <div className="absolute inset-8 border-8 border-indigo-500 rounded-full"></div>
                                    <div className="absolute inset-12 border-8 border-violet-500 rounded-full"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <p className="text-2xl font-bold">1,178</p>
                                            <p className="text-sm text-gray-500">Visitors</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-4">
                                {['Direct', 'Social', 'Referral', 'Organic'].map((source, index) => (
                                    <div key={source} className="flex items-center gap-2">
                                        <div
                                            className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-blue-500' :
                                                    index === 1 ? 'bg-cyan-500' :
                                                        index === 2 ? 'bg-indigo-500' : 'bg-violet-500'
                                                }`}
                                        ></div>
                                        <span className="text-sm text-gray-600">{source}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm lg:col-span-2">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Weekly Performance
                                </h3>
                                <div className="flex items-center gap-2 text-green-600">
                                    <span>↗</span>
                                    <span className="text-sm">+12% this week</span>
                                </div>
                            </div>
                            <div className="h-64">
                                <svg viewBox="0 0 400 200" className="w-full h-full">
                                    <path
                                        d="M0,150 L50,120 L100,140 L150,100 L200,130 L250,80 L300,110 L350,70 L400,90"
                                        fill="none"
                                        stroke="#10b981"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                    />
                                    {[0, 50, 100, 150, 200, 250, 300, 350, 400].map((x, index) => (
                                        <text key={index} x={x} y="190" textAnchor="middle" className="text-xs fill-gray-500">
                                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                                        </text>
                                    ))}
                                </svg>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Recent Activity
                                </h3>
                                <span>💬</span>
                            </div>
                            <div className="space-y-4">
                                {recentActivities.map((activity) => (
                                    <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">
                                                {activity.user}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {activity.action}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {activity.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                System Status
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { service: 'Web Server', status: 'operational', latency: '45ms' },
                                    { service: 'Database', status: 'operational', latency: '12ms' },
                                    { service: 'API', status: 'degraded', latency: '230ms' },
                                    { service: 'Cache', status: 'operational', latency: '8ms' },
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${item.status === 'operational' ? 'bg-green-500' : 'bg-yellow-500'
                                                }`}></div>
                                            <span className="font-medium text-gray-900">{item.service}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm text-gray-500">{item.latency}</span>
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${item.status === 'operational'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Upcoming Events
                                </h3>
                                <span>📅</span>
                            </div>
                            <div className="space-y-4">
                                {upcomingEvents.map((event, index) => (
                                    <div key={index} className="flex items-center gap-4 p-3 rounded-lg border border-gray-100">
                                        <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                            <span className="text-lg">📅</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{event.title}</p>
                                            <p className="text-sm text-gray-500">
                                                {event.time} • {event.date}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Authorize>
        </Authenticate>
    );
}

export default Dashboard;
