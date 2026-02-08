import { useGetMyApplicationsQuery } from "@/services/adoption";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Loader from "@/components/common/loader";
import { Link } from "react-router";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || "";

function MyApplicationsPage() {
  const { data, isLoading } = useGetMyApplicationsQuery(undefined, {
    selectFromResult: ({ data, ...rest }) => ({
      data: data?.result ?? [],
      ...rest,
    }),
  });

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-4">
      <h1 className="font-semibold text-lg">My Adoption Applications</h1>
      {!data?.length ? (
        <p className="text-muted-foreground">
          You have not applied for any pet yet.
        </p>
      ) : (
        <div className="space-y-3">
          {data.map((app: any) => (
            <Card key={app._id}>
              <CardContent className="p-4 flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[200px] flex gap-4">
                  {app.pet?.imageUrl ? (
                    <img
                      src={API_BASE + app.pet.imageUrl}
                      alt={app.pet.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                      No image
                    </div>
                  )}
                  <div>
                    <Link
                      to={`/pets/${app.pet?._id}`}
                      className="font-medium hover:underline"
                    >
                      {app.pet?.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {app.pet?.breed} • {app.pet?.species}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Applied on{" "}
                      {app.createdOn
                        ? new Date(app.createdOn).toLocaleDateString()
                        : ""}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={
                    app.status === "Approved"
                      ? "success"
                      : app.status === "Rejected"
                        ? "destructive"
                        : "secondary"
                  }
                  className="rounded-sm"
                >
                  {app.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyApplicationsPage;
