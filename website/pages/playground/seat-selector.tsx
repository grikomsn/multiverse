import clsx from "clsx";
import { PageHeader } from "ui/page/header";

const EXAMPLE_SEATS = [
  [-1, 0, 0, 2, 2, 2, 0, 0],
  [0, 0, 1, 1, 0, 0, 0, -1],
  [0, 0, -1, 0, 1, 1, 1, 0],
  [0, 0, 0, 0, 2, 2, 2, 2],
];

const COLUMNS = Math.max(...EXAMPLE_SEATS.map((row) => row.length));

export default function SeatSelectorPage() {
  return (
    <section className="space-y-8">
      <PageHeader
        className="pt-[5rem] md:pt-[10rem]"
        description="A friend asked how to make a seat selector UI, soooo yeah"
        title="Seat Selector"
      />
      <div className="grid gap-4 p-4" style={{ gridTemplateColumns: `repeat(${COLUMNS},minmax(0,1fr))` }}>
        {EXAMPLE_SEATS.map((row, rowIndex) =>
          row.map((state, seatIndex) => {
            const id = `${rowIndex}${seatIndex}`;
            return (
              <div key={`seat-${id}`} className="flex justify-center items-center">
                <Seat id={id} state={state} />
              </div>
            );
          }),
        )}
      </div>
    </section>
  );
}

interface SeatProps {
  id: string;
  state: number;
}

function Seat({ id, state }: SeatProps) {
  return (
    <button
      className={clsx(
        "flex flex-col justify-center items-center w-8 h-8 text-xs rounded border border-neutral-500 transition",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        {
          hidden: state === -1,
          "hover:bg-neutral-500 hover:bg-opacity-50": state === 0,
          "border-none": state > 0,
          "bg-neutral-500": state === 1,
          "bg-yellow-700": state === 2,
        },
      )}
      disabled={state > 0}
      type="button"
    >
      {id}
    </button>
  );
}
