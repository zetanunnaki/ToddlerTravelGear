"use client";

import { PACKING_LIST_FAQ } from "@/data/packing-list-items";
import { FAQ } from "./FAQ";

export function PackingListFAQ() {
  return <FAQ items={PACKING_LIST_FAQ} />;
}
