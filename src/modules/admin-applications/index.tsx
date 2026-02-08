import { useState } from "react";
import {
  useGetAllAdoptionsQuery,
  useApproveAdoptionMutation,
  useRejectAdoptionMutation,
} from "@/services/adoption";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Loader from "@/components/common/loader";
import showToast from "@/components/common/toast";
import { Link } from "react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || "";

function AdminApplicationsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>("");
  const limit = 10;

  const { data, isLoading, refetch } = useGetAllAdoptionsQuery({
    page,
    limit,
    status: status || undefined,
  });

  const [approveAdoption] = useApproveAdoptionMutation();
  const [rejectAdoption] = useRejectAdoptionMutation();

  const result = data?.result;
  const list = result?.list ?? [];
  const totalPages = result?.totalPages ?? 0;
  const total = result?.total ?? 0;

  const handleApprove = (id: string) => {
    approveAdoption(id)
      .then((res: any) => {
        showToast(res?.data?.message, "success");
        refetch();
      })
      .catch((err: any) => showToast(err?.data?.message, "error"));
  };
  const handleReject = (id: string) => {
    rejectAdoption(id)
      .then((res: any) => {
        showToast(res?.data?.message, "success");
        refetch();
      })
      .catch((err: any) => showToast(err?.data?.message, "error"));
  };

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-4">
      <h1 className="font-semibold text-lg">Adoption Applications</h1>
      <div className="flex gap-2 items-center">
        <span className="text-sm text-muted-foreground">Filter:</span>
        <select
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      {list.length === 0 ? (
        <p className="text-muted-foreground">No applications found.</p>
      ) : (
        <>
          <div className="space-y-3">
            {list.map((app: any) => (
              <Card key={app._id}>
                <CardContent className="p-4 flex flex-wrap items-center gap-4">
                  <div className="flex-1 min-w-[200px] flex gap-4">
                    {app.pet?.imageUrl ? (
                      <img
                        src={API_BASE + app.pet.imageUrl}
                        alt={app.pet?.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-muted rounded flex items-center justify-center text-xs">
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
                        Applicant: {app.user?.firstName} {app.user?.lastName} (
                        {app.user?.email})
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(app.createdOn).toLocaleString()}
                      </p>
                      {app.message && (
                        <p className="text-sm mt-1 text-muted-foreground">
                          Message: {app.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge
                    variant={
                      app.status === "approved"
                        ? "success"
                        : app.status === "rejected"
                          ? "destructive"
                          : "secondary"
                    }
                    className="rounded-sm"
                  >
                    {app.status}
                  </Badge>
                  {app.status === "pending" && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleApprove(app._id)}>
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(app._id)}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {page} of {totalPages} ({total} total)
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminApplicationsPage;
