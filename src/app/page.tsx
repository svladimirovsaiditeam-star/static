import { listOffers } from "@/lib/db/offers";
import { OffersTable } from "@/components/OffersTable";
import { AddOfferForm } from "@/components/AddOfferForm";
import { logoutAction } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const offers = await listOffers();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-xl font-medium text-neutral-100">Запуски</h1>
        <form action={logoutAction}>
          <button className="text-sm text-neutral-500 hover:text-neutral-300">
            Выйти
          </button>
        </form>
      </div>

      <div className="mb-6">
        <AddOfferForm />
      </div>

      <OffersTable offers={offers} />
    </div>
  );
}
