import { 
  BookOpen, 
  Users, 
  GraduationCap, 
  Award, 
  BarChart3,
  UserCog,
  ClipboardList,
  Home,
  Code,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";

export function AppSidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  const getMenuItems = () => {
    if (!user) return [];

    const commonItems = [
      { title: "Dashboard", url: "/", icon: Home },
    ];

    switch (user.role) {
      case "student":
        return [
          ...commonItems,
          { title: "My Assignments", url: "/assignments", icon: ClipboardList },
          { title: "Code Editor", url: "/code-editor", icon: Code },
          { title: "My Grades", url: "/grades", icon: BarChart3 },
          { title: "Grant Status", url: "/grants", icon: Award },
        ];
      case "teacher":
        return [
          ...commonItems,
          { title: "My Students", url: "/students", icon: Users },
          { title: "Grade Entry", url: "/grade-entry", icon: BookOpen },
          { title: "Submissions", url: "/submissions", icon: ClipboardList },
        ];
      case "student_affairs":
        return [
          ...commonItems,
          { title: "Students", url: "/manage-students", icon: Users },
          { title: "Grades", url: "/manage-grades", icon: BookOpen },
          { title: "Attendance", url: "/manage-attendance", icon: ClipboardList },
          { title: "Faculty", url: "/manage-faculty", icon: UserCog },
        ];
      case "academic_affairs":
        return [
          ...commonItems,
          { title: "Overview", url: "/academic-overview", icon: BarChart3 },
          { title: "Subjects", url: "/subjects", icon: BookOpen },
          { title: "Reports", url: "/reports", icon: ClipboardList },
        ];
      case "grant_committee":
        return [
          ...commonItems,
          { title: "Applications", url: "/grant-applications", icon: Award },
          { title: "Review Queue", url: "/grant-review", icon: ClipboardList },
          { title: "Statistics", url: "/grant-stats", icon: BarChart3 },
        ];
      default:
        return commonItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <Sidebar data-testid="sidebar-main">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-lg font-semibold">PDP University</h2>
            <p className="text-xs text-muted-foreground">Monitoring Platform</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url} data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
