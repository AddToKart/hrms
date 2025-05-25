import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  Calendar,
  FileText,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";

const stats = [
  {
    name: "Total Employees",
    value: "245",
    icon: Users,
    change: "+4.75%",
    changeType: "positive",
    color: "blue",
  },
  {
    name: "Present Today",
    value: "232",
    icon: CheckCircle,
    change: "+54.02%",
    changeType: "positive",
    color: "green",
  },
  {
    name: "Pending Leaves",
    value: "12",
    icon: Clock,
    change: "-1.39%",
    changeType: "negative",
    color: "yellow",
  },
  {
    name: "Monthly Payroll",
    value: "$847,260",
    icon: DollarSign,
    change: "+3.18%",
    changeType: "positive",
    color: "purple",
  },
];

const colorVariants = {
  blue: "from-blue-500 to-blue-600",
  green: "from-green-500 to-green-600",
  yellow: "from-yellow-500 to-yellow-600",
  purple: "from-purple-500 to-purple-600",
};

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="mt-2 text-gray-600">
          Welcome back! Here's what's happening with your team today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.name}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg bg-white/70 backdrop-blur-sm"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.name}
                </CardTitle>
                <div
                  className={`p-2 rounded-lg bg-gradient-to-r ${
                    colorVariants[stat.color]
                  } shadow-lg`}
                >
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp
                    className={`h-3 w-3 ${
                      stat.changeType === "positive"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  />
                  <p
                    className={`text-xs font-medium ${
                      stat.changeType === "positive"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stat.change} from last month
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activities */}
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <span>Recent Activities</span>
            </CardTitle>
            <CardDescription>Latest activities in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  text: "John Doe submitted leave request",
                  time: "2 hours ago",
                  color: "blue",
                },
                {
                  text: "Payroll processed for December",
                  time: "4 hours ago",
                  color: "green",
                },
                {
                  text: "New employee onboarded",
                  time: "1 day ago",
                  color: "purple",
                },
                {
                  text: "Monthly report generated",
                  time: "2 days ago",
                  color: "yellow",
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center p-3 rounded-lg bg-gray-50/50 hover:bg-gray-100/50 transition-colors"
                >
                  <div
                    className={`w-2 h-2 bg-gradient-to-r ${
                      colorVariants[activity.color]
                    } rounded-full mr-3 flex-shrink-0`}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.text}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  title: "Add New Employee",
                  desc: "Create a new employee record",
                  icon: Users,
                  color: "blue",
                },
                {
                  title: "Process Payroll",
                  desc: "Generate monthly payroll",
                  icon: DollarSign,
                  color: "green",
                },
                {
                  title: "View Reports",
                  desc: "Generate HR analytics",
                  icon: FileText,
                  color: "purple",
                },
              ].map((action, index) => {
                const ActionIcon = action.icon;
                return (
                  <button key={index} className="w-full group">
                    <div className="flex items-center p-4 rounded-xl border border-gray-200 hover:border-gray-300 bg-white/50 hover:bg-white/80 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                      <div
                        className={`p-2 rounded-lg bg-gradient-to-r ${
                          colorVariants[action.color]
                        } shadow-sm`}
                      >
                        <ActionIcon className="h-4 w-4 text-white" />
                      </div>
                      <div className="ml-4 text-left">
                        <p className="font-medium text-gray-900 group-hover:text-gray-700">
                          {action.title}
                        </p>
                        <p className="text-sm text-gray-500">{action.desc}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
