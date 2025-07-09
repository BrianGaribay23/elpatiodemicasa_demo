import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  UserPlus,
  Users,
  User,
  Filter,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Student {
  id: string;
  name: string;
  email: string;
  level: string;
  credits: number;
  status: "active" | "inactive";
  group: string;
}

interface Teacher {
  id: string;
  name: string;
  email: string;
  specialties: string[];
  availability: string;
  activeClasses: number;
  status: "active" | "inactive";
}

interface Group {
  id: string;
  name: string;
  level: string;
  teacher: string;
  schedule: string;
  students: number;
  maxStudents: number;
  status: "active" | "inactive";
}

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState("students");
  const [searchTerm, setSearchTerm] = useState("");
  const [showUserDialog, setShowUserDialog] = useState(false);

  // Mock data for demonstration
  const students: Student[] = [
    {
      id: "1",
      name: "Ana García",
      email: "ana@example.com",
      level: "Intermediate",
      credits: 10,
      status: "active",
      group: "Group A",
    },
    {
      id: "2",
      name: "Carlos Rodríguez",
      email: "carlos@example.com",
      level: "Beginner",
      credits: 5,
      status: "active",
      group: "Group B",
    },
    {
      id: "3",
      name: "Elena Martínez",
      email: "elena@example.com",
      level: "Advanced",
      credits: 15,
      status: "inactive",
      group: "Group C",
    },
    {
      id: "4",
      name: "David López",
      email: "david@example.com",
      level: "Intermediate",
      credits: 8,
      status: "active",
      group: "Group A",
    },
    {
      id: "5",
      name: "Sofia Fernández",
      email: "sofia@example.com",
      level: "Beginner",
      credits: 12,
      status: "active",
      group: "Group B",
    },
  ];

  const teachers: Teacher[] = [
    {
      id: "1",
      name: "María González",
      email: "maria@example.com",
      specialties: ["Conversation", "Grammar"],
      availability: "Morning",
      activeClasses: 8,
      status: "active",
    },
    {
      id: "2",
      name: "Juan Pérez",
      email: "juan@example.com",
      specialties: ["Business Spanish", "Literature"],
      availability: "Afternoon",
      activeClasses: 5,
      status: "active",
    },
    {
      id: "3",
      name: "Laura Sánchez",
      email: "laura@example.com",
      specialties: ["Beginner", "Intermediate"],
      availability: "Evening",
      activeClasses: 10,
      status: "active",
    },
    {
      id: "4",
      name: "Roberto Díaz",
      email: "roberto@example.com",
      specialties: ["Advanced", "Conversation"],
      availability: "Full day",
      activeClasses: 12,
      status: "inactive",
    },
  ];

  const groups: Group[] = [
    {
      id: "1",
      name: "Group A",
      level: "Intermediate",
      teacher: "María González",
      schedule: "Mon/Wed 10:00-11:30",
      students: 3,
      maxStudents: 4,
      status: "active",
    },
    {
      id: "2",
      name: "Group B",
      level: "Beginner",
      teacher: "Juan Pérez",
      schedule: "Tue/Thu 15:00-16:30",
      students: 2,
      maxStudents: 4,
      status: "active",
    },
    {
      id: "3",
      name: "Group C",
      level: "Advanced",
      teacher: "Laura Sánchez",
      schedule: "Mon/Fri 18:00-19:30",
      students: 4,
      maxStudents: 4,
      status: "active",
    },
    {
      id: "4",
      name: "Group D",
      level: "Intermediate",
      teacher: "Roberto Díaz",
      schedule: "Wed/Fri 09:00-10:30",
      students: 1,
      maxStudents: 4,
      status: "inactive",
    },
  ];

  const getStatusBadge = (status: "active" | "inactive") => {
    return status === "active" ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
        Active
      </Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
        Inactive
      </Badge>
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button onClick={() => setShowUserDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="students" className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            Students
          </TabsTrigger>
          <TabsTrigger value="teachers" className="flex items-center">
            <UserPlus className="h-4 w-4 mr-2" />
            Teachers
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Groups
          </TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={`Search ${activeTab}...`}
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <TabsContent value="students" className="mt-0">
            <CardHeader className="pb-0">
              <CardTitle>Students</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead>Group</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow
                      key={student.id}
                      className="border-b border-gray-100"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`}
                            />
                            <AvatarFallback>
                              {student.name.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          {student.name}
                        </div>
                      </TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.level}</TableCell>
                      <TableCell>{student.credits}</TableCell>
                      <TableCell>{student.group}</TableCell>
                      <TableCell>{getStatusBadge(student.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </TabsContent>

          <TabsContent value="teachers" className="mt-0">
            <CardHeader className="pb-0">
              <CardTitle>Teachers</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Specialties</TableHead>
                    <TableHead>Availability</TableHead>
                    <TableHead>Active Classes</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachers.map((teacher) => (
                    <TableRow
                      key={teacher.id}
                      className="border-b border-gray-100"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${teacher.name}`}
                            />
                            <AvatarFallback>
                              {teacher.name.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          {teacher.name}
                        </div>
                      </TableCell>
                      <TableCell>{teacher.email}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {teacher.specialties.map((specialty, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-200"
                            >
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{teacher.availability}</TableCell>
                      <TableCell>{teacher.activeClasses}</TableCell>
                      <TableCell>{getStatusBadge(teacher.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </TabsContent>

          <TabsContent value="groups" className="mt-0">
            <CardHeader className="pb-0">
              <CardTitle>Groups</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead>Name</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groups.map((group) => (
                    <TableRow
                      key={group.id}
                      className="border-b border-gray-100"
                    >
                      <TableCell className="font-medium">
                        {group.name}
                      </TableCell>
                      <TableCell>{group.level}</TableCell>
                      <TableCell>{group.teacher}</TableCell>
                      <TableCell>{group.schedule}</TableCell>
                      <TableCell>
                        {group.students}/{group.maxStudents}
                      </TableCell>
                      <TableCell>{getStatusBadge(group.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </TabsContent>
        </Card>
      </Tabs>

      {/* Add/Edit User Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {activeTab === "students"
                ? "Add Student"
                : activeTab === "teachers"
                  ? "Add Teacher"
                  : "Add Group"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {activeTab === "students" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name
                    </label>
                    <Input id="name" placeholder="Full name" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email address"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="level" className="text-sm font-medium">
                      Level
                    </label>
                    <Select>
                      <SelectTrigger id="level">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="credits" className="text-sm font-medium">
                      Credits
                    </label>
                    <Input
                      id="credits"
                      type="number"
                      placeholder="Initial credits"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="group" className="text-sm font-medium">
                      Group
                    </label>
                    <Select>
                      <SelectTrigger id="group">
                        <SelectValue placeholder="Assign to group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="group-a">Group A</SelectItem>
                        <SelectItem value="group-b">Group B</SelectItem>
                        <SelectItem value="group-c">Group C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="status" className="text-sm font-medium">
                      Status
                    </label>
                    <Select defaultValue="active">
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            {activeTab === "teachers" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name
                    </label>
                    <Input id="name" placeholder="Full name" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email address"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="specialties" className="text-sm font-medium">
                    Specialties
                  </label>
                  <Select>
                    <SelectTrigger id="specialties">
                      <SelectValue placeholder="Select specialties" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conversation">Conversation</SelectItem>
                      <SelectItem value="grammar">Grammar</SelectItem>
                      <SelectItem value="business">Business Spanish</SelectItem>
                      <SelectItem value="literature">Literature</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="availability"
                      className="text-sm font-medium"
                    >
                      Availability
                    </label>
                    <Select>
                      <SelectTrigger id="availability">
                        <SelectValue placeholder="Select availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning</SelectItem>
                        <SelectItem value="afternoon">Afternoon</SelectItem>
                        <SelectItem value="evening">Evening</SelectItem>
                        <SelectItem value="full-day">Full Day</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="status" className="text-sm font-medium">
                      Status
                    </label>
                    <Select defaultValue="active">
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            {activeTab === "groups" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Group Name
                    </label>
                    <Input id="name" placeholder="Group name" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="level" className="text-sm font-medium">
                      Level
                    </label>
                    <Select>
                      <SelectTrigger id="level">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="teacher" className="text-sm font-medium">
                      Teacher
                    </label>
                    <Select>
                      <SelectTrigger id="teacher">
                        <SelectValue placeholder="Assign teacher" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="maria">María González</SelectItem>
                        <SelectItem value="juan">Juan Pérez</SelectItem>
                        <SelectItem value="laura">Laura Sánchez</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="schedule" className="text-sm font-medium">
                      Schedule
                    </label>
                    <Input
                      id="schedule"
                      placeholder="e.g. Mon/Wed 10:00-11:30"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="maxStudents"
                      className="text-sm font-medium"
                    >
                      Max Students
                    </label>
                    <Input id="maxStudents" type="number" defaultValue="4" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="status" className="text-sm font-medium">
                      Status
                    </label>
                    <Select defaultValue="active">
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowUserDialog(false)}>
              Cancel
            </Button>
            <Button>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
