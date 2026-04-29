import { Check, Package, Truck, Home, X } from "lucide-react";

const STEPS = [
  { key: "pending", label: "Ordered", Icon: Check },
  { key: "confirmed", label: "Packed", Icon: Package },
  { key: "shipped", label: "Shipped", Icon: Truck },
  { key: "delivered", label: "Delivered", Icon: Home },
];

const ORDER = ["pending", "confirmed", "shipped", "delivered"];

const OrderTracking = ({ status }: { status: string }) => {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
        <X className="h-4 w-4" /> Order cancelled
      </div>
    );
  }
  const currentIdx = Math.max(0, ORDER.indexOf(status));
  return (
    <div className="flex items-center justify-between gap-1 py-2">
      {STEPS.map((step, i) => {
        const reached = i <= currentIdx;
        const Icon = step.Icon;
        return (
          <div key={step.key} className="flex-1 flex flex-col items-center relative">
            <div
              className={`h-9 w-9 rounded-full flex items-center justify-center border-2 transition-colors ${
                reached ? "bg-primary border-primary text-primary-foreground" : "bg-card border-border text-muted-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
            </div>
            <span className={`text-[11px] mt-1.5 font-medium ${reached ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</span>
            {i < STEPS.length - 1 && (
              <div
                className={`absolute top-4 left-[calc(50%+18px)] right-[calc(-50%+18px)] h-0.5 ${
                  i < currentIdx ? "bg-primary" : "bg-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrderTracking;
