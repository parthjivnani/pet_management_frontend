import { useState } from "react";
import { useGetPetsQuery } from "@/services/pet";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Loader from "@/components/common/loader";
import { Link } from "react-router";
import type { Pet } from "@/models/pet";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || "";

function PetListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [species, setSpecies] = useState<string>("");
  const [breed, setBreed] = useState<string>("");
  const [ageMin, setAgeMin] = useState<string>("");
  const [ageMax, setAgeMax] = useState<string>("");
  const limit = 9;

  const { data, isLoading } = useGetPetsQuery({
    page,
    limit,
    search: search || undefined,
    species: species || undefined,
    breed: breed || undefined,
    ageMin: ageMin ? parseInt(ageMin, 10) : undefined,
    ageMax: ageMax ? parseInt(ageMax, 10) : undefined,
    status: "Available",
  });

  const result = data?.result;
  const list = result?.list ?? [];
  const totalPages = result?.totalPages ?? 0;
  const total = result?.total ?? 0;

  const handleSearch = () => {
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pets Available for Adoption</h1>

      <Card>
        <CardContent className="pt-4 space-y-4">
          <div className="flex flex-wrap gap-2 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm text-muted-foreground">
                Search (name/breed)
              </label>
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Species</label>
              <Input
                placeholder="e.g. Dog"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                className="mt-1 w-[120px]"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Breed</label>
              <Input
                placeholder="e.g. Labrador"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="mt-1 w-[120px]"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Age min</label>
              <Input
                type="number"
                min={0}
                placeholder="0"
                value={ageMin}
                onChange={(e) => setAgeMin(e.target.value)}
                className="mt-1 w-[80px]"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Age max</label>
              <Input
                type="number"
                min={0}
                placeholder="any"
                value={ageMax}
                onChange={(e) => setAgeMax(e.target.value)}
                className="mt-1 w-[80px]"
              />
            </div>
            <Button onClick={handleSearch}>
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.map((pet: Pet) => (
              <Card key={pet._id} className="overflow-hidden">
                <Link to={`/pets/${pet._id}`}>
                  <div className="aspect-[4/3] bg-muted relative">
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
                    <Badge
                      className="absolute top-2 right-2"
                      variant="secondary"
                    >
                      {pet.status}
                    </Badge>
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-semibold">{pet.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {pet.breed} • {pet.species} • {pet.age} yrs
                    </p>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>

          {list.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No pets found. Try adjusting filters.
            </p>
          )}

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

export default PetListPage;
