import { useState, useEffect } from "react";
import { User, Mail, Lock, MapPin, GraduationCap, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { User as UserType } from "@shared/schema";

interface ProfileSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail: string;
  user?: UserType;
}

export function ProfileSettings({ open, onOpenChange, userEmail, user }: ProfileSettingsProps) {
  const { toast } = useToast();
  const [college, setCollege] = useState(user?.college || "");
  const [timezone, setTimezone] = useState(user?.timezone || "UTC");

  useEffect(() => {
    if (user) {
      setCollege(user.college || "");
      setTimezone(user.timezone || "UTC");
    }
  }, [user]);
  
  const updateProfileMutation = useMutation({
    mutationFn: async (data: { college: string; timezone: string }) => {
      await apiRequest("PATCH", "/api/auth/user", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({ college, timezone });
  };

  const userName = user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName}`
    : user?.firstName || "User";
  
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Profile Settings</DialogTitle>
            <DialogDescription>
              Update your personal information and preferences
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="flex justify-center">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-lg">{initials}</AvatarFallback>
              </Avatar>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </Label>
              <Input
                id="name"
                value={userName}
                disabled
                data-testid="input-profile-name"
              />
              <p className="text-xs text-muted-foreground">Managed by your account</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={userEmail}
                disabled
                data-testid="input-profile-email"
              />
              <p className="text-xs text-muted-foreground">Managed by your account</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="college" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                College/University
              </Label>
              <Input
                id="college"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                data-testid="input-profile-college"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Timezone
              </Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger data-testid="select-profile-timezone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  <SelectItem value="America/Chicago">Central Time</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  <SelectItem value="Asia/Kolkata">India Standard Time</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" data-testid="button-save-profile">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
