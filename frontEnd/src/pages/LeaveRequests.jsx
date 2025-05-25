import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Filter,
  Search,
} from "lucide-react";

const leaveRequests = [
  {
    id: 1,
    name: "John Doe",
    type: "Annual Leave",
    startDate: "2024-01-20",
    endDate: "2024-01-25",
    days: 6,
    reason: "Family vacation",
    status: "Pending",
    appliedDate: "2024-01-10",
    avatar: "JD",
  },
  {
    id: 2,
    name: "Jane Smith",
    type: "Sick Leave",
    startDate: "2024-01-18",
    endDate: "2024-01-19",
    days: 2,
    reason: "Medical appointment",
    status: "Approved",
    appliedDate: "2024-01-15",
    avatar: "JS",
  },
  {
    id: 3,
    name: "Mike Johnson",
    type: "Personal Leave",
    startDate: "2024-01-22",
    endDate: "2024-01-22",
    days: 1,
    reason: "Personal matters",
    status: "Rejected",
    appliedDate: "2024-01-12",
    avatar: "MJ",
  },
];

const stats = [
  { name: "Pending Requests", value: "12", icon: Clock, color: "yellow" },
  {
    name: "Approved This Month",
    value: "28",
    icon: CheckCircle,
    color: "green",
  },
  { name: "Rejected", value: "3", icon: XCircle, color: "red" },
  { name: "Total Requests", value: "43", icon: FileText, color: "blue" },
];

const colorVariants = {
  yellow: "from-yellow-500 to-yellow-600",
  green: "from-green-500 to-green-600",
  red: "from-red-500 to-red-600",
  blue: "from-blue-500 to-blue-600",
};

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  Approved: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
};

export default function LeaveRequests() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredRequests = leaveRequests.filter((request) => {
    const matchesSearch =
      request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Leave Requests
            </h1>
            <p className="mt-2 text-gray-600">
              Manage and approve employee leave requests
            </p>
          </div>
          <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
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
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search and Filter */}
      <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by employee name or leave type..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Leave Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <Card
            key={request.id}
            className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg bg-white/70 backdrop-blur-sm"
          >
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="text-sm font-bold text-white">
                      {request.avatar}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {request.name}
                      </h3>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          statusColors[request.status]
                        }`}
                      >
                        {request.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Type:</span>{" "}
                        {request.type}
                      </div>
                      <div>
                        <span className="font-medium">Duration:</span>{" "}
                        {request.days} day{request.days > 1 ? "s" : ""}
                      </div>
                      <div>
                        <span className="font-medium">Start:</span>{" "}
                        {request.startDate}
                      </div>
                      <div>
                        <span className="font-medium">End:</span>{" "}
                        {request.endDate}
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="font-medium text-gray-700">Reason:</span>
                      <span className="text-gray-600 ml-2">
                        {request.reason}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Applied on: {request.appliedDate}
                    </div>
                  </div>
                </div>
                {request.status === "Pending" && (
                  <div className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-2">
                    <Button
                      size="sm"
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredRequests.length === 0 && (
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardContent className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No leave requests found
            </h3>
            <p className="text-gray-500">Try adjusting your search criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
