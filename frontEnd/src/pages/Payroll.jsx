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
  DollarSign,
  Download,
  Calculator,
  TrendingUp,
  Users,
  Calendar,
  Filter,
  Search,
} from "lucide-react";

const payrollData = [
  {
    id: 1,
    name: "John Doe",
    employeeId: "EMP001",
    department: "Engineering",
    position: "Senior Developer",
    baseSalary: 85000,
    allowances: 5000,
    deductions: 3200,
    netSalary: 86800,
    status: "Processed",
    avatar: "JD",
  },
  {
    id: 2,
    name: "Jane Smith",
    employeeId: "EMP002",
    department: "Marketing",
    position: "Marketing Manager",
    baseSalary: 75000,
    allowances: 4500,
    deductions: 2800,
    netSalary: 76700,
    status: "Processed",
    avatar: "JS",
  },
  {
    id: 3,
    name: "Mike Johnson",
    employeeId: "EMP003",
    department: "HR",
    position: "HR Specialist",
    baseSalary: 65000,
    allowances: 3000,
    deductions: 2500,
    netSalary: 65500,
    status: "Pending",
    avatar: "MJ",
  },
];

const stats = [
  {
    name: "Total Payroll",
    value: "$847,260",
    icon: DollarSign,
    color: "green",
    change: "+3.2%",
  },
  {
    name: "Employees Paid",
    value: "232",
    icon: Users,
    color: "blue",
    change: "+1.5%",
  },
  {
    name: "Pending Payroll",
    value: "13",
    icon: Calendar,
    color: "yellow",
    change: "-0.8%",
  },
  {
    name: "Average Salary",
    value: "$3,650",
    icon: TrendingUp,
    color: "purple",
    change: "+2.1%",
  },
];

const colorVariants = {
  green: "from-green-500 to-green-600",
  blue: "from-blue-500 to-blue-600",
  yellow: "from-yellow-500 to-yellow-600",
  purple: "from-purple-500 to-purple-600",
};

export default function Payroll() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("2024-01");

  const filteredPayroll = payrollData.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Payroll Management
            </h1>
            <p className="mt-2 text-gray-600">
              Manage employee salaries and payroll processing
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="bg-white/50 backdrop-blur-sm">
              <Download className="w-4 h-4 mr-2" />
              Export Payroll
            </Button>
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
              <Calculator className="w-4 h-4 mr-2" />
              Process Payroll
            </Button>
          </div>
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
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <p className="text-xs text-green-600 font-medium">
                  {stat.change} from last month
                </p>
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
                placeholder="Search by name, employee ID, or department..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button variant="outline" className="bg-white/50 backdrop-blur-sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payroll Table */}
      <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
              <DollarSign className="h-4 w-4 text-white" />
            </div>
            <span>Employee Payroll</span>
          </CardTitle>
          <CardDescription>
            Monthly salary breakdown for all employees
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Base Salary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Allowances
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deductions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net Salary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPayroll.map((employee) => (
                  <tr
                    key={employee.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-sm">
                          <span className="text-sm font-bold text-white">
                            {employee.avatar}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {employee.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {employee.employeeId}
                          </div>
                          <div className="text-xs text-gray-400">
                            {employee.department}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${employee.baseSalary.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      +${employee.allowances.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      -${employee.deductions.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ${employee.netSalary.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          employee.status === "Processed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/50"
                        >
                          View Details
                        </Button>
                        {employee.status === "Pending" && (
                          <Button
                            size="sm"
                            className="bg-green-500 hover:bg-green-600"
                          >
                            Process
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
