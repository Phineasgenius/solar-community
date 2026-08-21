import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "resident" | "rwa";

export type Subscription = {
  plantId: string;
  plantName: string;
  kw: number;
  subscribedAt: string; // ISO date
};

type UserState = {
  role: Role;
  setRole: (role: Role) => void;

  consumerId: string;
  setConsumerId: (id: string) => void;

  discomId: string;
  setDiscomId: (id: string) => void;

  monthlyBill: number;
  setMonthlyBill: (val: number) => void;

  // Multiple community-solar subscriptions are supported — a resident can
  // hold a share in more than one plant at once.
  subscriptions: Subscription[];
  subscribe: (plantId: string, plantName: string, kw: number) => void;
  unsubscribe: (plantId: string) => void;
  updateShare: (plantId: string, kw: number) => void;

  // Plants a resident has asked to be notified about once capacity frees up.
  waitlist: string[];
  joinWaitlist: (plantId: string) => void;
  leaveWaitlist: (plantId: string) => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      role: "resident",
      setRole: (role) => set({ role }),

      consumerId: "",
      setConsumerId: (consumerId) => set({ consumerId }),

      discomId: "bses-rajdhani",
      setDiscomId: (discomId) => set({ discomId }),

      monthlyBill: 4500,
      setMonthlyBill: (monthlyBill) => set({ monthlyBill }),

      subscriptions: [],
      subscribe: (plantId, plantName, kw) => {
        const existing = get().subscriptions.find((s) => s.plantId === plantId);
        if (existing) {
          set({
            subscriptions: get().subscriptions.map((s) =>
              s.plantId === plantId ? { ...s, kw } : s
            ),
          });
          return;
        }
        set({
          subscriptions: [
            ...get().subscriptions,
            { plantId, plantName, kw, subscribedAt: new Date().toISOString() },
          ],
          waitlist: get().waitlist.filter((id) => id !== plantId),
        });
      },
      unsubscribe: (plantId) =>
        set({ subscriptions: get().subscriptions.filter((s) => s.plantId !== plantId) }),
      updateShare: (plantId, kw) =>
        set({
          subscriptions: get().subscriptions.map((s) =>
            s.plantId === plantId ? { ...s, kw } : s
          ),
        }),

      waitlist: [],
      joinWaitlist: (plantId) =>
        set({ waitlist: Array.from(new Set([...get().waitlist, plantId])) }),
      leaveWaitlist: (plantId) => set({ waitlist: get().waitlist.filter((id) => id !== plantId) }),
    }),
    { name: "sunshare-user-store" }
  )
);
