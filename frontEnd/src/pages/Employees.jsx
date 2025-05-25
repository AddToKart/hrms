import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Edit, Trash2, Filter, MoreVertical } from "lucide-react";

const employees = [
  {
    id: 1,
    name: "John Doe",
    email: "john@company.com",
    department: "Engineering",
    position: "Senior Developer",
    status: "Active",
    avatar: "JD",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@company.com",
    department: "Marketing",
    position: "Marketing Manager",
    status: "Active",
    avatar: "JS",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@company.com",
    department: "HR",
    position: "HR Specialist",
    status: "Active",
    avatar: "MJ",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah@company.com",
    department: "Finance",
    position: "Accountant",
    status: "On Leave",
    avatar: "SW",
  },
  {
    id: 5,
    name: "David Chen",
    email: "david@company.com",
    department: "Engineering",
    position: "Frontend Developer",
    status: "Active",
    avatar: "DC",
  },
  {
    id: 6,
    name: "Lisa Rodriguez",
    email: "lisa@company.com",
    department: "Marketing",
    position: "Content Specialist",
    status: "Active",
    avatar: "LR",
  },
];

export default function Employees() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Employees
            </h1>
            <p className="mt-2 text-gray-600">
              Manage your employee records and information
            </p>
          </div>
          <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-lg hover:shadow-xl transition-all duration-200">
            <Plus className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search employees by name, email, or department..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="bg-white/50 backdrop-blur-sm border-gray-200 hover:bg-white/80"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Employee Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <Card
            key={employee.id}
            className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg bg-white/70 backdrop-blur-sm"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-sm font-bold text-white">
                      {employee.avatar}
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {employee.name}
                    </CardTitle>
                    <p className="text-sm text-gray-500">{employee.position}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Email</span>
                  <span className="text-sm font-medium text-gray-900">
                    {employee.email}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Department</span>
                  <span className="text-sm font-medium text-gray-900">
                    {employee.department}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Status</span>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      employee.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {employee.status}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2 pt-4 border-t border-gray-100">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-white/50 hover:bg-white/80"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-white/50 hover:bg-white/80 text-red-600 hover:text-red-700 border-red-200"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredEmployees.length === 0 && (
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardContent className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No employees found
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search criteria or add a new employee.
            </p>
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
