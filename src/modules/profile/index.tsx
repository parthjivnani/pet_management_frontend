import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getRole, getUserNames } from "@/lib/utils";

function ProfilePage() {
  const { firstName, lastName } = getUserNames();
  const role = getRole();

  return (
    <div className="space-y-4">
      <h1 className="font-semibold text-lg">My Profile</h1>
      <Card>
        <CardHeader>
          <h2 className="text-base font-medium">Account details</h2>
          <p className="text-sm text-muted-foreground">
            Your profile information
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-muted-foreground">
              First name
            </label>
            <p className="text-sm">{firstName ?? "—"}</p>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-muted-foreground">
              Last name
            </label>
            <p className="text-sm">{lastName ?? "—"}</p>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-muted-foreground">
              Role
            </label>
            <p className="text-sm">
              {role
                ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
                : "—"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProfilePage;
