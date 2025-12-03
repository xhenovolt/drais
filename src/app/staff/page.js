"use client";

import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

const staff = [
  {
    id: "ST001",
    name: "Dr. Sarah Williams",
    email: "sarah.williams@school.edu",
    role: "Principal",
    department: "Administration",
    phone: "+1 (555) 123-4567",
    status: "Active",
    joinDate: "2020-08-15",
    avatar: "SW",
  },
  {
    id: "ST002",
    name: "Michael Johnson",
    email: "michael.johnson@school.edu",
    role: "Mathematics Teacher",
    department: "Mathematics",
    phone: "+1 (555) 234-5678",
    status: "Active",
    joinDate: "2021-01-10",
    avatar: "MJ",
  },
  {
    id: "ST003",
    name: "Emily Davis",
    email: "emily.davis@school.edu",
    role: "English Teacher",
    department: "English",
    phone: "+1 (555) 345-6789",
    status: "On Leave",
    joinDate: "2019-09-01",
    avatar: "ED",
  },
  {
    id: "ST004",
    name: "Robert Chen",
    email: "robert.chen@school.edu",
    role: "Science Teacher",
    department: "Science",
    phone: "+1 (555) 456-7890",
    status: "Active",
    joinDate: "2022-03-15",
    avatar: "RC",
  },
  {
    id: "ST005",
    name: "Lisa Thompson",
    email: "lisa.thompson@school.edu",
    role: "Librarian",
    department: "Library",
    phone: "+1 (555) 567-8901",
    status: "Active",
    joinDate: "2020-11-20",
    avatar: "LT",
  },
];

const stats = [
  { name: "Total Staff", value: "142", icon: Users, color: "from-blue-500 to-blue-600" },
  { name: "Teachers", value: "98", icon: UserCheck, color: "from-green-500 to-green-600" },
  { name: "Admin Staff", value: "28", icon: UserPlus, color: "from-purple-500 to-purple-600" },
  { name: "On Leave", value: "16", icon: Users, color: "from-orange-500 to-orange-600" },
];

export default function Staff() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Staff Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage staff records, roles, and performance tracking
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <Button variant="outline" className="gap-2">
              <Upload className="w-4 h-4" />
              Import
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Link href="/staff/add">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2">
                <Plus className="w-4 h-4" />
                Add Staff
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.name}
                    </p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-blue-950/30">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search staff by name, ID, role, department..."
                      className="pl-10 bg-white dark:bg-gray-900"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="gap-2">
                    <Filter className="w-4 h-4" />
                    Filters
                  </Button>
                  <Button variant="outline">Department</Button>
                  <Button variant="outline">Role</Button>
                  <Button variant="outline">Status</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Staff Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>All Staff Members</CardTitle>
              <CardDescription>
                A complete list of all staff members in your institution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-gray-800">
                      <TableHead>Staff Member</TableHead>
                      <TableHead>Staff ID</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staff.map((member, index) => (
                      <motion.tr
                        key={member.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.05 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold">
                                {member.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {member.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">{member.id}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{member.role}</Badge>
                        </TableCell>
                        <TableCell>{member.department}</TableCell>
                        <TableCell className="font-mono text-sm">{member.phone}</TableCell>
                        <TableCell>
                          <Badge
                            variant={member.status === "Active" ? "default" : "secondary"}
                            className={
                              member.status === "Active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            }
                          >
                            {member.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{member.joinDate}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="gap-2">
                                <Eye className="w-4 h-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2">
                                <Edit className="w-4 h-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 text-red-600">
                                <Trash2 className="w-4 h-4" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing 1 to 5 of 142 staff members
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    2
                  </Button>
                  <Button variant="outline" size="sm">
                    3
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}