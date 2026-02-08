import { useParams, Link } from "react-router";
import { useGetPetByIdQuery } from "@/services/pet";
import { useApplyAdoptionMutation } from "@/services/adoption";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Loader from "@/components/common/loader";
import showToast from "@/components/common/toast";
import { getToken } from "@/lib/utils";
import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || "";

function PetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [message, setMessage] = useState("");
  const { data, isLoading } = useGetPetByIdQuery(id!, { skip: !id });
  const [applyAdoption, { isLoading: isApplying }] = useApplyAdoptionMutation();
  const isLoggedIn = !!getToken();

  const pet = data?.result;
  const isAvailable = pet?.status === "Available";

  const handleApply = () => {
    if (!id || !isLoggedIn) return;
    applyAdoption({ petId: id, message: message || undefined })
      .then((res: any) => {
        showToast(res?.data?.message ?? "Application submitted", "success");
      })
      .catch((err: any) => {
        showToast(err?.data?.message ?? "Failed to apply", "error");
      });
  };

  if (isLoading || !id) {
    return <Loader />;
  }
  if (!pet) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Pet not found.</p>
        <Button asChild className="mt-4">
          <Link to="/pets">Back to list</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" asChild>
        <Link to="/pets">← Back to pets</Link>
      </Button>
      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="aspect-[4/3] bg-muted">
            {pet.imageUrl ? (
              <img
                src={API_BASE + pet.imageUrl}
                alt={pet.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No image
              </div>
            )}
          </div>
          <CardContent className="p-6 flex flex-col justify-center">
            <Badge variant="secondary" className="w-fit mb-2">
              {pet.status}
            </Badge>
            <h1 className="text-2xl font-bold">{pet.name}</h1>
            <p className="text-sm text-black">
              Species - <b className="text-black">{pet.species}</b>
            </p>
            <p className="text-sm text-black">
              Breed - <b className="text-black">{pet.breed}</b> | Age -{" "}
              <b className="text-black">{pet.age} yrs</b>
            </p>
            {pet.description && (
              <p className="mt-4 text-black">
                {" "}
                <b className="text-black">Pet Description - </b>
                {pet.description}
              </p>
            )}
            {isAvailable && isLoggedIn && (
              <div className="mt-6">
                <textarea
                  className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 pt-2 text-sm"
                  placeholder="Optional message for your application..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={300}
                />
                <p className="text-right text-xs text-muted-foreground mb-2">
                  {message.length}/300
                </p>
                <Button
                  className="w-full"
                  onClick={handleApply}
                  disabled={isApplying}
                >
                  {isApplying ? "Submitting..." : "Apply to Adopt"}
                </Button>
              </div>
            )}
            {isAvailable && !isLoggedIn && (
              <p className="mt-4 text-sm text-muted-foreground">
                <Link to="/auth/sign-in" className="text-primary underline">
                  Log in
                </Link>{" "}
                to apply for adoption.
              </p>
            )}
          </CardContent>
        </div>
      </Card>
    </div>
  );
}

export default PetDetailPage;
